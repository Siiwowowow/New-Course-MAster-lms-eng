// File: /api/admin/courses/route.js (simplified version)

import dbConnect from '@/lib/mongoose';
import Course from '@/models/Course';
import { NextResponse } from 'next/server';

// Helper function to generate slug
const generateSlug = async (title) => {
  let baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/--+/g, '-');    // Replace multiple hyphens with single hyphen

  let courseSlug = baseSlug;
  let counter = 1;

  // Check if slug exists and generate unique one
  while (await Course.findOne({ courseSlug })) {
    courseSlug = `${baseSlug}-${counter++}`;
  }

  return courseSlug;
};

// POST - Create new course
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validation
    const requiredFields = ['title', 'description', 'instructor', 'price', 'category'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Validate price
    const price = parseFloat(body.price);
    if (isNaN(price) || price < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid price value' },
        { status: 400 }
      );
    }

    // Generate unique slug
    const courseSlug = await generateSlug(body.title);

    // Prepare course data
    const courseData = {
      title: body.title.trim(),
      description: body.description.trim(),
      instructor: body.instructor.trim(),
      price: price,
      category: body.category,
      courseSlug: courseSlug,
      image: body.image || '/default-course.jpg'
    };

    // Create course
    const course = await Course.create(courseData);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Course created successfully',
        data: course 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('POST /api/admin/courses error:', error);

    // Handle duplicate key error (unique slug)
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Course with similar title already exists. Please try a different title.' 
        },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create course. Please try again.' 
      },
      { status: 500 }
    );
  }
}

// GET - Fetch all courses with optional query params
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    let query = {};
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch courses with total count
    const [courses, totalCourses] = await Promise.all([
      Course.find(query)
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: courses,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCourses / limit),
        totalCourses,
        hasNextPage: page * limit < totalCourses,
        hasPreviousPage: page > 1
      }
    }, { status: 200 });

  } catch (error) {
    console.error('GET /api/admin/courses error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}


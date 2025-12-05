import dbConnect from "@/lib/mongoose";
import Course from "@/models/Course";
import { NextResponse } from "next/server";

// GET all courses with filtering, sorting, pagination, and searching
export async function GET(request) {
  try {
    await dbConnect();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 9;
    const skip = (page - 1) * limit;
    
    // Search parameters
    const searchQuery = searchParams.get('search') || '';
    const instructor = searchParams.get('instructor') || '';
    
    // Filter parameters
    const category = searchParams.get('category') || '';
    const tags = searchParams.get('tags') || '';
    const minPrice = searchParams.get('minPrice') || 0;
    const maxPrice = searchParams.get('maxPrice') || Number.MAX_SAFE_INTEGER;
    
    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Build filter object
    let filter = {};
    
    // Search by title or instructor
    if (searchQuery) {
      filter.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { instructor: { $regex: searchQuery, $options: 'i' } }
      ];
    }
    
    // Filter by specific instructor
    if (instructor) {
      filter.instructor = { $regex: instructor, $options: 'i' };
    }
    
    // Filter by category
    if (category) {
      filter.category = category;
    }
    
    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      filter.tags = { $in: tagArray };
    }
    
    // Filter by price range
    filter.price = { 
      $gte: parseFloat(minPrice), 
      $lte: parseFloat(maxPrice) 
    };
    
    // Determine sort order
    const sortOptions = {};
    if (sortBy === 'price') {
      sortOptions.price = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'title') {
      sortOptions.title = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'createdAt') {
      sortOptions.createdAt = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'rating') {
      sortOptions.rating = sortOrder === 'asc' ? 1 : -1;
    }
    
    // Execute query with pagination
    const [courses, totalCourses] = await Promise.all([
      Course.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments(filter)
    ]);
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCourses / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return NextResponse.json({
      courses,
      pagination: {
        currentPage: page,
        totalPages,
        totalCourses,
        hasNextPage,
        hasPrevPage,
        limit
      }
    });
    
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// POST create new course
export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const course = await Course.create(data);
    return NextResponse.json(course, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
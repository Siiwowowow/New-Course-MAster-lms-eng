import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Course from '@/models/Course';

export async function POST(request) {
  try {
    const { courseId, userId } = await request.json();

    if (!courseId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Add course to user's enrolled courses
    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: courseId }
    });

    // Increment course enrollment count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrolled: 1 }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Successfully enrolled in course' 
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json(
      { error: 'Failed to enroll in course' },
      { status: 500 }
    );
  }
}
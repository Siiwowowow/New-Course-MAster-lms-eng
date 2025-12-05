// app/api/users/check-enrollment/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const courseId = searchParams.get('courseId');

    if (!email || !courseId) {
      return NextResponse.json(
        { success: false, error: "email and courseId are required" },
        { status: 400 }
      );
    }

    // Find user and check if they have this course in enrolledCourses
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      enrolledCourses: { $elemMatch: { $eq: courseId } }
    }).select('_id name email updatedAt');

    if (user) {
      return NextResponse.json({
        success: true,
        enrolled: true,
        enrolledAt: user.updatedAt,
        user: {
          name: user.name,
          email: user.email
        }
      });
    }

    return NextResponse.json({
      success: true,
      enrolled: false
    });

  } catch (error) {
    console.error("Check enrollment error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
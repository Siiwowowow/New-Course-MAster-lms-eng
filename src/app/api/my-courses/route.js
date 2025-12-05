import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Course from "@/models/Course";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ enrolledCourses থেকে course গুলো আনছি
    const courses = await Course.find({
      _id: { $in: user.enrolledCourses },
    });

    return NextResponse.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("My courses error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

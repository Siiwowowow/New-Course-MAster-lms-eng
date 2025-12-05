// /api/users/update-role-after-payment/route.js
import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/mongoose";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ 
        success: false, 
        message: "Email is required" 
      }, { status: 400 });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: "User not found" 
      }, { status: 404 });
    }

    // Check current role - only update if role is "user"
    if (user.role === 'user') {
      const updatedUser = await User.findOneAndUpdate(
        { email: email.toLowerCase() },
        { $set: { role: 'student' } },
        { new: true, runValidators: true }
      ).select("role email name updatedAt");

      return NextResponse.json({ 
        success: true,
        message: "Role updated from user to student",
        user: {
          role: updatedUser.role,
          email: updatedUser.email,
          name: updatedUser.name,
          updatedAt: updatedUser.updatedAt
        }
      });
    } else {
      // User is already student, teacher, admin, or instructor
      return NextResponse.json({ 
        success: true,
        message: `User already has role: ${user.role}`,
        user: {
          role: user.role,
          email: user.email,
          name: user.name
        }
      });
    }
    
  } catch (error) {
    console.error("Role update error:", error);
    return NextResponse.json({ 
      success: false,
      error: "Internal Server Error"
    }, { status: 500 });
  }
}
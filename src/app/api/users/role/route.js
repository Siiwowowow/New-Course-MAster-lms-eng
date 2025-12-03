// app/api/users/role/route.js
import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/mongoose";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await dbConnect();
    
    const user = await User.findOne(
      { email: email.toLowerCase() },
      { role: 1, email: 1, updatedAt: 1, name: 1 }
    ).lean();

    if (!user) {
      return NextResponse.json({ 
        role: "user", 
        success: false, 
        message: "User not found" 
      });
    }

    return NextResponse.json({ 
      role: user.role || "user", 
      success: true,
      updatedAt: user.updatedAt || new Date().toISOString(),
      name: user.name || ""
    });
  } catch (error) {
    console.error("Role fetch error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error",
      role: "user"
    }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, role } = body;

    if (!email) {
      return NextResponse.json({ 
        success: false, 
        message: "Email is required" 
      }, { status: 400 });
    }

    if (!role || !["user", "student", "instructor", "admin"].includes(role)) {
      return NextResponse.json({ 
        success: false, 
        message: "Valid role is required" 
      }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { role: role } },
      { new: true, runValidators: true }
    ).select("role email name updatedAt");

    if (!updatedUser) {
      return NextResponse.json({ 
        success: false, 
        message: "User not found" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: "Role updated successfully",
      user: {
        role: updatedUser.role,
        email: updatedUser.email,
        name: updatedUser.name,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error) {
    console.error("Role update error:", error);
    return NextResponse.json({ 
      success: false,
      error: "Internal Server Error"
    }, { status: 500 });
  }
}
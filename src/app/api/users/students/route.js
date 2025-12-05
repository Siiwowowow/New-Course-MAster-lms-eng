import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    // শুধু student role যুক্ত users fetch
    const students = await User.find({ role: "student" }).select("name email role");

    return NextResponse.json({ students }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

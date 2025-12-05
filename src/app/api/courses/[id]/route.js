import dbConnect from "@/lib/mongoose";
import Course from "@/models/Course";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    // params is now a Promise, unwrap it
    const resolvedParams = await params;
    await dbConnect();
    const course = await Course.findById(resolvedParams.id);

    if (!course)
      return NextResponse.json({ message: "Course not found" }, { status: 404 });

    return NextResponse.json(course, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    await dbConnect();
    const deletedCourse = await Course.findByIdAndDelete(resolvedParams.id);

    if (!deletedCourse)
      return NextResponse.json({ message: "Course not found" }, { status: 404 });

    return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    await dbConnect();
    const data = await request.json();
    const updatedCourse = await Course.findByIdAndUpdate(resolvedParams.id, data, { new: true });

    if (!updatedCourse)
      return NextResponse.json({ message: "Course not found" }, { status: 404 });

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

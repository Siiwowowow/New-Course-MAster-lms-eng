import dbConnect from "@/lib/mongoose";
import Course from "@/models/Course";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Helper function to generate slug
const generateSlug = async (title, excludeId = null) => {
  let baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");

  let courseSlug = baseSlug;
  let counter = 1;

  const query = { courseSlug };
  if (excludeId) query._id = { $ne: excludeId };

  while (await Course.findOne(query)) {
    courseSlug = `${baseSlug}-${counter++}`;
    query.courseSlug = courseSlug;
  }

  return courseSlug;
};

// GET - Get single course by ID
export async function GET(request, { params }) {
  await dbConnect();

  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: "Invalid course ID" }, { status: 400 });
  }

  const course = await Course.findById(id);

  if (!course) {
    return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: course }, { status: 200 });
}

// PUT - Update course by ID
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid course ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    // Validation
    if (body.title && body.title.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "Title must be at least 5 characters" },
        { status: 400 }
      );
    }

    if (body.description && body.description.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Description must be at least 10 characters" },
        { status: 400 }
      );
    }

    let price = existingCourse.price;
    if (body.price !== undefined) {
      price = parseFloat(body.price);
      if (isNaN(price) || price < 0) {
        return NextResponse.json(
          { success: false, error: "Invalid price value" },
          { status: 400 }
        );
      }
    }

    // Generate new slug if title changed
    let courseSlug = existingCourse.courseSlug;
    if (body.title && body.title !== existingCourse.title) {
      courseSlug = await generateSlug(body.title, id);
    }

    const updateData = {
      title: body.title || existingCourse.title,
      description: body.description || existingCourse.description,
      instructor: body.instructor || existingCourse.instructor,
      price: price,
      category: body.category || existingCourse.category,
      image: body.image || existingCourse.image,
      courseSlug,
    };

    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Course with similar title already exists" },
        { status: 409 }
      );
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json({ success: false, error: errors.join(", ") }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, error: "Failed to update course" },
      { status: 500 }
    );
  }
}

// DELETE - Delete course by ID
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid course ID" },
        { status: 400 }
      );
    }

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Course deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

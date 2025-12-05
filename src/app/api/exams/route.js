import dbConnect from "@/lib/mongoose";
import Exam from "@/models/Exam";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const exams = await Exam.find({});
    return NextResponse.json({ exams });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

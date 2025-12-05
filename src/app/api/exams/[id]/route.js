import dbConnect from "@/lib/mongoose";
import Exam from "@/models/Exam";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = req.url.split("/").pop(); // get id from URL

    const exam = await Exam.findById(id);
    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json({ exam });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

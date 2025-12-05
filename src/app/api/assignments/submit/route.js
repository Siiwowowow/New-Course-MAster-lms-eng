import dbConnect from "@/lib/mongoose";
import Submission from "@/models/Submission";
import { NextResponse } from "next/server";

// POST: Create new submission
export async function POST(req) {
  try {
    await dbConnect();

    const { module, googleDriveLink, textAnswer, userName, userEmail, userUid } =
      await req.json();

    // Validation
    if (!module) {
      return NextResponse.json({ error: "Module is required" }, { status: 400 });
    }

    if (!googleDriveLink && !textAnswer) {
      return NextResponse.json(
        { error: "Please provide either a Google Drive link or a text answer" },
        { status: 400 }
      );
    }

    if (!userName || !userEmail || !userUid) {
      return NextResponse.json({ error: "User information missing" }, { status: 400 });
    }

    // Save submission
    const submission = new Submission({
      module,
      googleDriveLink,
      textAnswer,
      userName,
      userEmail,
      userUid,
    });

    await submission.save();

    return NextResponse.json({ message: "Assignment submitted successfully" }, { status: 201 });
  } catch (error) {
    console.error("Submission Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET: Fetch all submissions
export async function GET() {
  try {
    await dbConnect();

    const submissions = await Submission.find().sort({ createdAt: -1 }); // newest first

    return NextResponse.json({ submissions }, { status: 200 });
  } catch (error) {
    console.error("Fetch Submissions Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

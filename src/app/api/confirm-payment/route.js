import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Payment from "@/models/Payment"; // যদি Payment model থাকে

export async function POST(req) {
  try {
    await dbConnect();
    const { paymentIntentId } = await req.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { success: false, message: "paymentIntentId missing" },
        { status: 400 }
      );
    }

    // ✅ Payment তথ্য বের করো
    const payment = await Payment.findOne({ paymentIntentId });

    if (!payment) {
      return NextResponse.json(
        { success: false, message: "Payment not found" },
        { status: 404 }
      );
    }

    const { email, courseId } = payment;

    // ✅ User বের করো
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ enrolledCourses না থাকলে তৈরি করো
    if (!user.enrolledCourses) {
      user.enrolledCourses = [];
    }

    // ✅ Course আগে থেকেই enrolled কিনা চেক
    const alreadyEnrolled = user.enrolledCourses.some(
      (id) => id.toString() === courseId
    );

    if (!alreadyEnrolled) {
      user.enrolledCourses.push(courseId);
    }

    // ✅ শুধু "user" হলে "student" হবে
    if (user.role === "user") {
      user.role = "student";
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Payment confirmed, course enrolled & role updated",
      role: user.role,
      enrolledCourses: user.enrolledCourses,
    });
  } catch (error) {
    console.error("Confirm payment error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

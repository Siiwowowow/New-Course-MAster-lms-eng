// app/api/payments/user/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Payment from "@/models/Payment";
import Course from "@/models/Course";

export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Find all successful payments for this user
    const payments = await Payment.find({
      userEmail: email.toLowerCase(),
      status: 'succeeded'
    }).select('courseId amount paidAt');

    // Get unique course IDs
    const courseIds = [...new Set(payments.map(p => p.courseId))];

    // Fetch course details
    const courses = await Course.find({
      _id: { $in: courseIds }
    }).select('title description thumbnail instructor rating enrolled duration price');

    return NextResponse.json({
      success: true,
      data: courses,
      paymentCount: payments.length,
      totalSpent: payments.reduce((sum, payment) => sum + payment.amount, 0)
    });

  } catch (error) {
    console.error("Get user payments error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
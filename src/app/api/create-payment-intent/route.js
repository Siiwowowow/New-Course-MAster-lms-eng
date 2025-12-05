import { NextResponse } from 'next/server';
import Stripe from "stripe";
import dbConnect from "@/lib/mongoose";
import Payment from "@/models/Payment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { price, userEmail, courseId } = await req.json();

    console.log("Creating payment intent:", { price, userEmail, courseId });

    // Validate required fields
    if (!price || !userEmail || !courseId) {
      return NextResponse.json(
        { error: "price, userEmail, and courseId are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Validate courseId is a valid ObjectId
    const mongoose = await import('mongoose');
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json(
        { error: "Invalid courseId format" },
        { status: 400 }
      );
    }

    // Convert price to cents and validate
    const amountInCents = Math.round(parseFloat(price) * 100);
    
    if (isNaN(amountInCents) || amountInCents <= 0) {
      return NextResponse.json(
        { error: "Invalid price amount" },
        { status: 400 }
      );
    }

    if (amountInCents < 50) { // Minimum $0.50 for Stripe
      return NextResponse.json(
        { error: "Amount is too small" },
        { status: 400 }
      );
    }

    // Check if payment already exists for this course
    const existingPayment = await Payment.findOne({
      userEmail,
      courseId,
      status: "succeeded"
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: "Payment already completed for this course" },
        { status: 400 }
      );
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: {
        userEmail,
        courseId,
        courseIdString: courseId.toString()
      }
    });

    console.log("PaymentIntent created:", paymentIntent.id);

    // Save payment in MongoDB with all required fields
    const newPayment = await Payment.create({
      userEmail,
      courseId: new mongoose.Types.ObjectId(courseId),
      amount: parseFloat(price),
      currency: "usd",
      paymentIntentId: paymentIntent.id,
      status: "pending",
      createdAt: new Date()
    });

    console.log("Payment saved to DB:", newPayment._id);

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (err) {
    console.error("Error creating payment intent:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
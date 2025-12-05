import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongoose';
import Payment from '@/models/Payment';
import User from '@/models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { paymentIntentId } = await req.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'paymentIntentId is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Update payment status in database
    const payment = await Payment.findOneAndUpdate(
      { paymentIntentId },
      {
        status: paymentIntent.status,
        receiptUrl: paymentIntent.charges?.data?.[0]?.receipt_url,
        ...(paymentIntent.status === 'succeeded' && {
          paidAt: new Date()
        })
      },
      { new: true }
    ).populate('courseId', 'title');

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      );
    }

    // If payment succeeded
    if (paymentIntent.status === 'succeeded') {
      // 1. Add course to user's enrolled courses
      await User.findByIdAndUpdate(
        payment.userId,
        { $addToSet: { enrolledCourses: payment.courseId } }
      );

      // 2. Check user's current role and update to "student" only if role is "user"
      const user = await User.findById(payment.userId);
      
      if (user && user.role === 'user') {
        // Update role from "user" to "student"
        await User.findByIdAndUpdate(
          payment.userId,
          { role: 'student' },
          { new: true, runValidators: true }
        );
        console.log(`✅ User ${user.email} role updated from "user" to "student"`);
      } else if (user && (user.role === 'teacher' || user.role === 'admin' || user.role === 'instructor')) {
        // Don't change role for teacher/admin/instructor
        console.log(`ℹ️ User ${user.email} has role "${user.role}", keeping same role`);
      } else if (user && user.role === 'student') {
        console.log(`✅ User ${user.email} is already a student`);
      }
    }

    return NextResponse.json({
      success: true,
      status: paymentIntent.status,
      payment: {
        id: payment._id,
        amount: payment.amount,
        status: payment.status,
        courseTitle: payment.courseId?.title,
        receiptUrl: payment.receiptUrl,
        createdAt: payment.createdAt
      }
    });

  } catch (error) {
    console.error('Confirm payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
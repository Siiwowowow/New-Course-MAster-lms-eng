import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongoose';
import Payment from '@/models/Payment';
import Course from '@/models/Course';
import User from '@/models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { price, userEmail, courseId, userId } = await req.json();

    console.log('Creating payment intent for:', { price, userEmail, courseId, userId });

    // Validate required fields
    if (!price || !userEmail || !courseId) {
      return NextResponse.json(
        { error: 'Price, userEmail, and courseId are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Validate user exists
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Validate course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if user already purchased this course
    const existingPayment = await Payment.findOne({
      userId: user._id,
      courseId,
      status: 'succeeded'
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: 'You already purchased this course' },
        { status: 400 }
      );
    }

    // Convert price to cents
    const amountInCents = Math.round(price * 100);
    if (amountInCents < 50) {
      return NextResponse.json(
        { error: 'Minimum payment amount is $0.50' },
        { status: 400 }
      );
    }

    // Find or create Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        name: user.name,
        metadata: {
          userId: user._id.toString(),
          userEmail
        }
      });
      stripeCustomerId = customer.id;
      
      // Save Stripe customer ID to user
      await User.findByIdAndUpdate(user._id, { stripeCustomerId });
    }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      customer: stripeCustomerId,
      metadata: {
        userId: user._id.toString(),
        userEmail,
        courseId: courseId.toString(),
        courseTitle: course.title
      },
      description: `Purchase: ${course.title}`,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Create payment record
    await Payment.create({
      userId: user._id,
      userEmail,
      courseId,
      amount: price,
      paymentIntentId: paymentIntent.id,
      stripeCustomerId,
      status: 'pending',
      metadata: {
        courseTitle: course.title,
        userName: user.name
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: price,
      currency: 'usd'
    });

  } catch (error) {
    console.error('Create payment intent error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
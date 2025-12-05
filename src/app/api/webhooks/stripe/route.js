import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/mongoose";
import Payment from "@/models/Payment";
import User from "@/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// This endpoint should be configured in Stripe Dashboard as webhook endpoint
export async function POST(req) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    await dbConnect();

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        
        // Update payment status to paid
        const payment = await Payment.findOneAndUpdate(
          { stripeSessionId: session.id },
          { 
            status: "paid",
            paidAt: new Date(),
            stripePaymentIntentId: session.payment_intent
          },
          { new: true }
        );

        if (payment) {
          // Add course to user's enrolled courses
          await User.findByIdAndUpdate(
            payment.studentId,
            { 
              $addToSet: { enrolledCourses: payment.courseId },
              $push: { 
                paymentHistory: {
                  paymentId: payment._id,
                  amount: payment.amount,
                  date: new Date(),
                  courseId: payment.courseId
                }
              }
            }
          );
        }
        break;

      case "checkout.session.expired":
        const expiredSession = event.data.object;
        await Payment.findOneAndUpdate(
          { stripeSessionId: expiredSession.id },
          { status: "expired" }
        );
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        await Payment.findOneAndUpdate(
          { stripePaymentIntentId: failedPayment.id },
          { status: "failed" }
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
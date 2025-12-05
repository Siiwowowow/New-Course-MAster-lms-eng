"use client";

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import PaymentForm from './PaymentForm';

// You must pass your Stripe publishable key here
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Payment() {
  return (
    <div className="p-4">
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </div>
  );
}

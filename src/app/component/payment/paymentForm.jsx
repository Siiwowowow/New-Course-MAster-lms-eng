'use client';

import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const cardStyle = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  }
};

export default function PaymentForm({ price, courseId, onSuccess, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Log Stripe status
  console.log('Stripe object:', !!stripe);
  console.log('Elements object:', !!elements);

  // PaymentForm.js-তে handleSubmit ফাংশনে
const handleSubmit = async (event) => {
  event.preventDefault();
  
  if (!stripe || !elements) {
    return;
  }

  setLoading(true);
  setError('');

  try {
    // Get current Firebase user
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user || !user.email) {
      throw new Error('Please log in to make a payment');
    }

    // Step 1: Create payment intent
    const { data } = await axios.post('/api/payments/create-intent', {
      price,
      userEmail: user.email,
      courseId,
      userId: user.uid
    });

    const { clientSecret, paymentIntentId } = data;

    // Step 2: Confirm card payment
    const cardElement = elements.getElement(CardElement);
    
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          email: user.email,
          name: user.displayName || '',
        },
      },
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    // Step 3: Confirm payment in our database
    if (paymentIntent.status === 'succeeded') {
      const confirmResponse = await axios.post('/api/payments/confirm', {
        paymentIntentId: paymentIntent.id
      });
      
      console.log('Payment confirmed:', confirmResponse.data);
      
      // Step 4: Update user role to student if needed
      try {
        await axios.post('/api/users/update-role-after-payment', {
          email: user.email
        });
        console.log('User role updated to student');
      } catch (roleError) {
        console.log('Role update not needed or failed:', roleError.message);
      }
      
      setSuccess(true);
      
      // Call onSuccess callback after 2 seconds
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } else {
      setError(`Payment status: ${paymentIntent.status}`);
    }

  } catch (err) {
    console.error('Payment error:', err);
    setError(err.response?.data?.error || err.message || 'Payment failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

  if (success) {
    return (
      <div className="text-center p-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-4">You have successfully enrolled in the course.</p>
        <p className="text-sm text-gray-500 mb-6">You will be redirected shortly...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Element Container */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="p-3 border border-gray-300 rounded-lg bg-white">
            <CardElement 
              options={cardStyle}
              className="p-2"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Test card: 4242 4242 4242 4242 | Any future date | Any 3 digits
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-red-600">{error}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || loading}
            className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </span>
            ) : (
              `Pay $${price}`
            )}
          </button>
        </div>

        {/* Security Info */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Secure SSL encryption
          </div>
        </div>
      </form>
    </div>
  );
}
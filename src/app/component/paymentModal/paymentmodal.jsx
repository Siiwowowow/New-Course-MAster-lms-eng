'use client';

import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../payment/paymentForm';

// Initialize Stripe outside component
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_'
);

export default function PaymentModal({ price, courseId, onClose, onSuccess }) {
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [stripeError, setStripeError] = useState('');

  useEffect(() => {
    console.log('Stripe Publishable Key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setStripeError('Stripe publishable key is missing. Please check your environment variables.');
      return;
    }

    stripePromise.then(stripe => {
      console.log('Stripe loaded successfully:', !!stripe);
      setStripeLoaded(true);
    }).catch(error => {
      console.error('Failed to load Stripe:', error);
      setStripeError('Failed to load payment system. Please refresh the page.');
    });
  }, []);

  if (!stripeLoaded && !stripeError) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading payment system...</p>
          </div>
        </div>
      </div>
    );
  }

  if (stripeError) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment System Error</h3>
            <p className="text-gray-600 mb-4">{stripeError}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Content */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Complete Payment</h2>
            <p className="text-gray-600 mb-6">Course Price: <span className="font-bold text-blue-600">${price}</span></p>
            
            {/* Stripe Elements */}
            <Elements stripe={stripePromise}>
              <PaymentForm
                price={price}
                courseId={courseId}
                onSuccess={() => {
                  onSuccess?.();
                  onClose();
                }}
                onClose={onClose}
              />
            </Elements>
            
            {/* Security Notice */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Secure payment powered by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import React from "react";

export default function PaymentModal({ price, onClose }) {
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full relative space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold text-lg"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold">Select Payment Method</h2>
        <p className="text-gray-600">Course Price: ${price}</p>

        {/* Payment Options */}
        <div className="flex flex-col space-y-3 mt-4">
          <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
            Pay with Stripe
          </button>
          <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
            Pay with ESl commerze
          </button>
        </div>
      </div>
    </div>
  );
}

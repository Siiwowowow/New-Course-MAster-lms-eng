import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  userEmail: { 
    type: String, 
    required: true 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course", 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  currency: { 
    type: String, 
    default: "usd" 
  },
  paymentIntentId: { 
    type: String, 
    required: true
  },
  status: { 
    type: String, 
    enum: ["pending", "succeeded", "failed", "canceled"], 
    default: "pending" 
  },
  stripeCustomerId: { 
    type: String 
  },
  receiptUrl: { 
    type: String 
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Indexes
PaymentSchema.index({ userEmail: 1, courseId: 1 });
PaymentSchema.index({ paymentIntentId: 1 }, { unique: true });

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

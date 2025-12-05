import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    module: { type: String, required: true },
    googleDriveLink: { type: String },
    textAnswer: { type: String },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userUid: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "submissions" } // collection name in MongoDB
);

export default mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user","student","instructor","admin"], default: "user" },
    avatar: { type: String, default: "" },
    socialLogin: { type: Boolean, default: false },
    lastLogin: { type: Date, default: null }, // 👈 Add this field
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
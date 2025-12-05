import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true }, // ✅ YouTube link
  duration: { type: String },
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: String,
    level: { type: String, default: "Beginner" },
    price: { type: Number, default: 0 },
    instructor: { type: String, required: true },
    thumbnail: String,
    classes: [classSchema], // ✅ MULTI CLASS SYSTEM
  },
  { timestamps: true }
);

export default mongoose.models.Course ||
  mongoose.model("Course", courseSchema);

"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function CreateCourses() {
  const [course, setCourse] = useState({
    title: "",
    description: "",
    price: "",
    instructor: "",
    thumbnail: "",
  });

  const [classes, setClasses] = useState([
    { title: "", videoUrl: "", duration: "" },
  ]);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleClassChange = (index, field, value) => {
    const updated = [...classes];
    updated[index][field] = value;
    setClasses(updated);
  };

  const addClass = () => {
    setClasses([...classes, { title: "", videoUrl: "", duration: "" }]);
  };

  const removeClass = (index) => {
    const updated = classes.filter((_, i) => i !== index);
    setClasses(updated);
  };

  const resetForm = () => {
    setCourse({
      title: "",
      description: "",
      price: "",
      instructor: "",
      thumbnail: "",
    });
    setClasses([{ title: "", videoUrl: "", duration: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...course,
      price: Number(course.price),
      classes,
    };

    try {
      setLoading(true);

      await axios.post("/api/courses", payload);

      toast.success("✅ Course created successfully!");
      resetForm(); // ✅ form empty after success
    } catch (err) {
      console.error(err);
      toast.error("❌ Course creation failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Create New LMS Course
        </h2>

        {/* COURSE INFO */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="title"
            value={course.title}
            onChange={handleChange}
            placeholder="Course Title"
            required
            className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            name="instructor"
            value={course.instructor}
            onChange={handleChange}
            placeholder="Instructor Name"
            required
            className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            name="price"
            type="number"
            value={course.price}
            onChange={handleChange}
            placeholder="Course Price"
            required
            className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            name="thumbnail"
            value={course.thumbnail}
            onChange={handleChange}
            placeholder="Thumbnail Image URL"
            className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <textarea
          name="description"
          value={course.description}
          onChange={handleChange}
          rows="4"
          placeholder="Course Description"
          required
          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {/* MULTI CLASS SECTION */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-700">
            Course Classes
          </h3>

          {classes.map((cls, i) => (
            <div
              key={i}
              className="bg-gray-50 border rounded-xl p-4 space-y-3 shadow-sm relative"
            >
              <span className="absolute -top-3 left-4 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                Class {i + 1}
              </span>

              <input
                value={cls.title}
                placeholder="Class Title"
                onChange={(e) =>
                  handleClassChange(i, "title", e.target.value)
                }
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />

              <input
                value={cls.videoUrl}
                placeholder="YouTube Video Link"
                onChange={(e) =>
                  handleClassChange(i, "videoUrl", e.target.value)
                }
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />

              <input
                value={cls.duration}
                placeholder="Class Duration (e.g. 15 min)"
                onChange={(e) =>
                  handleClassChange(i, "duration", e.target.value)
                }
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              {classes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeClass(i)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove Class
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ADD CLASS BUTTON */}
        <button
          type="button"
          onClick={addClass}
          className="w-full py-3 rounded-lg border-2 border-dashed border-indigo-500 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
        >
          + Add New Class
        </button>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg hover:scale-105 transition-transform disabled:opacity-60"
        >
          {loading ? "Creating Course..." : "Create Course"}
        </button>
      </form>
    </div>
  );
}

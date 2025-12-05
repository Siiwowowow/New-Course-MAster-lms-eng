"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import PaymentModal from "@/app/component/paymentModal/paymentmodal";
import { Star, Users } from "lucide-react";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Validate thumbnail URL
  const isValidImageUrl = (url) => {
    if (!url || typeof url !== "string") return false;
    return url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://");
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/api/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading course...</p>
      </div>
    );

  if (!course)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Course not found</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 space-y-8">
      {/* Course Header */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row">
        {/* Thumbnail */}
        <div className="relative md:w-1/3 h-64 md:h-auto">
          <Image
            src={isValidImageUrl(course.thumbnail) ? course.thumbnail : "/placeholder.png"}
            alt={course.title || "Course"}
            fill
            className="object-cover"
          />
        </div>

        {/* Course Info */}
        <div className="md:w-2/3 p-6 flex flex-col justify-between space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{course.title || "Untitled Course"}</h1>
            <p className="text-gray-600 mt-2">
              {course.description || "No description available."}
            </p>
          </div>

          {/* Instructor, Level, Price */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-2 sm:space-y-0">
            <div className="space-y-1">
              <p className="text-gray-800 font-semibold">
                Instructor: {course.instructor || "Unknown"}
              </p>
              <p className="text-gray-800 font-semibold">
                Level: {course.level || "Beginner"}
              </p>
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{course.rating || "4.5"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={16} className="text-gray-400" />
                <span className="text-sm text-gray-500">{course.enrolled || 0} enrolled</span>
              </div>
            </div>

            <div className="text-2xl font-bold text-indigo-600">
              {course.price === 0
                ? "Free"
                : `$${Number(course.price).toFixed(2)}`}
            </div>
          </div>

          {/* Enroll Button */}
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 w-full md:w-auto px-6 py-3 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Enroll Now
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <PaymentModal
          price={course.price}
          courseId={course._id}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

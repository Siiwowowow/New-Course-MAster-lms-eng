"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditCourse() {
  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState({
    title: "",
    description: "",
    price: "",
    instructor: "",
    level: "",
    thumbnail: "",
  });
  const [classes, setClasses] = useState([{ title: "", videoUrl: "", duration: "" }]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/api/courses/${id}`);
        const data = res.data;
        setCourse({
          title: data.title,
          description: data.description,
          price: data.price,
          instructor: data.instructor,
          level: data.level,
          thumbnail: data.thumbnail,
        });
        setClasses(data.classes.length > 0 ? data.classes : [{ title: "", videoUrl: "", duration: "" }]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

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
    const updated = [...classes];
    updated.splice(index, 1);
    setClasses(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const payload = { ...course, price: Number(course.price), classes };
      await axios.put(`/api/courses/${id}`, payload);
      toast.success("Course updated successfully!");
      router.push("/dashboard/admin/all-courses");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update course");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500 animate-pulse">Loading course...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg space-y-6">
      <h1 className="text-2xl font-bold">Edit Course</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Course Fields */}
        <input
          name="title"
          value={course.title}
          onChange={handleChange}
          placeholder="Course Title"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          name="description"
          value={course.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-3 py-2 rounded"
          rows={4}
          required
        />
        <input
          name="price"
          value={course.price}
          onChange={handleChange}
          placeholder="Price"
          type="number"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="instructor"
          value={course.instructor}
          onChange={handleChange}
          placeholder="Instructor Name"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="level"
          value={course.level}
          onChange={handleChange}
          placeholder="Level (Beginner, Intermediate, Advanced)"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="thumbnail"
          value={course.thumbnail}
          onChange={handleChange}
          placeholder="Thumbnail URL"
          className="w-full border px-3 py-2 rounded"
        />

        {/* Classes */}
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Classes</h2>
          {classes.map((cls, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={cls.title}
                onChange={(e) => handleClassChange(i, "title", e.target.value)}
                placeholder="Class Title"
                className="flex-1 border px-2 py-1 rounded"
              />
              <input
                value={cls.videoUrl}
                onChange={(e) => handleClassChange(i, "videoUrl", e.target.value)}
                placeholder="YouTube Link"
                className="flex-1 border px-2 py-1 rounded"
              />
              <input
                value={cls.duration}
                onChange={(e) => handleClassChange(i, "duration", e.target.value)}
                placeholder="Duration"
                className="w-24 border px-2 py-1 rounded"
              />
              <button type="button" onClick={() => removeClass(i)} className="bg-red-500 text-white px-2 rounded">
                X
              </button>
            </div>
          ))}
          <button type="button" onClick={addClass} className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            + Add Class
          </button>
        </div>

        <button
          type="submit"
          disabled={updating}
          className={`mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition ${
            updating ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {updating ? "Updating..." : "Update Course"}
        </button>
      </form>
    </div>
  );
}

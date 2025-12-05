'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function MyCourse() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user?.email) {
        setLoading(false);
        return; // Do not alert here, just show empty state
      }

      try {
        const res = await axios.get(`/api/my-courses?email=${user.email}`);
        setCourses(res.data.courses || []);
      } catch (error) {
        console.error("My course fetch error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe(); // cleanup listener on unmount
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading your courses...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">🎓 My Purchased Courses</h2>

      {courses.length === 0 ? (
        <p className="text-gray-500">
          You have not purchased any course yet. Please login first if you have an account.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="border rounded-lg shadow-md p-4">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="font-bold mt-3">{course.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{course.instructor}</p>
              <p className="text-blue-600 font-bold mt-2">${course.price}</p>
              <a
                href={`/courses/${course._id}`}
                className="block text-center mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Continue Course
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

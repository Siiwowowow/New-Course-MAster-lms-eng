'use client';
import Image from 'next/image';
import React from 'react';
import CountUp from 'react-countup';

export default function Promotion() {
  const stats = [
    { id: 1, label: "Enrollments", value: 12500 },
    { id: 2, label: "Courses", value: 120 },
    { id: 3, label: "Teachers", value: 35 },
    { id: 4, label: "Students", value: 8500 },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-center text-sm border border-gray-200 rounded-2xl m-4 max-w-6xl w-full bg-white shadow-xl p-6 md:p-10 mx-auto font-roboto">
      
      {/* Left Content */}
      <div className="flex flex-col text-center md:text-left items-center md:items-start md:w-1/2">
        <h3 className="text-indigo-600 font-medium mb-2 text-lg">Learn From Experts</h3>
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-snug">
          Master Your Skills with <span className="text-[#35556e]
">Course Master</span>
        </h2>

        <p className="text-gray-600 mt-4 max-w-md">
          Join thousands of students and professionals who are advancing their careers with our hands-on, practical courses. Learn Web Development, Digital Marketing, Data Science, and more from industry experts.
        </p>

        {/* Animated Counters */}
        <div className="flex flex-wrap gap-6 mt-6 justify-center md:justify-start">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center md:items-start">
              <p className="text-xl md:text-xl font-bold text-gray-900">
                <CountUp end={stat.value} duration={2} separator="," />+
              </p>
              <p className="text-gray-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mt-6">
          <button
            type="button"
            aria-label="getStarted"
            className="bg-[#35556e] hover:bg-blue-700 px-7 py-3 text-white rounded-lg font-medium shadow-md transition-all active:scale-95"
          >
            Enroll Now
          </button>

          <button
            type="button"
            className="group flex items-center gap-2 px-7 py-3 text-[#35556e] font-medium rounded-lg hover:bg-gray-100 transition-all active:scale-95"
          >
            Learn More
            <svg
              className="mt-1 group-hover:translate-x-1 transition-transform"
              width="15"
              height="11"
              viewBox="0 0 15 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 5.5h13.092M8.949 1l5.143 4.5L8.949 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Right Image */}
      <div className=" flex justify-center">
        <Image
          width={400}
          height={400}
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/appDownload/excitedWomenImage.png"
          alt="students learning online"
          className="rounded-xl object-contain "
        />
      </div>
    </div>
  );
}

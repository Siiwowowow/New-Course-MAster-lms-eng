"use client";

import Image from "next/image";
import React from "react";

export default function Hero() {
  return (
    <section className="mt-20 px-4 md:px-16 lg:px-24 xl:px-32 pb-20 flex flex-col md:flex-row items-center justify-between max-md:gap-20">
      
      {/* Left content */}
      <div className="flex flex-col items-center md:items-start">
        <h1 className="text-center md:text-left text-4xl md:text-5xl leading-[46px] md:leading-[68px] font-semibold max-w-xl text-slate-900">
          Learn, Teach, and Grow <br />
          with <span className="text-indigo-600">CourseMaster</span>
        </h1>
        <p className="text-center md:text-left text-sm text-slate-700 max-w-lg mt-4">
          Build your skills or teach others with our full-featured, production-ready 
          E-learning platform. Designed for students, instructors, and administrators, 
          CourseMaster ensures seamless learning experiences for thousands of users.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-4 mt-8 text-sm">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 transition rounded-md px-7 h-11">
            Get Started
          </button>

          <button className="flex items-center gap-2 border border-slate-600 active:scale-95 hover:bg-white/10 transition text-slate-600 rounded-md px-6 h-11">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-video-icon"
            >
              <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
              <rect x="2" y="6" width="14" height="12" rx="2" />
            </svg>
            <span>Watch Demo</span>
          </button>
        </div>
      </div>

      {/* Right image */}
      <Image
        width={500}
        height={500}
        src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/hero-section-showcase-5.png"
        alt="CourseMaster LMS"
        className="max-w-sm sm:max-w-md lg:max-w-lg 2xl:max-w-xl transition-all duration-300"
      />
    </section>
  );
}

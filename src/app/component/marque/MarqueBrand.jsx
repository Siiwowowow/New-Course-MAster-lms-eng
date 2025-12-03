"use client";

import Image from "next/image";
import React from "react";

export default function MarqueBrand() {
  const companyLogos = [
    "slack",
    "framer",
    "netflix",
    "google",
    "linkedin",
    "instagram",
    "facebook",
  ];

  const animationStyle = {
    animationDuration: "15s",
  };

  return (
    <>
      {/* Animation CSS */}
      <style>{`
        .marquee-inner {
          animation: marqueeScroll linear infinite;
        }

        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      {/* Section Wrapper */}
      <section className="w-full my-16 text-center">

        {/* ===== Heading Area ===== */}
        <div className="mb-8 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Trusted by Leading Brands & Platforms
          </h2>
          <p className="mt-2 text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
  Thousands of students and developers use our platform to gain real-world
  experience and work with leading international brands and companies.
</p>

        </div>

        {/* ===== Marquee Area ===== */}
        <div className="relative w-full overflow-hidden select-none">

          {/* Left Gradient */}
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none 
                          bg-gradient-to-r from-white to-transparent" />

          {/* Marquee Content */}
          <div
            className="marquee-inner flex min-w-[200%] will-change-transform"
            style={animationStyle}
          >
            <div className="flex items-center">
              {[...companyLogos, ...companyLogos].map((company, index) => (
                <div key={index} className="mx-8 flex items-center">
                  <Image
                    src={`https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/${company}.svg`}
                    alt={company}
                    width={100}
                    height={60}
                    className="object-contain  hover:opacity-100 transition"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Gradient */}
          <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none 
                          bg-gradient-to-l from-white to-transparent" />
        </div>
      </section>
    </>
  );
}

import React from "react";
import Link from "next/link";

export default function CourseCard() {
  const courses = [
    {
      title: "Full Stack Web Development",
      desc: "Learn MERN stack with real-world projects and job-ready skills.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400",
      price: "$149",
      duration: "6 Months",
      level: "Beginner to Advanced",
      rating: "4.9",
      students: "2,300+",
    },
    {
      title: "UI/UX Design Mastery",
      desc: "Master Figma, wireframing, and modern UI/UX principles.",
      image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=400",
      price: "$99",
      duration: "4 Months",
      level: "Beginner",
      rating: "4.8",
      students: "1,500+",
    },
    {
      title: "Digital Marketing",
      desc: "SEO, Facebook Ads, Google Ads and real campaign strategy.",
      image: "https://images.unsplash.com/photo-1579389083046-e3df9c2b3325?q=80&w=400",
      price: "$89",
      duration: "3 Months",
      level: "Beginner",
      rating: "4.7",
      students: "1,200+",
    },
    {
      title: "Data Analysis with Python",
      desc: "Analyze real data using Python, Pandas, and visualization tools.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400",
      price: "$129",
      duration: "5 Months",
      level: "Intermediate",
      rating: "4.9",
      students: "980+",
    },
    {
      title: "Freelancing for Beginners",
      desc: "Learn how to earn online from platforms like Fiverr & Upwork.",
      image: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?q=80&w=400",
      price: "$59",
      duration: "2 Months",
      level: "Beginner",
      rating: "4.6",
      students: "3,000+",
    },
    {
      title: "Graphic Design Essentials",
      desc: "Learn Photoshop, Illustrator and branding design.",
      image: "https://images.unsplash.com/photo-1587614382346-acb7b1cfa6bc?q=80&w=400",
      price: "$79",
      duration: "3 Months",
      level: "Beginner",
      rating: "4.8",
      students: "1,700+",
    },
  ];

  return (
    <section className="w-full py-16 px-4 bg-gray-50">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Our Popular Courses
        </h2>
        <p className="mt-2 text-gray-600 max-w-xl mx-auto text-sm md:text-base">
          Choose from our most popular professional courses and start your
          career journey today.
        </p>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {courses.map((course, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg shadow text-sm max-w-80 mx-auto 
                       hover:shadow-lg transition flex flex-col"
          >
            <img
              className="rounded-md h-40 w-full object-cover"
              src={course.image}
              alt={course.title}
            />

            <p className="text-gray-900 text-xl font-semibold mt-3">
              {course.title}
            </p>

            <p className="text-gray-500 mt-2">
              {course.desc}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-gray-600">
              <p>⏳ {course.duration}</p>
              <p>📊 {course.level}</p>
              <p>⭐ {course.rating}</p>
              <p>👨‍🎓 {course.students}</p>
            </div>

            <p className="mt-3 text-lg font-bold text-[#35556e]">
              {course.price}
            </p>

            {/* Button always bottom aligned */}
            <button
              type="button"
              className="mt-auto bg-[#35556e] text-white px-6 py-2 
                         font-medium rounded hover:opacity-90 transition"
            >
              Learn More
            </button>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <Link href="/courses">
          <button className="bg-[#35556e] text-white px-8 py-3 rounded-md 
                             font-medium hover:opacity-90 transition">
            View All Courses →
          </button>
        </Link>
      </div>
    </section>
  );
}

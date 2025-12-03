import Image from 'next/image';
import React from 'react';

export default function Teacher() {
  const teachers = [
    {
      name: "Donald Jackman",
      role: "Web Development Instructor",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200",
      review: "Expert in full stack web development with 10+ years of industry experience.",
    },
    {
      name: "Richard Nelson",
      role: "UI/UX Design Instructor",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60",
      review: "Passionate about creating intuitive user interfaces and digital experiences.",
    },
    {
      name: "James Washington",
      role: "Digital Marketing Instructor",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200",
      review: "Specialist in SEO, Google Ads, and social media marketing strategies.",
    },
    {
      name: "Sophia Turner",
      role: "Data Science Instructor",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200",
      review: "Experienced in Python, Pandas, and real-world data analytics projects.",
    },
    {
      name: "Liam Carter",
      role: "Cyber Security Instructor",
      image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200",
      review: "Focuses on practical cybersecurity techniques and ethical hacking skills.",
    },
    {
      name: "Emily Watson",
      role: "Graphic Design Instructor",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
      review: "Expert in Photoshop, Illustrator, and branding design projects.",
    },
    {
      name: "Noah Brown",
      role: "Mobile App Development Instructor",
      image: "https://images.unsplash.com/photo-1654110455429-cf322b40a906?w=500&auto=format&fit=crop&q=60",
      review: "Teaches Flutter, React Native, and building production-ready apps.",
    },
    {
      name: "Ava Williams",
      role: "AI & Machine Learning Instructor",
      image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200",
      review: "Specialist in AI, ML algorithms, and real-life project applications.",
    },
  ];

  return (
    <div className="flex flex-col items-center text-center py-16 px-4">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 max-w-2xl mb-6">
        Meet Our Expert <span className="text-blue-600">Instructors</span>
      </h1>
      <p className="text-gray-600 font-medium text-sm md:text-sm max-w-3xl mb-12">
        Learn from industry leaders with years of real-world experience. Our instructors are here to guide you through hands-on projects, career advice, and cutting-edge skills that will help you stand out in your professional journey.
      </p>

      {/* ===== Responsive Grid ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {teachers.map((teacher, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white px-4 py-8 rounded-xl border border-gray-300 shadow-md hover:shadow-xl transition-all text-center"
          >
            <Image
              width={80}
              height={80}
              src={teacher.image}
              alt={teacher.name}
              className="h-20 w-20 rounded-full object-cover mb-4"
            />
            <p className="text-gray-700 text-sm italic mb-3">“{teacher.review}”</p>
            <p className="text-lg font-semibold text-gray-800">{teacher.name}</p>
            <p className="text-xs text-gray-500">{teacher.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

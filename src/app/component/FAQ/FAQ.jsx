import Image from 'next/image';
import React from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = React.useState(null);

  const faqs = [
    {
      question: "How can I enroll in a course?",
      answer: "To enroll in a course, simply click on the 'Enroll Now' button on the course page, create an account, and complete the payment process. Once done, you will get instant access to the course materials.",
    },
    {
      question: "Are the courses suitable for beginners?",
      answer: "Yes, our courses are designed for learners at all levels. Each course includes beginner-friendly tutorials along with advanced lessons for experienced learners.",
    },
    {
      question: "Can I get a certificate after completion?",
      answer: "Absolutely! After successfully completing a course, you will receive a certificate that you can share on LinkedIn or add to your resume.",
    },
    {
      question: "Do I get lifetime access to the course?",
      answer: "Yes, once you enroll, you will have lifetime access to the course content, including updates and additional resources.",
    },
    {
      question: "How can I contact my instructor?",
      answer: "You can communicate with your instructor via the platform's messaging system or participate in live Q&A sessions organized during the course.",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-center gap-8 px-4 md:px-0 py-4">
        {/* Left Image */}
        <Image
          width={300}
          height={300}
          className="max-w-md w-full rounded-xl h-auto shadow-lg"
          src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=830&h=844&auto=format&fit=crop"
          alt="FAQ Illustration"
        />

        {/* Right FAQ Content */}
        <div className="md:w-1/2">
          <p className="text-indigo-600 text-sm font-semibold">FAQs</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-2 text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-slate-500 mt-4 mb-6">
            Have questions about our courses, instructors, or platform? Find answers here and learn how <strong>Course Master</strong> can help you achieve your learning goals efficiently.
          </p>

          {/* FAQ Items */}
          {faqs.map((faq, index) => (
            <div
              className="border-b border-slate-200 py-4 cursor-pointer"
              key={index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex items-center justify-between">
                <h1 className="text-base font-medium text-gray-800">
                  {faq.question}
                </h1>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${openIndex === index ? "rotate-180" : ""} transition-all duration-500 ease-in-out`}
                >
                  <path
                    d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                    stroke="#1D293D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p
                className={`text-sm text-slate-500 transition-all duration-500 ease-in-out max-w-md ${
                  openIndex === index
                    ? "opacity-100 max-h-[300px] translate-y-0 pt-4"
                    : "opacity-0 max-h-0 -translate-y-2"
                }`}
              >
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TakeExam() {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/exams/${id}`)
      .then(res => setExam(res.data.exam))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleSubmit = () => {
    let total = 0;
    exam.questions.forEach((q, i) => {
      if (answers[i] === q.answer) total++;
    });
    setScore(total);
    setSubmitted(true);
  };

  if (loading) return <p className="text-center mt-10">Loading exam...</p>;
  if (!exam) return <p className="text-center mt-10">Exam not found</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-2">{exam.title}</h1>
        <p className="text-gray-600 mb-4">Exam ID: {exam._id}</p>

        {exam.questions.map((q, i) => (
          <div key={i} className="mb-4">
            <h2 className="font-semibold mb-2">{i + 1}. {q.question}</h2>

            {q.options.map(op => {
              const isCorrect = submitted && op === q.answer;
              const isWrong = submitted && answers[i] === op && op !== q.answer;

              return (
                <label key={op} className={`block p-2 rounded cursor-pointer mb-1
                  ${isCorrect ? "bg-green-200" : ""}
                  ${isWrong ? "bg-red-200" : ""}
                `}>
                  <input
                    type="radio"
                    name={`q-${i}`}
                    onChange={() => handleChange(i, op)}
                    disabled={submitted}
                  /> {op}
                  {isCorrect && " ✅"}
                  {isWrong && " ❌"}
                </label>
              );
            })}

            {submitted && answers[i] !== q.answer && (
              <p className="text-green-700 mt-1">Correct Answer: {q.answer}</p>
            )}
          </div>
        ))}

        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-4"
          >
            Submit Exam
          </button>
        ) : (
          <div className="mt-4 text-center p-4 bg-green-100 rounded">
            <h2 className="text-xl font-bold">Score: {score} / {exam.questions.length}</h2>
            <p className="mt-2 font-semibold">
              {score >= Math.ceil(exam.questions.length * 0.7) ? "✅ Passed" : "❌ Failed"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

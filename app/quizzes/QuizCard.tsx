"use client";

import { useRouter } from "next/navigation";

type Quiz = {
  id: number;
  title: string;
  description: string;
};

export default function QuizCard({ quiz }: { quiz: Quiz }) {
  const router = useRouter();

  return (
    <button
      className="p-6 bg-white rounded-xl border border-blue-200 shadow-md hover:shadow-lg hover:border-blue-400 transition transform hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-300"
      onClick={() => router.push(`/quizzes/${quiz.id}`)}
      role="listitem"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && router.push(`/quizzes/${quiz.id}`)}
      aria-label={`Go to quiz: ${quiz.title}`}
    >
      <h2 className="text-xl font-bold text-gray-900">{quiz.title}</h2>
      <p className="text-gray-700 mt-2">{quiz.description}</p>
    </button>
  );
}
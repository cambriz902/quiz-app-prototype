"use client";

import { useRouter } from "next/navigation";
import { Quiz } from '@/types/quiz';


interface QuizCardProps {
  quiz: Quiz;
  size: 'medium' | 'small';
}
export default function QuizCard({ quiz, size = 'medium' }: QuizCardProps ) {
  const router = useRouter();

  const sizeButtonStyle = size === 'medium' ? "p-6" : 'p-1  overflow-hidden ';
  const sizeTitleStyle = size === 'medium' ? "text-xl" : 'text-md';
  const sizeDescriptionStyle = size === 'medium' ? 'text-md' : 'text-sm truncate';
  return (
    <button
      className={`${sizeButtonStyle} bg-white rounded-xl border border-blue-200 shadow-md hover:shadow-lg hover:border-blue-400 transition transform hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-300`}
      onClick={() => router.push(`/quizzes/${quiz.id}`)}
      role="listitem"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && router.push(`/quizzes/${quiz.id}`)}
      title={`Go to quiz: ${quiz.title}`}
    >
      <h2 className={`${sizeTitleStyle} font-bold text-gray-900`}>{quiz.title}</h2>
      <p className={`${sizeDescriptionStyle} text-gray-700 mt-2`} title={quiz.description}>{quiz.description}</p>
    </button>
  );
}
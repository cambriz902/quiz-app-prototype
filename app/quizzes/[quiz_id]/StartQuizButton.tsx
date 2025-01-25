"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type StartQuizButtonProps = {
  quizId: number;
};

export default function StartQuizButton({ quizId }: StartQuizButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartQuiz = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/quizzes/${quizId}/start`, { method: "POST" });

      if (!response.ok) {
        throw new Error("Failed to start quiz");
      }

      // ✅ Redirect to the first question in the quiz
      router.push(`/quizzes/${quizId}/questions/1`);
    } catch (error) {
      console.error("Error starting quiz:", error);
      alert("Failed to start quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleStartQuiz}
      disabled={isLoading}
      className={`mt-6 px-6 py-3 text-white font-semibold rounded-lg text-lg transition-all ${
        isLoading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl"
      }`}
    >
      {isLoading ? "Starting..." : "Start Quiz"}
    </button>
  );
}
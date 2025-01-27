"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RetakeQuizButtonProps = {
  quizId: number;
};

export default function RetakeQuizButton({ quizId }: RetakeQuizButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRetakeQuiz = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/quizzes/${quizId}/start`, {
        method: "POST",
      });

      if (!response.ok) {
        console.error("Failed to start a new quiz attempt");
        return;
      }

      const data = await response.json();
      if (data.attempt) {
        router.push(`/quizzes/${quizId}`);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error starting a new attempt:", error);
    }
  };

  return (
    <button
      onClick={handleRetakeQuiz}
      disabled={isLoading}
      className={`px-6 py-3 text-white rounded-lg transition-shadow ${
        isLoading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg"
      }`}
    >
      {isLoading ? "Starting..." : "Retake Quiz"}
    </button>
  );
}
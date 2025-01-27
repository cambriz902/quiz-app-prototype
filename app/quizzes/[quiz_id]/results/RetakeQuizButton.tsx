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
      if (data.attemptId) {
        router.push(`/quizzes/${quizId}`);
      }
    } catch (error) {
      console.error("Error starting a new attempt:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleRetakeQuiz}
      disabled={isLoading}
      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
    >
      {isLoading ? "Starting..." : "Retake Quiz"}
    </button>
  );
}
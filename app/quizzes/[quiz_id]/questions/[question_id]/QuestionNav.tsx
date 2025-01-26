"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type QuestionNavProps = {
  quizId: number;
  questionId: number;
  selectedAnswer: number | string | null;
  attemptId: number;
  isLastQuestion: boolean; 
};

export default function QuestionNav({ quizId, questionId, selectedAnswer, attemptId, isLastQuestion }: QuestionNavProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    if (!selectedAnswer) return; // Prevent skipping without answering
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/quizzes/${quizId}/questions/${questionId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedAnswer, attemptId, isLastQuestion }),
      });

      if (!response.ok) {
        console.error("Failed to submit answer");
        return;
      }

      if (isLastQuestion) {
        router.push(`/quizzes/${quizId}/results?attemptId=${attemptId}`);
      } else {
        router.push(`/quizzes/${quizId}/questions/${questionId + 1}`);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={handleNext}
        disabled={!selectedAnswer || isSubmitting}
        className={`w-full max-w-[400px] px-6 py-3 text-white font-semibold rounded-lg text-lg transition-all ${
          !selectedAnswer
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl"
        }`}
      >
        {isLastQuestion ? "Submit" : "Next Question"}
      </button>
    </div>
  );
}
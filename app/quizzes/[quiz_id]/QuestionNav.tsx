"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuizTakingOfflineStorage } from "@/utils/QuizTakingOfflineStorage";

type QuestionNavProps = {
  quizId: number;
  questionId: number;
  selectedAnswer: number | string | null;
  attemptId: number;
  isLastQuestion: boolean;
  isOffline: boolean;
  onNextQuestion: () => void;
};

export default function QuestionNav({
  quizId,
  questionId,
  selectedAnswer,
  attemptId,
  isLastQuestion,
  isOffline,
  onNextQuestion,
}: QuestionNavProps) {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Try to sync pending answers in the background when online
  useEffect(() => {
    if (!isOffline) {
      setIsSyncing(true);
      QuizTakingOfflineStorage.syncAnswers().then(() => setIsSyncing(false));
    }
  }, [isOffline]);

  const handleNext = async () => {
    if (!selectedAnswer || isSubmitting) return;

    if (isOffline) {
      // Save answer locally if offline
      QuizTakingOfflineStorage.saveAnswer({ questionId, selectedAnswer, attemptId });
    } else {
      try {
        setIsSubmitting(true);
        await fetch(`/api/quizzes/${quizId}/questions/${questionId}/answer`, {
          method: "POST",
          body: JSON.stringify({ attemptId, selectedAnswer, isLastQuestion }),
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error submitting answer:", error);
      } 
    }

    if (isLastQuestion) {
      router.push(`/quizzes/${quizId}/results?attemptId=${attemptId}`);
    } else {
      setIsSubmitting(false); 
      onNextQuestion();
    }
  };

  const navButtonDisabled =
    !selectedAnswer ||
    isSubmitting || 
    (isLastQuestion && (!QuizTakingOfflineStorage.allAnswersSynced() || isOffline));

  return (
    <div className="flex flex-col items-center mt-6">
      {/* Show Warning Message if Offline on Last Question */}
      {isOffline && isLastQuestion && (
        <p className="text-red-500 text-sm mb-2">
          You must be online to submit the last question.
        </p>
      )}

      {/* Show syncing status */}
      {isSyncing && <p className="text-sm text-blue-500">Syncing answers...</p>}

      <button
        onClick={handleNext}
        disabled={navButtonDisabled}
        className={`px-6 py-3 text-white rounded-lg transition-shadow ${
          navButtonDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg"
        }`}
      >
        {isSubmitting ? "Submitting..." : isLastQuestion ? "Submit" : "Next Question"}
      </button>
    </div>
  );
}
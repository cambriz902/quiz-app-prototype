"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function RetakeQuizButton({ quizId }: { quizId: number }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleRetake() {
    setError(null);

    try {
      const res = await fetch(`/api/quizzes/${quizId}/start`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to create a new quiz attempt.");
      }

      const data = await res.json();
      if (!data.attemptId || !data.firstQuestionId) {
        throw new Error("Invalid response from server.");
      }

      // ✅ Redirect directly to first question
      router.replace(`/quizzes/${quizId}/questions/${data.firstQuestionId}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  }

  return (
    <div className="mt-8">
      {error && <p className="text-red-600">{error}</p>}
      <button
        onClick={() => startTransition(handleRetake)}
        className="px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg text-lg font-semibold transition-shadow shadow-md hover:shadow-lg"
        disabled={isPending}
      >
        {isPending ? "Starting..." : "Retake Quiz"}
      </button>
    </div>
  );
}
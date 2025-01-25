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

      // ✅ Redirect to the quiz page -> which will automatically start from question 1
      router.push(`/quizzes/${quizId}`);
    } catch (err: any) {
      setError(err.message);
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
"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center h-screen px-4 text-center bg-gray-100">
      <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
        Welcome to the <span className="text-blue-600">Quiz App</span>
      </h1>
      <p className="mt-4 text-gray-700 max-w-xl">
        Test your knowledge with a variety of quizzes. Challenge yourself and learn something new every day!
      </p>
      
      <button
        onClick={() => router.push("/quizzes")}
        className="mt-6 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium transition focus:outline-none focus:ring-4 focus:ring-blue-300"
        role="link"
        aria-label="Navigate to the quizzes page"
      >
        View Quizzes
      </button>
    </main>
  );
}

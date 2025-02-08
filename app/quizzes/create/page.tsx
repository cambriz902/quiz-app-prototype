'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
const Page = () => {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(0);
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const router = useRouter();
  const handleCreateQuiz = async () => {
    setIsCreatingQuiz(true);
    try {
      const response = await fetch("/api/quizzes/create", {
        method: "POST",
        body: JSON.stringify({ topic, numQuestions }),
      });
      const data: { quizId: number } = await response.json();
      router.push(`/quizzes/${data.quizId}`);
    } catch (error) {
      console.error("Error creating quiz:", error);
    } finally {
      setIsCreatingQuiz(false);
    }
  }
  return (
    <main className="container mx-auto px-6 py-12 bg-white">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 sm:text-5xl">
        Create a <span className="text-blue-500">Quiz</span>
      </h1>
      <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mt-4">
        Create a quiz using AI. 
      </p>
      <input
        type="text"
        value={topic}
        placeholder="Enter a topic for your quiz"
        className="w-full max-w-md mx-auto mt-8"
        onChange={(e) => setTopic(e.target.value)}
      />
      <input
        type="number"
        value={numQuestions}
        placeholder="Enter the number of multiple choice questions"
        className="w-full max-w-md mx-auto mt-8"
        onChange={(e) => setNumQuestions(Number(e.target.value))}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={handleCreateQuiz}
        disabled={isCreatingQuiz}
      >
        {isCreatingQuiz ? "Creating Quiz..." : "Create Quiz"}
      </button>
    </main>
  )
}

export default Page;
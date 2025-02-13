'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [topic, setTopic] = useState("");
  const [numMultipleChoiceQuestions, setNumMultipleChoiceQuestions] = useState(0);
  const [numFreeResponseQuestions, setNumFreeResponseQuestions] = useState(0);
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const router = useRouter();

  const handleCreateQuiz = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCreatingQuiz(true);
    try {
      const response = await fetch("/api/quizzes/create", {
        method: "POST",
        body: JSON.stringify({ topic, numMultipleChoiceQuestions, numFreeResponseQuestions }),
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
    <main className="container mx-auto px-6 py-12 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-extrabold text-center mb-2">
          Create <span className="text-blue-500">Quiz</span>
        </h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          Add topic, number of multiple choice questions, and number of free response questions.
        </p>
        
        <form onSubmit={handleCreateQuiz} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
              Topic
            </label>
            <input
              type="text"
              value={topic}
              id="topic"
              placeholder="Enter a topic for your quiz"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="numMultipleChoiceQuestions" className="block text-sm font-medium text-gray-700">
              Number of Multiple Choice Questions
            </label>
            <input
              type="number"
              value={numMultipleChoiceQuestions}
              id="numMultipleChoiceQuestions"
              placeholder="Enter the number of multiple choice questions"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setNumMultipleChoiceQuestions(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="numFreeResponseQuestions" className="block text-sm font-medium text-gray-700">
              Number of Free Response Questions
            </label>
            <input
              type="number"
              value={numFreeResponseQuestions}
              id="numFreeResponseQuestions"
              placeholder="Enter the number of free response questions"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setNumFreeResponseQuestions(Number(e.target.value))}
            />
          </div>

          <button
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isCreatingQuiz}
          >
            {isCreatingQuiz ? "Creating Quiz..." : "Create Quiz"}
          </button>
        </form>
      </div>
    </main>
  )
}

export default Page;
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

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

  const enableSubmitButton = topic && (numMultipleChoiceQuestions > 0 || numFreeResponseQuestions > 0);

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
            <div className="flex items-center gap-2">
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                Topic:
              </label>
              <Popover className="relative">
                <PopoverButton
                  className="flex items-center text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
                  data-testid="topic-help-button"
                >
                  <QuestionMarkCircleIcon className="h-4 w-4" aria-hidden="true" />
                </PopoverButton>

                <PopoverPanel className="absolute z-10 w-72 bottom-8 left-0">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="p-4 bg-white">
                      <p className="text-sm font-medium text-gray-900">Tips for a better quiz:</p>
                      <div className="mt-2 text-sm text-gray-500">
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Be specific about your topic</li>
                          <li>Include the subject area (e.g., &ldquo;History&rdquo;, &ldquo;Science&rdquo;)</li>
                          <li>Add a time period if relevant</li>
                          <li>Example: &ldquo;World War II Pacific Theater 1941-1945&rdquo; instead of just &ldquo;World War II&rdquo;</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </PopoverPanel>
              </Popover>
            </div>
            <input
              type="text"
              value={topic}
              id="topic"
              placeholder="Enter a specific topic for your quiz"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="numMultipleChoiceQuestions" className="block text-sm font-medium text-gray-700">
              Multiple Choice Questions (max 10):
            </label>
            <input
              type="number"
              value={numMultipleChoiceQuestions}
              id="numMultipleChoiceQuestions"
              min="0"
              max="10"
              placeholder="Enter the number of multiple choice questions"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setNumMultipleChoiceQuestions(Math.min(10, Math.max(0, Number(e.target.value))))}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="numFreeResponseQuestions" className="block text-sm font-medium text-gray-700">
              Free Response Questions (max 2):
            </label>
            <input
              type="number"
              value={numFreeResponseQuestions}
              id="numFreeResponseQuestions"
              min="0"
              max="2"
              placeholder="Enter the number of free response questions"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setNumFreeResponseQuestions(Math.min(2, Math.max(0, Number(e.target.value))))}
            />
          </div>

          <button
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isCreatingQuiz || !enableSubmitButton}
          >
            {isCreatingQuiz ? "Creating Quiz..." : "Create Quiz"}
          </button>
        </form>
      </div>
    </main>
  )
}

export default Page;
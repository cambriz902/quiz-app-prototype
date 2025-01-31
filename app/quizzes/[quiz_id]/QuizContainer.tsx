"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuizProgressModel } from "@/types/quizProgress";
import { QuestionModel } from "@/types/question";
import MultipleChoice from "./MultipleChoice";
import FreeResponse from "./FreeResponse";
import QuestionNav from "./QuestionNav";
import StepsTimerHeader from "@/components/StepsTimerHeader";
import useOfflineStatus from "@/utils/useOfflineStatus"; 
import SkeletonLoader from "@/components/SkeletonLoader"; 

type QuizContainerProps = {
  quiz: QuizProgressModel;
};

export default function QuizContainer({ quiz }: QuizContainerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const isOffline = useOfflineStatus();
  const userAttempt = quiz.userAttempt;

  useEffect(() => {
    if (!userAttempt) {
      router.push(`/quizzes/${quiz.id}`);
      return;
    }
  }, [userAttempt, quiz.id, router]);

  useEffect(() => {
    if (!quiz) return;
    const nextQuestionIndex = quiz.questions.findIndex((q) => !q.attempted);
    setCurrentIndex(nextQuestionIndex !== -1 ? nextQuestionIndex : 0);
  }, [quiz]);

  if (!quiz || !userAttempt) {
    return null;
  };
  
  const handleSelectedAnswer = (answer: number | string) => {
    setSelectedAnswer(answer);
  };

  const handleOnNextQuestion = () => {
    currentQuestion.attempted = true;
    const nextQuestionIndex = quiz.questions.findIndex((q) => !q.attempted);
    if (nextQuestionIndex !== -1) {
      setCurrentIndex(nextQuestionIndex);
      setSelectedAnswer(null);
    }
  }
  
  if (currentIndex === null) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        {/* Skeleton Timer and Progress */}
        <div className="flex justify-between mb-4">
          <SkeletonLoader height="h-12" />
        </div>

        {/* Skeleton Question Text */}
        <div className="mb-6">
          <SkeletonLoader height="h-10" />
        </div>

        {/* Skeleton Answer Choices */}
        <div className="space-y-3">
          <SkeletonLoader height="h-10" />
          <SkeletonLoader height="h-10" />
          <SkeletonLoader height="h-10" />
          <SkeletonLoader height="h-10" />
        </div>

        {/* Skeleton Navigation Button (Centered) */}
        <div className="mt-6 flex justify-center">
          <SkeletonLoader height="h-12" width="w-1/4" />
        </div>
      </div>
    );
  }

  const currentQuestion: QuestionModel = quiz.questions[currentIndex];

  return (
    <div className="mt-8 max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      
      {/* Offline warning message */}
      {isOffline && (
        <div className="mb-4 p-3 text-white bg-yellow-500 rounded-lg text-center">
          You are offline! Your answers will be saved and synced when back online.
        </div>
      )}

      {/* Timer and Progress using StepsTimerHeader */}
      <StepsTimerHeader 
        targetTime={userAttempt.quizEndTime} 
        currentStep={currentIndex} 
        totalSteps={quiz.questions.length} 
        onTimerEnd={() => router.push(`/quizzes/${quiz.id}/results?attemptId=${userAttempt.id}`)}
        label="Question" // Since it's a quiz
      />

      {/* Render the appropriate question type */}
      <div className="mb-6">
        {currentQuestion.type === "multiple_choice" ? (
          <MultipleChoice question={currentQuestion} setAnswer={handleSelectedAnswer} selectedAnswer={Number(selectedAnswer)} />
        ) : (
          <FreeResponse question={currentQuestion} setAnswer={handleSelectedAnswer} answer={selectedAnswer as string | null} />
        )}
      </div>

      {/* Navigation with offline support */}
      <QuestionNav
        quizId={quiz.id}
        questionId={currentQuestion.id}
        selectedAnswer={selectedAnswer}
        attemptId={userAttempt.id}
        isLastQuestion={currentIndex === quiz.questions.length - 1}
        isOffline={isOffline}
        onNextQuestion={handleOnNextQuestion}
      />
    </div>
  );
}
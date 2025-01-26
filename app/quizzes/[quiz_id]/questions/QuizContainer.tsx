"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MultipleChoice from "./[question_id]/MultipleChoice";
import FreeResponse from "./[question_id]/FreeResponse";
import QuestionNav from "./[question_id]/QuestionNav";
import { QuizModel } from "@/types/quiz";

type QuizContainerProps = {
  quiz: QuizModel;
  userAttempt: { id: number; quizEndTime: string };
};

export default function QuizContainer({ quiz, userAttempt }: QuizContainerProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});

  const [timeLeft, setTimeLeft] = useState(() => {
    return Math.max(0, Math.floor((new Date(userAttempt.quizEndTime).getTime() - Date.now()) / 1000));
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      router.push(`/quizzes/${quiz.id}/results?attemptId=${userAttempt?.id}`);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, quiz.id, userAttempt, router]);

  useEffect(() => {
    const firstUnansweredIndex = quiz.questions.findIndex((q) => !q.attempted);
    if (firstUnansweredIndex !== -1) {
      setCurrentQuestionIndex(firstUnansweredIndex);
    }
  }, [quiz]);

  const handleSetAnswer = (questionId: number, answer: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  return (
    <div className="mt-8 w-full max-w-[800px]">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold text-gray-700">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
        <span className="text-lg font-semibold text-red-600">
          ⏳ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all"
          style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {currentQuestion.type === "multiple_choice" ? (
        <MultipleChoice
          question={currentQuestion}
          setAnswer={handleSetAnswer}
          selectedAnswer={Number(answers[currentQuestion.id])} // Will be answer ID
        />
      ) : (
        <FreeResponse
          question={currentQuestion}
          setAnswer={handleSetAnswer}
          answer={answers[currentQuestion.id] ? answers[currentQuestion.id].toString() : undefined} // Will be user free response
        />
      )}

      <QuestionNav
        quizId={quiz.id}
        questionId={currentQuestion.id}
        attemptId={Number(userAttempt.id)}
        selectedAnswer={answers[currentQuestion.id]}
        isLastQuestion={currentQuestionIndex === quiz.questions.length - 1}
      />
    </div>
  );
}
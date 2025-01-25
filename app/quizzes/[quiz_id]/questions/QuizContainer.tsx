"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MultipleChoice from "./[question_id]/MultipleChoice";
import FreeResponse from "./[question_id]/FreeResponse";
import QuestionNav from "./[question_id]/QuestionNav";
import { QuizModel } from "@/types/quiz"; 

type QuizContainerProps = {
  quiz: QuizModel;
  userAttemptId: number | null;
};

export default function QuizContainer({ quiz, userAttemptId }: QuizContainerProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});

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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      window.location.href = `/quizzes/${quiz.id}/results?attemptId=${userAttemptId}`;
    }
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="mt-8 w-full max-w-[800px]">
      {currentQuestion.type === "multiple_choice" ? (
        <MultipleChoice question={currentQuestion} setAnswer={handleSetAnswer} selectedAnswer={answers[currentQuestion.id]} />
      ) : (
        <FreeResponse question={currentQuestion} setAnswer={handleSetAnswer} answer={answers[currentQuestion.id]} />
      )}

      <QuestionNav
        isLastQuestion={currentQuestionIndex === quiz.questions.length - 1}
        onNext={handleNextQuestion}
        isNextDisabled={!answers[currentQuestion.id]} // ✅ Disable next until an answer is selected
      />
    </div>
  );
}
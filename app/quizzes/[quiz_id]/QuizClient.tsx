"use client";

import { useState } from "react";
import { QuizProgressModel } from "@/types/quizProgress";
import StartQuizButton from "./StartQuizButton";
import QuizContainer from "./QuizContainer";

type QuizClientProps = {
  initialQuiz: QuizProgressModel;
};

export default function QuizClient({ initialQuiz }: QuizClientProps) {
  const [quiz, setQuiz] = useState<QuizProgressModel>(initialQuiz);

  // Handles starting a new quiz attempt
  const handleQuizStart = (newAttempt: { id: number; quizEndTime: string }) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      userAttempt: newAttempt,
    }));
  };

  if (!quiz.userAttempt) {
    return (
      <div className="container mx-auto px-6 py-10 bg-white flex flex-col items-center min-h-screen">
        <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
        <p className="text-lg text-gray-600 mt-2">{quiz.description}</p>
        <StartQuizButton quizId={quiz.id} onQuizStart={handleQuizStart} />
      </div>
    );
  }

  return <QuizContainer quiz={quiz} />;
}
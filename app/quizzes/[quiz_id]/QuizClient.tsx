"use client";

import { useState } from "react";
import { QuizProgressModel } from "@/types/quizProgress";
import StartQuizButton from "./StartQuizButton";
import { useRouter } from "next/navigation";
import QuizContainer from "./QuizContainer";

type QuizClientProps = {
  initialQuiz: QuizProgressModel;
};

export default function QuizClient({ initialQuiz }: QuizClientProps) {
  const [quiz, setQuiz] = useState<QuizProgressModel>(initialQuiz);
  const userAttempt = quiz.userAttempt;
  const router = useRouter();


  const handleQuizStart = (newAttempt: { id: number; quizEndTime: string, durationInSeconds: number | null, score: number }) => {
    const updatedQuestions = quiz.questions.map((q) => ({
      ...q,
      attempted: false,
    }));
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      userAttempt: newAttempt,
      questions: updatedQuestions, 
    }));
  };

  const handleAttemptClick = () => {
    if (userAttempt) {
      router.push(`/quizzes/${quiz.id}/results?attemptId=${userAttempt.id}`);
    }
  };

  const activeAttempt = userAttempt && new Date(userAttempt.quizEndTime) > new Date() && userAttempt.durationInSeconds === null;

  if (activeAttempt) {
    return <QuizContainer quiz={quiz} />;
  }

  return (
    <div className="container mx-auto px-6 py-10 bg-white flex flex-col items-center min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
      <p className="text-lg text-gray-600 mt-2">{quiz.description}</p>
      <StartQuizButton quizId={quiz.id} hasAttempt={!!quiz.userAttempt} onQuizStart={handleQuizStart} />
      {/* Show Latest Attempt if Available */}
      {userAttempt && (
        <div
          onClick={handleAttemptClick}
          className="mt-6 p-4 border rounded-md w-full max-w-md text-center cursor-pointer hover:bg-gray-100"
        >
          <h2 className="text-xl font-semibold">Latest Attempt</h2>
          <p className="text-gray-700">
            Completed on: {new Date(userAttempt.quizEndTime).toLocaleDateString()}
          </p>
          <p className="text-gray-700">Score: {userAttempt.score}</p>
        </div>
      )}
    </div>
  );
}
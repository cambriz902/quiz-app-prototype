import { redirect } from "next/navigation";
import { fetchQuizWithProgress } from "@/lib/quiz";
import QuizContainer from "./QuizContainer";
import { QuizProgressModel } from "@/types/quizProgress";
import StartQuizButton from "./StartQuizButton";

export default async function QuizPage({ params }: { params: Promise<{ quiz_id: string }> }) {
  const { quiz_id } = await params;
  const quizId = Number(quiz_id);
  const quiz: QuizProgressModel | null = await fetchQuizWithProgress(quizId);

  if (!quiz) {
    redirect("/quizzes"); 
  }

  // If the user hasn't started the quiz yet, show the start button
  if (!quiz.userAttempt) {
    <StartQuizButton quizId={quizId} />;
  }

  // If there's a completed attempt, redirect directly to results
  if (quiz.userAttempt && new Date(quiz.userAttempt.quizEndTime) < new Date()) {
    redirect(`/quizzes/${quizId}/results?attemptId=${quiz.userAttempt.id}`);
  }

  return <QuizContainer quiz={quiz} />;
}
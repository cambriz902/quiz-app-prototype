import { redirect } from "next/navigation";
import { fetchQuizWithProgress } from "@/lib/quiz";
import { QuizProgressModel } from "@/types/quizProgress";
import QuizClient from "./QuizClient";

export default async function QuizPage({ params }: { params: Promise<{ quiz_id: string }> }) {
  const { quiz_id } = await params;
  const quizId = Number(quiz_id);
  const quiz: QuizProgressModel | null = await fetchQuizWithProgress(quizId);

  if (!quiz) {
    redirect("/quizzes");
  }

  // Redirect if quiz is completed
  if (quiz.userAttempt && new Date(quiz.userAttempt.quizEndTime) < new Date()) {
    redirect(`/quizzes/${quizId}/results?attemptId=${quiz.userAttempt.id}`);
  }

  return <QuizClient initialQuiz={quiz} />;
}
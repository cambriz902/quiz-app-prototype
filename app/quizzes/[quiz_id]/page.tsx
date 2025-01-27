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

  return <QuizClient initialQuiz={quiz} />;
}
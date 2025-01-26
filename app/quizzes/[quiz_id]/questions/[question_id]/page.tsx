import { fetchQuizWithProgress } from "@/lib/quiz";
import { redirect, notFound } from "next/navigation";
import QuizContainer from "../QuizContainer";

export default async function QuestionPage(
  { params }: { params: Promise<{ quiz_id: string; question_id: string }> }
) {
  const { quiz_id } = await params;
  const quizId = Number(quiz_id);

  const quizWithProgress = await fetchQuizWithProgress(quizId);

  if (!quizWithProgress) {
    return notFound();
  }

  if (!quizWithProgress.userAttempt) {
    redirect(`/quizzes/${quizId}`);
  }

  return (
    <main className="container mx-auto px-6 py-10 bg-white flex flex-col items-center min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900">{quizWithProgress.title}</h1>
      <QuizContainer quiz={quizWithProgress} userAttempt={quizWithProgress.userAttempt} />
    </main>
  );
}
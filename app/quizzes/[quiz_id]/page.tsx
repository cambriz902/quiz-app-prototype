import { fetchQuizById } from "@/lib/quiz";
import { notFound } from "next/navigation";
import StartQuizButton from "./StartQuizButton";

export default async function QuizPage({ params }: { params: { quiz_id: string } }) {
  const { quiz_id } = await params;
  const quizId = Number(quiz_id);
  const quiz = await fetchQuizById(quizId);

  if (!quiz) return notFound();

  return (
    <main className="container mx-auto px-6 py-10 bg-white flex flex-col items-center min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center">{quiz.title}</h1>
      <p className="text-lg text-gray-700 text-center mt-4 max-w-[800px]">{quiz.description}</p>

      <StartQuizButton quizId={quizId} />
    </main>
  );
}
import { fetchQuizWithProgress } from "@/lib/quiz";
import { notFound } from "next/navigation";
// import { getCurrentUser } from "@/lib/auth";
import QuizContainer from "../QuizContainer";

export default async function QuizPage({ params }: { params: { quiz_id: string } }) {
  // const user = getCurrentUser(); // ✅ Use hardcoded user for now
  const { quiz_id } = await params;
  const quizId = Number(quiz_id);

  const quiz = await fetchQuizWithProgress(quizId);
  if (!quiz) notFound();

  return (
    <main className="container mx-auto px-6 py-10 bg-white flex flex-col items-center min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center">{quiz.title}</h1>
      <p className="text-lg text-gray-700 text-center mt-4 max-w-[800px]">{quiz.description}</p>

      <div className="mt-10 w-full max-w-[800px] bg-white p-6 rounded-lg shadow-lg">
        <QuizContainer quiz={quiz} userAttemptId={quiz.userAttemptId} />
      </div>
    </main>
  );
}
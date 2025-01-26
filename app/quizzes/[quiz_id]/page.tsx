import { fetchQuizWithProgress } from "@/lib/quiz";
import { redirect } from "next/navigation";

export default async function QuizPage({ params }: { params: Promise<{ quiz_id: string }> }) {
  const { quiz_id } = await params;
  const quizId = Number(quiz_id);
  const quizWithProgress = await fetchQuizWithProgress(quizId);

  if (!quizWithProgress) {
    return redirect("/quizzes");
  }

  const now = new Date();
  const userAttempt = quizWithProgress.userAttempt;
  const unansweredQuestions = quizWithProgress.questions.filter(q => !q.attempted).length;

  if (userAttempt) {
    if (new Date(userAttempt.quizEndTime) > now && unansweredQuestions > 0) {
      const nextQuestion = quizWithProgress.questions.find(q => !q.attempted);
      redirect(`/quizzes/${quizId}/questions/${nextQuestion?.id}`);
    } else {
      redirect(`/quizzes/${quizId}/results?attemptId=${userAttempt.id}`);
    }
  }

  return (
    <main className="container mx-auto px-6 py-10 bg-white flex flex-col items-center min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900">Start Quiz</h1>
      <p className="text-lg text-gray-600 mt-2">Click below to start a new attempt.</p>

      <form action={`/api/quizzes/${quizId}/start`} method="POST">
        <button
          type="submit"
          className="mt-6 px-8 py-4 text-white bg-blue-500 hover:bg-blue-600 rounded-lg text-lg font-semibold transition-shadow shadow-md hover:shadow-lg"
        >
          Start Quiz
        </button>
      </form>
    </main>
  );
}
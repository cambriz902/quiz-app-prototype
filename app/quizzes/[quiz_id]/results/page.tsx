import { redirect } from "next/navigation";
import { fetchQuizResults } from "@/lib/quiz";
import RetakeQuizButton from "./RetakeQuizButton";

export default async function QuizResultsPage({
  params,
  searchParams,
}: {
  params: { quiz_id: string };
  searchParams: { attemptId?: string };
}) {
  const quizId = Number(params.quiz_id);
  const attemptId = searchParams.attemptId ? Number(searchParams.attemptId) : null;

  if (!attemptId) {
    redirect(`/quizzes/${quizId}`); // ✅ Server-side redirect if no attemptId
  }

  // ✅ Fetch quiz results server-side instead of in useEffect()
  const { quiz, score, correct, incorrect, unanswered, questions } = await fetchQuizResults(quizId, attemptId);

  return (
    <main className="container mx-auto px-6 py-10 bg-white flex flex-col items-center min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900">Quiz Results</h1>
      <h2 className="text-2xl text-gray-700 mt-2">{quiz.title}</h2>
      <h3 className="text-lg text-gray-600 mt-2">{quiz.description}</h3>
      <p className="text-lg text-gray-600 mt-2 font-semibold">Your Score: {score}%</p>

      {/* ✅ Display Questions with Updated Styling */}
      <div className="mt-10 w-full max-w-2xl space-y-6">
        {questions.map((question, index) => (
          <div key={question.id} className="p-6 border rounded-lg shadow-sm bg-white">
            <p className="text-xl font-semibold">{index + 1}. {question.text}</p>

            {question.type === "multiple_choice" ? (
              <div className="mt-3 space-y-3">
                {question.options.map((option) => {
                  const isCorrect = option.isCorrect;
                  const userSelected = question.userAnswer === option.id;
                  const bgColor = isCorrect
                    ? "bg-green-200 border-green-500"
                    : userSelected
                    ? "bg-red-200 border-red-500"
                    : "bg-gray-100 border-gray-300";

                  return (
                    <div
                      key={option.id}
                      className={`p-3 border rounded-lg text-lg ${bgColor}`}
                    >
                      {option.value}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-3 p-3 border rounded-lg bg-gray-100 text-lg">
                <p><strong>Your Answer:</strong> {question.userAnswer || "No answer given"}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <RetakeQuizButton quizId={quizId} />  {/* ✅ Use the new component */}
    </main>
  );
}
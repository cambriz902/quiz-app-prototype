import { redirect } from "next/navigation";
import { fetchQuizResults } from "@/lib/quiz";
import RetakeQuizButton from "./RetakeQuizButton";
import { QuizResultsModel } from "@/types/quizResults";

export default async function QuizResultsPage({
  params,
  searchParams,
}: {
  params: { quiz_id: string };
  searchParams: { attemptId?: string };
}) {
  const {quiz_id} = await params;
  const quizId = Number(quiz_id);
  const { attemptId } = await searchParams;

  if (!attemptId) {
    redirect(`/quizzes/${quizId}`);
  }

  const result = await fetchQuizResults(quizId, Number(attemptId));

  if (!result) {
    redirect(`/quizzes/${quizId}`);
  }

  const quizResult = result as QuizResultsModel;
  const { quiz, score, durationInSeconds, questions } = quizResult;

  const minutes = durationInSeconds !== null ? Math.floor(durationInSeconds / 60) : null;
  const seconds = durationInSeconds !== null ? durationInSeconds % 60 : null;

  const totalQuizMinutes = Math.floor(quiz.timeLimitInSeconds / 60);
  const totalQuizSeconds = quiz.timeLimitInSeconds % 60;

  const timeSpentMessage =
    durationInSeconds !== null
      ? `${minutes} min ${seconds} sec`
      : `${totalQuizMinutes} min ${totalQuizSeconds} sec (Time Expired)`;

  return (
    <main className="container mx-auto px-6 py-10 bg-white flex flex-col items-center min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900">Quiz Results</h1>
      <h2 className="text-2xl text-gray-700 mt-2">{quiz.title}</h2>
      <p className="text-lg text-gray-600 mt-2 font-semibold">Your Score: {score}%</p>
      
      <p className="text-lg text-gray-600 mt-2 font-semibold">
        Time Spent: {timeSpentMessage}
      </p>

      <div className="mt-10 mb-4 w-full max-w-2xl space-y-6">
        {questions.map((question, index) => {
          const isUnanswered = question.userAnswer === null || question.userAnswer === undefined;
          const questionClasses = isUnanswered
            ? "bg-gray-100 border-yellow-300 italic text-gray-600"
            : "bg-white";

          return (
            <div key={question.id} className={`p-6 border rounded-lg shadow-sm ${questionClasses}`}>
              <p className="text-xl font-semibold">
                {index + 1}. {question.text}
              </p>

              {question.type === "multiple_choice" ? (
                <div className="mt-3 space-y-3">
                  {question.options.map((option) => {
                    const isCorrect = option.isCorrect;
                    const userSelected = question.userAnswer === option.id;
                    
                    const bgColor = isUnanswered
                      ? "bg-gray-100 border-yellow-300" 
                      : isCorrect
                      ? "bg-green-200 border-green-500"  
                      : userSelected
                      ? "bg-red-200 border-red-500"      
                      : "bg-gray-100 border-gray-300"; 

                    return (
                      <div key={option.id} className={`p-3 border rounded-lg text-lg ${bgColor}`}>
                        {option.value}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <>
                  <h3>{question.freeResponseFeedback}</h3>
                  <div
                    className={`mt-3 p-3 border rounded-lg text-lg ${
                      isUnanswered
                        ? "bg-gray-100 border-yellow-300 italic"
                        : question.isCorrectFreeResponse
                        ? "bg-green-200 border-green-500"
                        : "bg-red-200 border-red-500"
                    }`}
                  >
                    <p><strong>Your Answer:</strong> {question.userAnswer || "No answer given"}</p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <RetakeQuizButton quizId={quizId} />
    </main>
  );
}
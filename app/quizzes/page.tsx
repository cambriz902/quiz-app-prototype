import { fetchQuizzes } from "@/lib/quiz";
import QuizzesList from "./QuizzesList";
import RedirectButton from "../components/RedirectButton";


export default async function QuizzesPage() {
  const quizzes = await fetchQuizzes();

  return (
    <main className="container mx-auto px-6 py-12 bg-white">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 sm:text-5xl">
        Available <span className="text-blue-500">Quizzes</span>
      </h1>
      <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mt-4">
        Select a quiz below and start testing your knowledge!
      </p>
      <RedirectButton text="Create Quiz" route="/quizzes/create" />
      <QuizzesList quizzes={quizzes} />
    </main>
  );
}
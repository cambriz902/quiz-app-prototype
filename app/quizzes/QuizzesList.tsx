import QuizCard from "./QuizCard";

type Quiz = {
  id: number;
  title: string;
  description: string;
};

export default function QuizzesList({ quizzes }: { quizzes: Quiz[] }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10"
      role="list"
      aria-labelledby="page-title"
    >
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  );
}
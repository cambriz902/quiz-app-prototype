import { Quiz } from '@/types/quiz';
import QuizCard from '@/quizzes/QuizCard';

interface ChatQuizListProps {
	quizzes: Quiz[];
}

export default function ChatQuizList({ quizzes }: ChatQuizListDisplayProps) {

	return (
		<div className="flex flex-col gap-2">
			{quizzes.map((quiz) => {
				return (
					<div key={quiz.id} className="flex h-16">
						<QuizCard quiz={quiz} size={'small'}/>
					</div>
				);
			})}
		</div>
	)
}
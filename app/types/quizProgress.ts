import { QuestionModel } from "./question";

export type QuizProgressModel = {
  id: number;
  title: string;
  description: string;
  timeLimitInMinutes: number | null;
  questions: QuestionModel[];
  userAttempt: {
    id: number;
    quizEndTime: string;
  } | null;
};

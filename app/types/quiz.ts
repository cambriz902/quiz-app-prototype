import { QuestionModel } from "./question";

export type QuizModel = {
  id: number;
  title: string;
  description: string;
  timeLimitInMinutes: number | null;
  questions: QuestionModel[];
};

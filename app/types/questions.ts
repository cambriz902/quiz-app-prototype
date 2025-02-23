import { Question } from "@prisma/client";

export type QuestionWithOptions = Question & {
  multipleChoiceOptions: { id: number; isCorrect: boolean }[];
};

export interface GradingResult {
  isCorrect: boolean;
  feedback?: string;
} 
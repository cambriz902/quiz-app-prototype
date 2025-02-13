import { z } from "zod";

export const OpenAIResponseSchema = z.object({
  isCorrect: z.boolean(),
  feedback: z.string(),
});

export interface OpenAIResponseFormat {
  feedback: string;
  isCorrect: boolean;
}

const MultipleChoiceOptionSchema = z.object({
  text: z.string(),
  isCorrect: z.boolean(),
});

const QuestionSchema = z.object({
  type: z.enum(["multiple_choice", "free_response"]),
  text: z.string(),
  referenceText: z.string(),
  multipleChoiceOptions: MultipleChoiceOptionSchema.array(),
});

export const OpenAIQuizResponseSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: QuestionSchema.array(),
});

export interface OpenAIQuizResponseFormat {
  title: string;
  description: string;
  questions: {
    type: "multiple_choice" | "free_response";
    text: string;
    referenceText: string;
    multipleChoiceOptions: {
      text: string;
      isCorrect: boolean;
      
    }[] | null;
  }[];
}

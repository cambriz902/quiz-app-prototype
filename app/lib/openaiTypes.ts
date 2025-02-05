import { z } from "zod";

export const OpenAIResponseSchema = z.object({
  isCorrect: z.boolean(),
  feedback: z.string(),
});

export interface OpenAIResponseFormat {
  feedback: string;
  isCorrect: boolean;
}
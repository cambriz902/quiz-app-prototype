// export const OpenAIResponseSchema = {
//   name: "OpenAIResponse",
//   type: "object",
//   properties: {
//     isCorrect: { type: "boolean" },
//     feedback: { type: "string" }
//   },
//   required: ["isCorrect", "feedback"]
// };
import { z } from "zod";

export const OpenAIResponseSchema = z.object({
  isCorrect: z.boolean(),
  feedback: z.string(),
});

export interface OpenAIResponseFormat {
  answer: string;
  isCorrect: boolean;
}
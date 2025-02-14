import OpenAI from "openai";
import { OpenAIQuizResponseSchema, OpenAIQuizResponseFormat } from "@/lib/openaiTypes";
import { zodResponseFormat } from "openai/helpers/zod";
import { getQuizCreationPrompt } from "@/lib/prompts/quizCreationPrompt";

export async function generateQuiz(
  topic: string,
  numMultipleChoiceQuestions: number,
  numFreeResponseQuestions: number
): Promise<OpenAIQuizResponseFormat> {
  
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: zodResponseFormat(OpenAIQuizResponseSchema, "quiz_creation"),
    messages: [
      {
        role: "system",
        content: getQuizCreationPrompt(numMultipleChoiceQuestions, numFreeResponseQuestions, topic),
      },
      {
        role: "user",
        content: JSON.stringify({
          topic,
          numMultipleChoiceQuestions,
          numFreeResponseQuestions,
        }),
      },
    ],
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("Response content is null");
  }
  
  return JSON.parse(content);
} 
import OpenAI from "openai";
import { 
  OpenAIQuizResponseSchema, 
  OpenAIQuizResponseFormat, 
  OpenAIResponseSchema, 
  OpenAIResponseFormat 
} from "@/lib/openaiTypes";
import { zodResponseFormat } from "openai/helpers/zod";
import { getQuizCreationPrompt } from "@/lib/prompts/quizCreationPrompt";
import { getAnswerGradingPrompt } from "@/lib/prompts/answerGradingPrompt";

export async function generateQuiz(
  topic: string,
  numMultipleChoiceQuestions: number,
  numFreeResponseQuestions: number
): Promise<OpenAIQuizResponseFormat> {
  
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const systemPrompt = getQuizCreationPrompt(numMultipleChoiceQuestions, numFreeResponseQuestions, topic);
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: zodResponseFormat(OpenAIQuizResponseSchema, "quiz_creation"),
    messages: [
      {
        role: "system",
        content: systemPrompt,
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

export async function checkFreeResponseAnswer(
  userAnswer: string,
  questionText: string,
  referenceText: string
): Promise<OpenAIResponseFormat> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: zodResponseFormat(OpenAIResponseSchema, "answer_evaluation"),
    messages: [
      {
        role: "system",
        content: getAnswerGradingPrompt()
      },
      {
        role: "user",
        content: JSON.stringify({
          question: questionText,
          context: referenceText,
          answer: userAnswer
        })
      }
    ]
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("Response content is null");
  }

  return JSON.parse(content);
} 
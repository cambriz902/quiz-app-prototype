import openAIClient from '@/lib/services/openAIClient';

import { 
  OpenAIQuizResponseSchema, 
  OpenAIResponseSchema,
  OpenAIGeneralAgentSchema, 
} from "@/schemas/quizSchema";
import { 
  OpenAIQuizResponseFormat, 
  OpenAIResponseFormat, 
  OpenAIGeneralHelperFormat,
  ApiMessage } from '@/types/openAI';
import { zodResponseFormat } from "openai/helpers/zod";
import { getQuizCreationPrompt } from "@/lib/prompts/quizCreationPrompt";
import { getAnswerGradingPrompt } from "@/lib/prompts/answerGradingPrompt";
import { getGeneralAgentHelperPrompt } from '@/lib/prompts/generalAgentHelperPrompt'

export async function generateQuiz(
  topic: string,
  numMultipleChoiceQuestions: number,
  numFreeResponseQuestions: number
): Promise<OpenAIQuizResponseFormat> {
  
  const systemPrompt = getQuizCreationPrompt();
  const response = await openAIClient.chat.completions.create({
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
  const response = await openAIClient.chat.completions.create({
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

export async function promptUserForQuizSearch(
  messages: ApiMessage[]
): Promise<OpenAIGeneralHelperFormat> {
  const systemMessage = {
    role: "system",
    content: getGeneralAgentHelperPrompt()
  };
  const apiMessages = [systemMessage, ...messages]
  const response = await openAIClient.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: zodResponseFormat(OpenAIGeneralAgentSchema, "general_agent"),
    messages: apiMessages
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("Response content is null");
  }

  return JSON.parse(content);
}
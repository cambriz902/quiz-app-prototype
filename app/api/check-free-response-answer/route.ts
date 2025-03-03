import openAIClient from '@/lib/services/openAIClient';
import { NextRequest, NextResponse } from "next/server";
import { OpenAIResponseSchema } from "@/schemas/quizSchema";
import { OpenAIResponseFormat } from "@/types/openAI";
import { zodResponseFormat } from "openai/helpers/zod";


export async function POST(req: NextRequest) {
  try {
    const { userAnswer, questionText, questionContext } = await req.json();

    if (!userAnswer || !questionText || !questionContext) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const response = await openAIClient.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: zodResponseFormat(OpenAIResponseSchema, "answer_evaluation"),
      messages: [
        {
          role: "system",
          content: `You are an AI teacher evaluating student answers. Compare the user's answer to the given question and context, then return a structured JSON response strictly following the schema. Return feedback for the student that is easy to understand if the answer is incorrect.`,
        },
        {
          role: "user",
          content: JSON.stringify({
            question: questionText,
            context: questionContext,
            userAnswer,
          }),
        },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Response content is null");
    }
    const parsedResponse: OpenAIResponseFormat = JSON.parse(content);
    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Error evaluating answer:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
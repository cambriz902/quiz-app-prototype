import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { OpenAIQuizResponseSchema, OpenAIQuizResponseFormat } from "@/lib/openaiTypes";
import { zodResponseFormat } from "openai/helpers/zod";
import { createQuizFromOpenAI } from "@/lib/db/quizService";

export async function POST(req: NextRequest) {
  const { topic, numQuestions } = await req.json();
  try{
    if (!topic || !numQuestions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
  
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: zodResponseFormat(OpenAIQuizResponseSchema, "quiz_creation"),
      messages: [
        {
          role: "system",
          content: `You are an AI teacher creating a quiz. Create a quiz with ${numQuestions} multiple choice questions for the give topic ${topic}.`,
        },
        {
          role: "user",
          content: JSON.stringify({
            topic,
            numQuestions,
          }),
        },
      ],
    });
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Response content is null");
    }
    const parsedResponse: OpenAIQuizResponseFormat = JSON.parse(content);
    console.log(response.choices[0].message.content);
    const quiz = await createQuizFromOpenAI(parsedResponse, 1);
    return NextResponse.json({ quizId: quiz.id });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
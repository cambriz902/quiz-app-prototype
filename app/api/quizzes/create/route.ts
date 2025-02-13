import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { OpenAIQuizResponseSchema, OpenAIQuizResponseFormat } from "@/lib/openaiTypes";
import { zodResponseFormat } from "openai/helpers/zod";
import { createQuizFromOpenAI } from "@/lib/db/quizService";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { topic, numMultipleChoiceQuestions, numFreeResponseQuestions } = await req.json();
  try {
    if (!topic || numMultipleChoiceQuestions === undefined || numFreeResponseQuestions === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
  
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: zodResponseFormat(OpenAIQuizResponseSchema, "quiz_creation"),
      messages: [
        {
          role: "system",
          content: `You are an AI teacher creating a quiz. Create a quiz with ${numMultipleChoiceQuestions} multiple choice questions 
            and ${numFreeResponseQuestions} free response questions about ${topic}.

            For each question, provide:
            1. The question text
            2. A reference text that serves two purposes:
               - For multiple choice questions: Provides a detailed explanation of why the correct answer is right and why the other options are wrong
               - For free response questions: Contains comprehensive reference information that will be used to evaluate student answers using RAG (Retrieval Augmented Generation)
            
            For multiple choice questions:
            - Provide exactly 4 options
            - Ensure EXACTLY ONE option is marked as correct (isCorrect: true)
            - Make distractors (wrong answers) plausible but clearly incorrect
            
            Response format must match this schema:
            {
              "title": "Quiz title",
              "description": "Brief description of the quiz",
              "questions": [
                {
                  "type": "multiple_choice" | "free_response",
                  "text": "Question text",
                  "referenceText": "Detailed reference text for grading/explanation",
                  "multipleChoiceOptions": [  // Only for multiple_choice type
                    {
                      "text": "Option text",
                      "isCorrect": boolean
                    }
                  ]
                }
              ]
            }`,
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
    const parsedResponse: OpenAIQuizResponseFormat = JSON.parse(content);
    const quiz = await createQuizFromOpenAI(parsedResponse, 1);
    return NextResponse.json({ quizId: quiz.id });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
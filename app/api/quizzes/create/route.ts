import { NextRequest, NextResponse } from "next/server";
import { generateQuiz } from "@/lib/services/openaiService";
import { createQuizFromOpenAI } from "@/lib/db/quizService";

export async function POST(req: NextRequest) {
  try {
    const { topic, numMultipleChoiceQuestions, numFreeResponseQuestions } = await req.json();

    if (!isValidQuizRequest(topic, numMultipleChoiceQuestions, numFreeResponseQuestions)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const quizResponse = await generateQuiz({
      topic,
      numMultipleChoiceQuestions,
      numFreeResponseQuestions
    });
    const quiz = await createQuizFromOpenAI(quizResponse, 1);

    return NextResponse.json({ quizId: quiz.id });
    
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

function isValidQuizRequest(
  topic?: string,
  numMultipleChoiceQuestions?: number,
  numFreeResponseQuestions?: number
): boolean {
  return !!(topic && 
    numMultipleChoiceQuestions !== undefined && 
    numFreeResponseQuestions !== undefined
  );
}
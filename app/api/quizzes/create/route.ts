import { NextRequest, NextResponse } from "next/server";
import { generateQuiz } from "@/lib/services/openaiService";
import { createQuizFromOpenAI } from "@/lib/db/quizService";

function isValidQuizRequest(
  topic?: string,
  numMultipleChoiceQuestions?: number,
  numFreeResponseQuestions?: number
): [boolean, string] {
  if (!topic) {
    return [false, "Topic is required"];
  }
  
  if (numMultipleChoiceQuestions === undefined || numFreeResponseQuestions === undefined) {
    return [false, "Question counts are required"];
  }

  if (numMultipleChoiceQuestions < 0 || numFreeResponseQuestions < 0) {
    return [false, "Question counts cannot be negative"];
  }

  if (numMultipleChoiceQuestions > 10) {
    return [false, "Maximum 10 multiple choice questions allowed"];
  }

  if (numFreeResponseQuestions > 2) {
    return [false, "Maximum 2 free response questions allowed"];
  }

  return [true, ""];
}

export async function POST(req: NextRequest) {
  try {
    const { topic, numMultipleChoiceQuestions, numFreeResponseQuestions } = await req.json();
    const [isValid, errorMessage] = isValidQuizRequest(topic, numMultipleChoiceQuestions, numFreeResponseQuestions);
    if (!isValid) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const quizResponse = await generateQuiz(
      topic,
      numMultipleChoiceQuestions,
      numFreeResponseQuestions
    );
    const quiz = await createQuizFromOpenAI(quizResponse, 1);

    return NextResponse.json({ quizId: quiz.id });
    
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
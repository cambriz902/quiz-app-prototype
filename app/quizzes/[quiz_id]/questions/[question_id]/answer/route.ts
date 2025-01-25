import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { quiz_id: string; question_id: string } }) {
  try {
    const { attemptId, answer, questionType } = await req.json();
    const quizId = Number(params.quiz_id);
    const questionId = Number(params.question_id);

    if (questionType === "multiple_choice") {
      // Save multiple-choice answer
      await prisma.userAttemptedQuestionMultipleChoice.create({
        data: {
          userAttemptedQuizId: attemptId,
          questionId,
          multipleChoiceAnswerId: Number(answer), // Ensure it's a number
          timeSpent: 0, // Placeholder, can be updated if needed
        },
      });
    } else if (questionType === "free_response") {
      // Save free-response answer
      await prisma.userAttemptedQuestionFreeResponse.create({
        data: {
          userAttemptedQuizId: attemptId,
          questionId,
          answer: answer.toString(),
          timeSpent: 0, // Placeholder, can be updated if needed
        },
      });
    } else {
      return NextResponse.json({ error: "Invalid question type" }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to save answer:", error);
    return NextResponse.json({ error: "Failed to save answer" }, { status: 500 });
  }
}
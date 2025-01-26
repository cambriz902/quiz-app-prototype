import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ quiz_id: string; question_id: string }> }
) {
  const { question_id } = await params;
  const { selectedAnswer, attemptId, isLastQuestion } = await req.json();
  const questionId = Number(question_id);
  
  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });

  if (question.type === "multiple_choice") {
    await prisma.userAttemptedQuestionMultipleChoice.create({
      data: {
        userAttemptedQuiz: { connect: { id: attemptId } },
        question: { connect: { id: questionId } },
        multipleChoiceAnswer: { connect: { id: selectedAnswer } },
      },
    });
  } else {
    await prisma.userAttemptedQuestionFreeResponse.create({
      data: {
        userAttemptedQuiz: { connect: { id: attemptId} },
        question: { connect: { id: questionId } },
        answer: selectedAnswer,
      },
    });
  }

  if (isLastQuestion) {
    const attempt = await prisma.userAttemptedQuiz.findUnique({ where: { id: attemptId } });
    if (!attempt) return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    const durationInSeconds = Math.floor((new Date().getTime() - new Date(attempt.createdAt).getTime()) / 1000);
    
    await prisma.userAttemptedQuiz.update({
      where: { id: attemptId },
      data: { durationInSeconds },
    });

    return NextResponse.json({ success: true, quizCompleted: true, durationInSeconds });
  }

  return NextResponse.json({ success: true });
}
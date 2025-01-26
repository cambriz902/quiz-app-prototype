import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest, 
  { params }:  { params: Promise<{ quiz_id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const { quiz_id } = await params;
  const quizId = Number(quiz_id);

  const existingAttempt = await prisma.userAttemptedQuiz.findFirst({
    where: {
      userId: user.id,
      quizId,
      quizEndTime: { gt: new Date() }, // Ensure it's an active attempt
    },
    orderBy: { createdAt: "desc" }, // Get latest attempt
  });

  if (existingAttempt) {
    return NextResponse.json({ success: false, error: "Active quiz attempt already exists" }, { status: 400 });
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: { orderBy: { createdAt: "asc" } } }, // Get first question
  });

  if (!quiz || quiz.questions.length === 0) {
    return NextResponse.json({ error: "Quiz not found or has no questions" }, { status: 404 });
  }

  const newAttempt = await prisma.userAttemptedQuiz.create({
    data: {
      userId: user.id,
      quizId,
      // quizEndTime: new Date(Date.now() + quiz.timeLimitInMinutes * 60 * 1000),
      quizEndTime: new Date(Date.now() + 60 * 1000), // 1 minutes for testing
    },
  });

  const firstQuestionId = quiz.questions[0].id;

  return NextResponse.json({ success: true, attemptId: newAttempt.id, firstQuestionId });
}
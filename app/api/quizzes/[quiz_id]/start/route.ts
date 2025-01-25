import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { quiz_id: string } }) {
  try {
    const { quiz_id } = await params;
    const user = getCurrentUser();
    const quizId = Number(quiz_id);
    console.log('in start quiz route', user, quizId);
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: { timeLimitInMinutes: true, questions: { select: { id: true }, orderBy: { createdAt: "asc" } } },
    });

    if (!quiz || quiz.questions.length === 0) {
      return NextResponse.json({ error: "Quiz not found or no questions available" }, { status: 404 });
    }

    const quizEndTime = new Date(Date.now() + quiz.timeLimitInMinutes * 60 * 1000);

    await prisma.userAttemptedQuiz.create({
      data: {
        userId: user.id,
        quizId,
        quizEndTime,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error starting quiz:", error);
    return NextResponse.json({ error: "Failed to start quiz" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ quiz_id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quiz_id } = await params;
    const quizId = Number(quiz_id);

    // Fetch latest attempt (regardless of completion)
    const latestAttempt = await prisma.userAttemptedQuiz.findFirst({
      where: { userId: user.id, quizId },
      orderBy: { createdAt: "desc" },
    });

    // If the latest attempt is still active, prevent a new attempt
    if (latestAttempt && latestAttempt.quizEndTime > new Date() && latestAttempt.durationInSeconds === null) {
      return NextResponse.json(
        { success: false, error: "An active quiz attempt already exists" },
        { status: 400 }
      );
    }

    // Fetch quiz and questions BEFORE creating the attempt
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: { select: { id: true }, orderBy: { createdAt: "asc" } } },
    });

    if (!quiz || quiz.questions.length === 0) {
      return NextResponse.json({ error: "Quiz not found or has no questions" }, { status: 404 });
    }

    // Create a new attempt
    const newAttempt = await prisma.userAttemptedQuiz.create({
      data: {
        userId: user.id,
        quizId,
        quizEndTime: new Date(Date.now() + 60 * 1000), // Uses dynamic quiz time limit
      },
    });

    return NextResponse.json({
      success: true,
      attempt: {
        id: newAttempt.id,
        quizEndTime: newAttempt.quizEndTime.toISOString(),
        durationInSeconds: newAttempt.durationInSeconds,
      },
    });

  } catch (error) {
    console.error("Error starting quiz:", error);
    return NextResponse.json(
      { error: "Something went wrong while starting the quiz. Please try again later." },
      { status: 500 }
    );
  }
}
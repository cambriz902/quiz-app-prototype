import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { quiz_id: string; question_id: string } }) {
  const user = getCurrentUser();
  const quizId = Number(params.quiz_id);
  const questionId = Number(params.question_id);
  const { selectedAnswer, attemptId } = await req.json();

  if (!attemptId) {
    return NextResponse.json({ error: "Attempt ID is required" }, { status: 400 });
  }

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { multipleChoiceOptions: true },
  });

  if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });

  let isCorrect = false;

  if (question.type === "multiple_choice") {
    const correctOption = question.multipleChoiceOptions.find((opt) => opt.isCorrect);
    isCorrect = correctOption?.id === selectedAnswer;

    await prisma.userAttemptedQuestionMultipleChoice.create({
      data: {
        userAttemptedQuizId: attemptId,
        questionId: questionId,
        multipleChoiceAnswerId: selectedAnswer as number,
      },
    });
  } else {
    isCorrect = true; // Assume free response answers are correct for now

    await prisma.userAttemptedQuestionFreeResponse.create({
      data: {
        userAttemptedQuizId: attemptId,
        questionId: questionId,
        answer: selectedAnswer as string,
        isCorrect: true,
      },
    });
  }

  // Fetch current attempt
  const attempt = await prisma.userAttemptedQuiz.findUnique({
    where: { id: attemptId },
    include: { quiz: { select: { questions: true } } },
  });

  if (!attempt) {
    return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  }

  const totalQuestions = attempt.quiz.questions.length;
  const updatedCorrect = attempt.correct + (isCorrect ? 1 : 0);
  const updatedIncorrect = attempt.incorrect + (isCorrect ? 0 : 1);
  const updatedScore = Math.ceil((updatedCorrect / totalQuestions) * 100);

  //  Update `UserAttemptedQuiz` progress
  await prisma.userAttemptedQuiz.update({
    where: { id: attemptId },
    data: {
      score: updatedScore,
      correct: updatedCorrect,
      incorrect: updatedIncorrect,
    },
  });

  return NextResponse.json({ success: true, isCorrect, updatedScore });
}
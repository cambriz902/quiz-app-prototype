import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { OpenAIResponseFormat } from "@/lib/openaiTypes";

export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ quiz_id: string; question_id: string }> }
) {
  try {
    const { selectedAnswer, attemptId, isLastQuestion } = await req.json();
    const { question_id } = await params;
    const questionId = Number(question_id);

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: {
        type: true,
        text: true,
        referenceText: true,
        multipleChoiceOptions: {
          where: { isCorrect: true },
          select: { id: true },
        },
      },
    });

    const attempt = await prisma.userAttemptedQuiz.findUnique({
      where: { id: attemptId },
      select: {
        id: true,
        correct: true,
        incorrect: true,
        createdAt: true,
      },
    });

    if (!question || !attempt) {
      return NextResponse.json({ error: "Invalid question or attempt" }, { status: 404 });
    }

    let isCorrect = false;
    let answerData;

    // Transaction for writes
    await prisma.$transaction(async (tx) => {
      if (question.type === "multiple_choice") {
        isCorrect = question.multipleChoiceOptions?.length > 0 && question.multipleChoiceOptions[0].id === Number(selectedAnswer);
        answerData = {
          userAttemptedQuizId: attemptId,
          questionId,
          multipleChoiceAnswerId: Number(selectedAnswer),
        };

        await tx.userAttemptedQuestionMultipleChoice.create({ data: answerData });
      } else {
        // openai check
        const url = `${req.nextUrl.origin}/api/check-free-response-answer`;
        const gradingResponse = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userAnswer: selectedAnswer,
            questionText: question.text,
            questionContext: question.referenceText,
          }),
        });

        if (!gradingResponse.ok) {
          throw new Error('Network response was not ok');
        }
      
        // Parse the JSON response
        const data: OpenAIResponseFormat = await gradingResponse.json();

        isCorrect = data.isCorrect; 
        answerData = {
          userAttemptedQuizId: attemptId,
          questionId,
          answer: selectedAnswer.toString(),
          feedback: data.feedback,
          isCorrect,
        };

        await tx.userAttemptedQuestionFreeResponse.create({ data: answerData });
      }

      // Update score & progress in one query
      const totalCorrect = attempt.correct + (isCorrect ? 1 : 0);
      const totalIncorrect = attempt.incorrect + (isCorrect ? 0 : 1);
      const totalAnswered = totalCorrect + totalIncorrect;
      const newScore = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

      const updateData: {
        correct: number;
        incorrect: number;
        score: number;
        durationInSeconds?: number;
      } = {
        correct: totalCorrect,
        incorrect: totalIncorrect,
        score: newScore,
      };

      // If last question, update durationInSeconds
      if (isLastQuestion) {
        updateData.durationInSeconds = Math.floor((Date.now() - new Date(attempt.createdAt).getTime()) / 1000);
      }

      await tx.userAttemptedQuiz.update({
        where: { id: attemptId },
        data: updateData,
        select: { durationInSeconds: true }, // Ensure we return the updated value
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing answer:", error);
    return NextResponse.json({ error: "Failed to submit answer" }, { status: 500 });
  }
}
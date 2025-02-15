import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { checkFreeResponseAnswer } from "@/lib/services/openaiService";
import { saveQuestionAnswer, updateQuizProgress } from "@/lib/db/quizService";
import { getQuestion, getQuizAttempt } from "@/lib/db/questionService";
import prisma from "@/lib/prisma";
import { QuestionWithOptions, GradingResult } from "@/lib/types/questions";
import { QuizAttemptForGrading } from "@/lib/types/attempts";

interface AnswerRequestBody {
  selectedAnswer: string;
  attemptId: string;
  isLastQuestion: boolean;
}

export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ quiz_id: string; question_id: string }> }
) {
  try {
    const { selectedAnswer, attemptId, isLastQuestion } = await req.json() as AnswerRequestBody;
    const { question_id } = await params;
    const questionId = Number(question_id);

    // Get question and attempt data
    const [question, attempt] = await Promise.all([
      getQuestion(questionId),
      getQuizAttempt(Number(attemptId))
    ]);

    if (!question || !attempt) {
      return NextResponse.json({ error: "Invalid question or attempt" }, { status: 404 });
    }

    // Grade the answer
    const { isCorrect, feedback } = await gradeAnswer(question, selectedAnswer);
    // Save answer and update progress
    await saveAnswerAndUpdateProgress(
      question,
      attempt,
      selectedAnswer,
      isCorrect,
      isLastQuestion,
      feedback
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing answer:", error);
    return NextResponse.json({ error: "Failed to submit answer" }, { status: 500 });
  }
}

async function gradeAnswer(question: QuestionWithOptions, answer: string): Promise<GradingResult> {
  if (question.type === "multiple_choice") {
    const correctAnswer = question.multipleChoiceOptions?.find(option => option.isCorrect);
    return {
      isCorrect: correctAnswer?.id === Number(answer),
      feedback: undefined
    };
  }

  return await checkFreeResponseAnswer(
    answer,
    question.text,
    question.referenceText || ""
  );
}

async function saveAnswerAndUpdateProgress(
  question: QuestionWithOptions,
  attempt: QuizAttemptForGrading,
  selectedAnswer: string,
  isCorrect: boolean,
  isLastQuestion: boolean,
  feedback?: string
) {
  await prisma.$transaction(async (tx) => {
    // Save the answer
    await saveQuestionAnswer({
      tx,
      questionType: question.type,
      attemptId: attempt.id,
      questionId: question.id,
      answer: selectedAnswer,
      isCorrect,
      feedback
    });

    // Update quiz progress
    await updateQuizProgress(
      tx,
      attempt,
      isCorrect,
      isLastQuestion
    );
  });
}
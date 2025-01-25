import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Quiz } from "@prisma/client";

/**
 * Fetch quiz details by ID, including questions.
 * This function runs on the server.
 */
export async function fetchQuizById(quizId: number): Promise<Quiz | null> {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          multipleChoiceOptions: true, // ✅ Fetch all answer choices too
        },
      },
    },
  });
  return quiz;
}

/**
 * Fetch all quizzes from the database
 */
export async function fetchQuizzes() {
  try {
    return await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return [];
  }
}

export async function fetchQuizWithProgress(quizId: number) {
  const user = getCurrentUser(); // ✅ Always use getCurrentUser()
  
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          multipleChoiceOptions: true,
        },
        orderBy: { createdAt: "asc" }, // ✅ Order questions by created_at
      },
    },
  });

  if (!quiz) return null;

  // Check if user has an active quiz attempt
  const userAttempt = await prisma.userAttemptedQuiz.findFirst({
    where: {
      quizId,
      userId: user.id,
      quizEndTime: { gt: new Date() }, // ✅ Check if quiz is still valid
    },
    include: {
      attemptedMultipleChoice: true,
      attemptedFreeResponse: true,
    },
  });

  const answeredQuestions = new Set([
    ...(userAttempt?.attemptedMultipleChoice.map((q) => q.questionId) || []),
    ...(userAttempt?.attemptedFreeResponse.map((q) => q.questionId) || []),
  ]);

  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    timeLimitInMinutes: quiz.timeLimitInMinutes,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      text: q.text,
      type: q.type,
      multipleChoiceOptions: q.type === "multiple_choice" ? q.multipleChoiceOptions.map((opt) => ({
        id: opt.id,
        value: opt.value,
      })) : undefined,
      attempted: answeredQuestions.has(q.id), // ✅ Mark attempted questions
    })),
    userAttemptId: userAttempt?.id || null,
  };
}
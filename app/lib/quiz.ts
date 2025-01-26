import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * Fetch quiz details by ID, including questions.
 * This function runs on the server.
 */
export async function fetchQuizById(quizId: number) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          multipleChoiceOptions: true, 
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

/**
 * 
 * @param quizId quiz ID to fetch with progress data
 * @returns Quiz with progress data to display in the UI
 */
export async function fetchQuizWithProgress(quizId: number) {
  const user = getCurrentUser();
  
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: { multipleChoiceOptions: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!quiz) return null;

  const userLatestAttempt = await prisma.userAttemptedQuiz.findFirst({
    where: {
      quizId,
      userId: user.id,
    },
    orderBy: { createdAt: "desc" },
    take: 1,
    include: {
      attemptedMultipleChoice: { select: { questionId: true } },
      attemptedFreeResponse: { select: { questionId: true } },
    },
  });

  const answeredQuestions = new Set([
    ...(userLatestAttempt?.attemptedMultipleChoice.map((q) => q.questionId) || []),
    ...(userLatestAttempt?.attemptedFreeResponse.map((q) => q.questionId) || []),
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
      multipleChoiceOptions: q.multipleChoiceOptions,
      attempted: answeredQuestions.has(q.id),
    })),
    userAttempt: userLatestAttempt
      ? {
          id: userLatestAttempt.id,
          quizEndTime: userLatestAttempt.quizEndTime.toISOString(),
        }
      : null,
  };
}

/**
 * 
 * @param quizId Quiz id to fetch results for
 * @returns Object containing quiz details and user's results
 */
export async function fetchQuizResults(quizId: number, attemptId: number) {
  const user = getCurrentUser();
  const attempt = await prisma.userAttemptedQuiz.findUnique({
    where: { id: attemptId, userId: user.id, quizId: quizId },
    include: {
      quiz: { select: { title: true } },
      attemptedMultipleChoice: { include: { multipleChoiceAnswer: true } },
      attemptedFreeResponse: true,
    },
  });

  if (!attempt) return null;

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { 
      questions: { 
        include: { multipleChoiceOptions: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!quiz) return null;

  return {
    quiz: { 
      title: quiz.title,
      timeLimitInSeconds: quiz.timeLimitInMinutes * 60,
    },
    score: attempt.score,
    durationInSeconds: attempt.durationInSeconds,
    questions: quiz.questions.map((question) => {
      const userMCAnswer = attempt.attemptedMultipleChoice.find((a) => a.questionId === question.id);
      const userFreeResponse = attempt.attemptedFreeResponse.find((a) => a.questionId === question.id);

      return {
        id: question.id,
        text: question.text,
        type: question.type,
        options: question.multipleChoiceOptions.map((option) => ({
          id: option.id,
          value: option.value,
          isCorrect: option.isCorrect,
        })),
        userAnswer: question.type === "multiple_choice" ? userMCAnswer?.multipleChoiceAnswerId : userFreeResponse?.answer,
        wasAttempted: Boolean(userMCAnswer || userFreeResponse),
      };
    }),
  };
}
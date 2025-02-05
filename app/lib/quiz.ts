import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * Fetch all quizzes from the database with pagination
 */
export async function fetchQuizzes(page = 1, pageSize = 10) {
  try {
    return await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return [];
  }
}

/**
 * Fetch quiz with user's progress data.
 * This function runs on the server.
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
      userAttempts: {
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          attemptedMultipleChoice: { select: { questionId: true } },
          attemptedFreeResponse: { select: { questionId: true } },
        },
      },
    },
  });

  if (!quiz) return null;

  const userLatestAttempt = quiz.userAttempts[0] || null;

  const answeredQuestions = new Set([
    ...(userLatestAttempt?.attemptedMultipleChoice?.map((q) => q.questionId) || []),
    ...(userLatestAttempt?.attemptedFreeResponse?.map((q) => q.questionId) || []),
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
          durationInSeconds: userLatestAttempt.durationInSeconds,
          score: userLatestAttempt.score,
        }
      : null,
  };
}

/**
 * Fetch quiz results for a specific attempt
 */
export async function fetchQuizResults(quizId: number, attemptId: number) {
  const user = getCurrentUser();

  const attempt = await prisma.userAttemptedQuiz.findUnique({
    where: { id: attemptId, userId: user.id, quizId: quizId },
    include: {
      quiz: {
        select: {
          title: true,
          timeLimitInMinutes: true,
          questions: {
            include: { multipleChoiceOptions: true },
            orderBy: { createdAt: "asc" },
          },
        },
      },
      attemptedMultipleChoice: { include: { multipleChoiceAnswer: true } },
      attemptedFreeResponse: true,
    },
  });

  if (!attempt) return null;

  return {
    quiz: {
      title: attempt.quiz.title,
      timeLimitInSeconds: attempt.quiz.timeLimitInMinutes * 60,
    },
    score: attempt.score,
    durationInSeconds: attempt.durationInSeconds,
    questions: attempt.quiz.questions.map((question) => {
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
        isCorrectFreeResponse: question.type === "free_response" ? userFreeResponse?.isCorrect : null,
        freeResponseFeedback: question.type === "free_response" ? userFreeResponse?.feedback : null,
        userAnswer: question.type === "multiple_choice" ? userMCAnswer?.multipleChoiceAnswerId : userFreeResponse?.answer,
        wasAttempted: Boolean(userMCAnswer || userFreeResponse),
      };
    }),
  };
}
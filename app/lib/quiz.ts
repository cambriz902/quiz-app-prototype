import prisma from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { QuizProgressModel } from "@/types/quizProgress";
import { QuizResultsModel } from "@/types/quizResults";
import { Quiz } from "@/types/quiz";

/**
 * Fetch all quizzes from the database with pagination
 */
export async function fetchQuizzes(page = 1, pageSize = 20, searchQuery = ''): Quiz {
  const userId = await getSessionUserId();
  if (!userId) {
    return [];
  }
  
  try {
    return await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
      },
      where: {
        authorId: userId,
        ...(searchQuery.length && {
          OR: [
            { title: { contains: searchQuery, mode: 'insensitive' } },
            { description: { contains: searchQuery, mode: 'insensitive' } }
          ]
        })
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
export async function fetchQuizWithProgress(quizId: number): Promise<QuizProgressModel | null> {
  const userId = await getSessionUserId();
  if (!userId) {
    return null;
  }

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: { multipleChoiceOptions: true },
          orderBy: { createdAt: "asc" },
        },
        userAttempts: {
          where: { userId: userId },
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
    } as QuizProgressModel;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return null;
  }
}

/**
 * Fetch quiz results for a specific attempt
 */
export async function fetchQuizResults(quizId: number, attemptId: number): Promise<QuizResultsModel | null> {
  const userId = await getSessionUserId();
  if (!userId) {
    return null;
  }

  const attempt = await prisma.userAttemptedQuiz.findUnique({
    where: { id: attemptId, userId: userId, quizId: quizId },
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
        isCorrectFreeResponse: userFreeResponse?.isCorrect ?? null,
        freeResponseFeedback: userFreeResponse?.feedback ?? null,
        userAnswer: userMCAnswer?.multipleChoiceAnswerId || userFreeResponse?.answer || null,
        wasAttempted: Boolean(userMCAnswer || userFreeResponse),
      };
    }),
  };
}
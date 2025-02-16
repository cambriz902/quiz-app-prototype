import prisma from "@/lib/prisma";

export async function getQuestion(questionId: number) {
  return prisma.question.findUnique({
    where: { id: questionId },
    include: {
      multipleChoiceOptions: {
        select: {
          id: true,
          isCorrect: true
        }
      }
    }
  });
}

export async function getQuizAttempt(attemptId: number) {
  return prisma.userAttemptedQuiz.findUnique({
    where: { id: attemptId },
    select: {
      id: true,
      correct: true,
      incorrect: true,
      createdAt: true,
    },
  });
} 
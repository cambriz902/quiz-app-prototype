import { OpenAIQuizResponseFormat } from "@/lib/openaiTypes";
import prisma from "@/lib/prisma";  
import { QuestionType, Prisma } from "@prisma/client";
import { QuizAttemptForGrading } from "@/types/attempts";


/**
 * TODO: If this is taking too long to execute, we can create a job
 * and email the user a link to the quiz once it's ready
 */

/**
 * Creates a quiz from OpenAI response format and returns the quiz object
 * @param quizData - Quiz data from OpenAI to create a quiz and questions
 * @param userId - User ID
 * @returns Quiz object
 */
export async function createQuizFromOpenAI(quizData: OpenAIQuizResponseFormat, userId: number) {
  try {
      return await prisma.$transaction(async (tx) => {
      const quiz = await tx.quiz.create({
        data: {
          title: quizData.title,
          authorId: userId,
          description: quizData.description,
        },
        select: {
          id: true,
        }
      });

      // Create questions in batches
      const batchSize = 5;
      for (let i = 0; i < quizData.questions.length; i += batchSize) {
        const questionsBatch = quizData.questions.slice(i, i + batchSize);
        
        for (const question of questionsBatch) {
          await tx.question.create({
            data: {
              quizId: quiz.id,
              text: question.text,
              type: question.type,
              referenceText: question.referenceText,
              multipleChoiceOptions: question.type === 'multiple_choice' ? {
                create: question.multipleChoiceOptions?.map(option => ({
                  isCorrect: option.isCorrect,
                  value: option.text
                }))
              } : undefined
            }
          });
        }
      }
      return quiz;
    }, {
      timeout: 20000,
      maxWait: 5000,
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw new Error("Failed to create quiz in database");
  }
}

interface SaveAnswerOptions {
  tx: Prisma.TransactionClient;
  questionType: QuestionType;
  attemptId: number;
  questionId: number;
  answer: string;
  isCorrect: boolean;
  feedback?: string;
  userId: number;
}

export async function saveQuestionAnswer({
  tx,
  questionType,
  attemptId,
  questionId,
  answer,
  isCorrect,
  feedback,
  userId
}: SaveAnswerOptions) {
  const attempt = await tx.userAttemptedQuiz.findUnique({
    where: {
      id: attemptId,
      userId: userId 
    }
  });

  if (!attempt) {
    throw new Error("Unauthorized access to quiz attempt");
  }

  if (questionType === QuestionType.multiple_choice) {
    await tx.userAttemptedQuestionMultipleChoice.create({
      data: {
        userAttemptedQuizId: attemptId,
        questionId,
        multipleChoiceAnswerId: Number(answer),
      }
    });
  } else {
    await tx.userAttemptedQuestionFreeResponse.create({
      data: {
        userAttemptedQuizId: attemptId,
        questionId,
        answer: answer.toString(),
        feedback,
        isCorrect,
      }
    });
  }
}

interface QuizUpdateData {
  correct: number;
  incorrect: number;
  score: number;
  durationInSeconds?: number;
}

export async function updateQuizProgress(
  tx: Prisma.TransactionClient,
  attempt: QuizAttemptForGrading,
  isCorrect: boolean,
  isLastQuestion: boolean,
  userId: number
) {
  if (attempt.userId !== userId) {
    throw new Error("Unauthorized access to quiz attempt");
  }

  const totalCorrect = attempt.correct + (isCorrect ? 1 : 0);
  const totalIncorrect = attempt.incorrect + (isCorrect ? 0 : 1);
  const totalAnswered = totalCorrect + totalIncorrect;
  const newScore = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const updateData: QuizUpdateData = {
    correct: totalCorrect,
    incorrect: totalIncorrect,
    score: newScore,
  };

  if (isLastQuestion) {
    updateData.durationInSeconds = Math.floor(
      (Date.now() - new Date(attempt.createdAt).getTime()) / 1000
    );
  }

  await tx.userAttemptedQuiz.update({
    where: { 
      id: attempt.id,
      userId: userId 
    },
    data: updateData,
  });
}

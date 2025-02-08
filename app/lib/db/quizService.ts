import { OpenAIQuizResponseFormat } from "@/lib/openaiTypes";
import prisma from "@/lib/prisma";  // Assuming you have Prisma set up

export async function createQuizFromOpenAI(quizData: OpenAIQuizResponseFormat, userId: number) {
  try {
    // Create the quiz and its related questions + choices in a transaction
    const quiz = await prisma.$transaction(async (tx) => {
      // Create the quiz first
      const quiz = await tx.quiz.create({
        data: {
          title: quizData.title,
          authorId: userId,
          description: quizData.description,
          // Create the questions and choices in a transaction
          questions: {
            create: quizData.questions.map((question) => ({
              text: question.text,
              type: question.type,
              // Create choices for each question
              multipleChoiceOptions: {
                create: question.multipleChoiceOptions.map((choice) => ({
                  value: choice.text,
                  isCorrect: choice.isCorrect,
                })),
              },
            })),
          },
        },
        // Include related data in the return value
        include: {
          questions: {
            include: {
              multipleChoiceOptions: true,
            },
          },
        },
      });

      return quiz;
    });

    return quiz;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw new Error("Failed to create quiz in database");
  }
}

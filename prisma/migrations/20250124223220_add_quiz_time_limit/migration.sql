/*
  Warnings:

  - You are about to drop the column `quizStartTime` on the `UserAttemptedQuiz` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "timeLimitInMinutes" INTEGER NOT NULL DEFAULT 10;

-- AlterTable
ALTER TABLE "UserAttemptedQuiz" DROP COLUMN "quizStartTime";

/*
  Warnings:

  - You are about to drop the column `is_correct` on the `UserAttemptedQuestionFreeResponse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserAttemptedQuestionFreeResponse" DROP COLUMN "is_correct",
ADD COLUMN     "isCorrect" BOOLEAN NOT NULL DEFAULT false;

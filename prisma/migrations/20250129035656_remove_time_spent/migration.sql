/*
  Warnings:

  - You are about to drop the column `timeSpent` on the `UserAttemptedQuestionFreeResponse` table. All the data in the column will be lost.
  - You are about to drop the column `timeSpent` on the `UserAttemptedQuestionMultipleChoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserAttemptedQuestionFreeResponse" DROP COLUMN "timeSpent";

-- AlterTable
ALTER TABLE "UserAttemptedQuestionMultipleChoice" DROP COLUMN "timeSpent";

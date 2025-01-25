/*
  Warnings:

  - You are about to drop the column `isSynced` on the `UserAttemptedQuiz` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `UserAttemptedQuiz` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserAttemptedQuiz" DROP COLUMN "isSynced",
DROP COLUMN "status";

-- DropEnum
DROP TYPE "UserAttemptedQuizStatus";

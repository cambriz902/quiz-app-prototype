-- AlterTable
ALTER TABLE "UserAttemptedQuiz" ALTER COLUMN "durationInSeconds" DROP NOT NULL,
ALTER COLUMN "durationInSeconds" DROP DEFAULT;

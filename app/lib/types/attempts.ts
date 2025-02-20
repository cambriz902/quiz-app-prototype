export interface QuizAttemptForGrading {
  id: number;
  correct: number;
  incorrect: number;
  createdAt: Date;
  userId: number;
}

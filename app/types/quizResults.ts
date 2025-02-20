export type QuestionType = 'multiple_choice' | 'free_response';

export interface QuizResultsModel {
  quiz: {
    title: string;
    timeLimitInSeconds: number;
  };
  score: number;
  durationInSeconds: number | null;
  questions: Array<{
    id: number;
    text: string;
    type: QuestionType;
    options: Array<{
      id: number;
      value: string;
      isCorrect: boolean;
    }>;
    userAnswer: string | number | null;
    isCorrectFreeResponse: boolean | null;
    freeResponseFeedback: string | null;
    wasAttempted: boolean;
  }>;
} 
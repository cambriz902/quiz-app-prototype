import { Quiz } from './quiz';

export enum AI_ROLE_TYPE {
  USER = "user",
  ASSISTANT = "assistant",
}

export type ApiMessage = {
	role: AI_ROLE_TYPE;
	content: string;
}


export interface OpenAIResponseFormat {
  feedback: string;
  isCorrect: boolean;
}

export interface OpenAIGeneralHelperFormat {
  userHasProvidedSearchQuery: boolean;
  searchQuery: string;
  clarifyingQuestion: string
}

export interface OpenAIQuizResponseFormat {
  title: string;
  description: string;
  questions: {
    type: "multiple_choice" | "free_response";
    text: string;
    referenceText: string;
    multipleChoiceOptions: {
      text: string;
      isCorrect: boolean;
    }[] | null;
  }[];
}
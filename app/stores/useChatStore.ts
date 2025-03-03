import { create } from 'zustand';

import { 
	ApiMessage, 
	AI_ROLE_TYPE, 
} from '@/types/openAI';

import { Quiz } from '@/types/quiz';

type ChatStore = {
	apiMessages: ChatMessage[];
	isFetchingAgentResponse: boolean;
	filteredQuizzes: Quiz[];
	initializeMessages: (apiMessages: ChatMessage[]) => void;
	processUserResponse: (message: string) => Promise<void>;
	fetchAgentResponse: () => Promise<void>;
	addMessage: (message: string, type: AI_ROLE_TYPE, quizzes?: Quiz[]) => void;
	fetchQuizzesWithQuery: (searchQuery: string) => Promise<void>;
}

export type ChatMessage = ApiMessage & {
	quizzes?: Quiz[];
}

export const useChatStore = create<ChatStore>((set, get) => ({
	apiMessages: [],
	isFetchingAgentResponse: false,
	filteredQuizzes: [],
	initializeMessages: (apiMessages) => {
		if (get().apiMessages.length === 0) {
			set({ apiMessages })
		}
	},
	addMessage: (message: string, type: AI_ROLE_TYPE, quizzes: Quiz[] = []) => {
		const newApiMessage = {
			role: type,
			content: message,
			quizzes
		};
		set({ apiMessages: [...get().apiMessages, newApiMessage] });
	},
	processUserResponse: async (message: string) => {
		get().addMessage(message, AI_ROLE_TYPE.USER);
		await get().fetchAgentResponse();
	},
	fetchAgentResponse: async () => {
		try {
			set({ isFetchingAgentResponse: true})
			const response = await fetch('/api/agent', {
				method: "POST",
				body: JSON.stringify({ messages: get().apiMessages })
			});
      const data = await response.json();
      const { userHasProvidedSearchQuery, clarifyingQuestion, searchQuery } = data;

      if (userHasProvidedSearchQuery) {
      	get().fetchQuizzesWithQuery(searchQuery);
      } else {
      	get().addMessage(clarifyingQuestion, AI_ROLE_TYPE.ASSISTANT);
      }
    } catch (error) {
      console.error('Error fetching agent response:', error);
    } finally {
      set({ isFetchingAgentResponse: false})
    }
	},
	fetchQuizzesWithQuery: async (searchQuery: string) => {
		try {
			set({ isFetchingAgentResponse: true });
			const response = await fetch(`/api/quizzes?search=${searchQuery}`, {
				method: "GET",
			});
			const data = await response.json();
			const quizzes: Quiz[] = data.quizzes;
			if (quizzes.length){
				get().addMessage(`Here are the quizzes I found about ${searchQuery}. Please Enter another topic to search for different quizzes.`, AI_ROLE_TYPE.ASSISTANT, quizzes);
			} else {
				get().addMessage(`I couldn't find any quizzes for ${searchQuery}. Please Enter another topic to search for different quizzes.`, AI_ROLE_TYPE.ASSISTANT);
			}

		} catch (error) {
			console.error('Error fetching quiz with search query', error);
		}
	}
}));
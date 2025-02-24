import { create } from 'zustand';

import { 
	ApiMessage, 
	AI_ROLE_TYPE, 
	OpenAIGeneralHelperFormat 
} from '@/types/openAI';

import { Quiz } from '@/types/quiz';

type ChatStore = {
	apiMessages: ChatMessage[];
	isFetchingAgentResponse: boolean;
	filteredQuizzes: Quiz[],
	initializeMessages: (apiMessages: ChatMessage[]) => void;
	processUserResponse: (message: string, type: AI_ROLE_TYPE) => OpenAIGeneralHelperFormat;
	addUserMessage: (message: string, type: AI_ROLE_TYPE) => void;
	fetchAgentResponse: () => OpenAIGeneralHelperFormat;
}

export type ChatMessage = ApiMessage & {
	quizzes?: Quiz[];
}

export const useChatStore = create<ChatStore>((set, get) => ({
	apiMessages: [],
	isFetchingAgentResponse: false,
	filteredQuizzes: [],
	initializeApiMessages: (apiMessages) => {
		if (get().apiMessages.length === 0) {
			set({ apiMessages })
		}
	},
	processUserResponse: async (message: string) => {
		get().addMessage(message, AI_ROLE_TYPE.USER);
		return get().fetchAgentResponse();
	},
	addMessage: (message: string, type: AI_ROLE_TYPE, quizzes: Quiz[] = []) => {
		const newApiMessage = {
			role: type,
			content: message,
			quizzes
		};
		set({ apiMessages: [...get().apiMessages, newApiMessage] });
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
			const data: { data: Quiz[] } = await response.json();
			get().addMessage(`Here are the quizzes I found about ${searchQuery}`, AI_ROLE_TYPE.ASSISTANT, data.data);

		} catch (error) {
			console.error('Error fetching quiz with search query', error);
		}
	}
}));
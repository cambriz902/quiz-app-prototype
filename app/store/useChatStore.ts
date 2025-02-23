import { create } from 'zustand';

import { ApiMessage, AI_ROLE_TYPE } from '@/types/openAI';

interface ChatStore {
	apiMessages: ApiMessage[];
	isFetchingAgentResponse: boolean;
	initializeMessages: (apiMessages: ApiMessage[]) => void;
	processUserResponse: (message: string, type: AI_ROLE_TYPE) => void;
	addUserMessage: (message: string, type: AI_ROLE_TYPE) => void;
	fetchAgentResponse: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
	apiMessages: [],
	isFetchingAgentResponse: false,
	initializeApiMessages: (apiMessages) => {
		if (get().apiMessages.length === 0) {
			set({ apiMessages })
		}
	},
	processUserResponse: (message: string) => {
		get().addMessage(message, AI_ROLE_TYPE.USER);
		set({ isFetchingAgentResponse: true});
		get().fetchAgentResponse();
	},
	addMessage: (message: string, type: AI_ROLE_TYPE) => {
		const newApiMessage = {
			role: type,
			content: message
		};
		set({ apiMessages: [...get().apiMessages, newApiMessage] });
	},
	fetchAgentResponse: () => {
		const mockResponse: string = "Okay it looks like you want me to search for a quiz related to react. Is that correct?";
		setTimeout(() => {
			get().addMessage(mockResponse, AI_ROLE_TYPE.ASSISTANT);
			set({ isFetchingAgentResponse: false });
		}, 2000);
	}
}));

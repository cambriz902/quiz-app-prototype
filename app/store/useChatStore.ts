import { create } from 'zustand';
import { ApiMessage, AI_ROLE_TYPE } from '@/app/types/openAI';

interface ChatStore {
	apiMessages: ApiMessage[];
	initializeMessages: (apiMessages: ApiMessage[]) => void;
	addUserMessage: (message: string, type: AI_ROLE_TYPE) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
	apiMessages: [],
	initializeApiMessages: (apiMessages) => {
		if (get().apiMessages.length === 0) {
			set({ apiMessages })
		}
	},
	addMessage: (message: string, type: AI_ROLE_TYPE) => {
		const newApiMessage = {
			role: type,
			content: message
		};
		set({ apiMessages: [...get().apiMessages, newApiMessage] })
	}
}));

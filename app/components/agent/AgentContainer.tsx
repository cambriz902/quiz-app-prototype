'use client'

import { useState, useEffect } from 'react';

import { useChatStore } from '@/stores/useChatStore';


import ChatWindow from './ChatWindow';
import { AI_ROLE_TYPE } from '@/types/openAI';
import ChatClosedState from './ChatClosedState';
import { ChatMessage } from '@/stores/useChatStore';


const initApiMessages: ChatMessage[] = [{
	role: AI_ROLE_TYPE.ASSISTANT,
	content: "Hello! How can I help? It looks like you're looking at quizzes. Do you want me to find a quiz for you?"
}];

export default function AgentContainer() {
	const [isChatOpen, setIsChatOpen] = useState(false);

	const { initializeApiMessages } = useChatStore();

	useEffect(() => {
		initializeApiMessages(initApiMessages);
	}, [initializeApiMessages])


	return (
		<div className="fixed bottom-4 right-8">
			{isChatOpen ? (
				<ChatWindow toggleChatOpen={() => setIsChatOpen((prev) => !prev)} />
			) : (
				<ChatClosedState toggleChatOpen={() => setIsChatOpen((prev) => !prev)} />
			)}
		</div>
	)
}
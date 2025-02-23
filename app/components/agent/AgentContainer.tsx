'use client'

import { useState, useEffect } from 'react';

import { useChatStore } from '@/store/useChatStore';


import ChatWindow from './ChatWindow';
import ChatClosedState from './ChatClosedState';
import { ApiMessage } from '@/types/openAI';


const initApiMessages: ApiMessage[] = [{
	role: 'assistant',
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
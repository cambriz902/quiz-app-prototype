'use client'

import { useState } from 'react';
import ChatWindow from './ChatWindow';
import ChatClosedState from './ChatClosedState';
import { ApiMessage } from '@/app/types/openAI';


const mockMessages: ApiMessage[] = [{
	role: 'assistant',
	content: "Hi there! I'm here to help. Do you want me to help you find a Quiz?"
}, {
	role: 'user',
	content: "Yes, i'm looking for the quiz on fruits"
}, {
	role: 'assistant',
	content: "Awesome!, it's easier for me to find a quiz from the title. Can you tell me a word that may be in the title?"
}, {
	role: 'user',
	content: 'i think the work react is in the title or its something like that'
}, {
	role: 'assistant',
	content: 'Searching for quiz with react in title'
}, {
	role: 'assistant',
	content: "Hi there! I'm here to help. Do you want me to help you find a Quiz?"
}, {
	role: 'user',
	content: "Yes, i'm looking for the quiz on fruits"
}, {
	role: 'assistant',
	content: "Awesome!, it's easier for me to find a quiz from the title. Can you tell me a word that may be in the title?"
}, {
	role: 'user',
	content: 'i think the work react is in the title or its something like that'
}, {
	role: 'assistant',
	content: 'Searching for quiz with react in title. Searching for quiz with react in title. Searching for quiz with react in title .Searching for quiz with react in title Searching for quiz with react in title. Searching for quiz with react in title'
}];

const apiMessages: ApiMessage[] = [{
	role: 'assistant',
	content: "Hello! How can I help? It looks like you're looking at quizzes. Do you want me to find a quiz for you?"
}];
export default function AgentContainer() {
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [messages, setMessages] = useState<ApiMessage[]>(apiMessages);

	return (
		<div className="fixed bottom-4 right-8">
			{isChatOpen ? (
				<ChatWindow 
					toggleChatOpen={() => setIsChatOpen((prev) => !prev)} 
					messages={messages}
				/>
			) : (
				<ChatClosedState toggleChatOpen={() => setIsChatOpen((prev) => !prev)} />
			)}
		</div>
	)
}
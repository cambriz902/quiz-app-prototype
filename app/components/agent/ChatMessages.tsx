'use client'

import { useRef } from 'react';
import ChatMessage from './ChatMessage';

interface ChatMessagesProps {
	messages: any[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
	const messagesContainerRef = useRef(null);
	console.log(messages)
	return (
		<div className="flex flex-col" ref={messagesContainerRef}>
			{messages.map((message, index) => {
				const isLastMessage = index === messages.length - 1;
				return (
					<ChatMessage 
						key={index} 
						message={message} 
						isLastMessage={isLastMessage} 
						messagesContainerRef={messagesContainerRef}
					/>
				);
			})}
		</div>
	)	
}
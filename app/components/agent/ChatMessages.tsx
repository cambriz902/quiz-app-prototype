'use client'

import { useRef } from 'react';

import { useChatStore } from '@/store/useChatStore';
import ChatMessage from './ChatMessage';


export default function ChatMessages() {
	const { apiMessages } = useChatStore();

	const messagesContainerRef = useRef(null);

	return (
		<div className="flex flex-col p-1 h-full overflow-auto" ref={messagesContainerRef}>
			{apiMessages.map((message, index) => {
				const isLastMessage = index === apiMessages.length - 1;
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
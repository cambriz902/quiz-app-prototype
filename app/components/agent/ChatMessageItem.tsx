'use client'

import AgentOutputDisplay from './AgentOutputDisplay';
import { ChatMessage } from '@/stores/useChatStore';
import ChatQuizList from './ChatQuizList';
import { RefObject } from 'react';

interface ChatMessageItemProps {
	message: ChatMessage;
	isLastMessage: boolean; 
	messagesContainerRef: RefObject<HTMLDivElement>;
}
export default function ChatMessageItem({ message, isLastMessage, messagesContainerRef }: ChatMessageItemProps) {

	const isUserMessage = message.role === 'user';

	
	return (
		<div className={`mt-1 p-1 rounded-sm ${isUserMessage ? "self-end" : ""}`}>
			{!isUserMessage ? (
				<div className="flex flex-col align-items-center gap-2">
					{isLastMessage ? (
						<>
							<AgentOutputDisplay
								video={'/videos/female-agent-v2.mp4'}
								containerRef={messagesContainerRef}
								videoPlayEnabled={true}
								text={message.content}
							/>
						</>
					) : (
						<>
							<AgentOutputDisplay
								video={'/videos/female-agent-v2.mp4'}
								containerRef={messagesContainerRef}
								videoPlayEnabled={false}
								text={message.content}
							/>
						</>
					)}
					{message.quizzes?.length ? (
						<ChatQuizList quizzes={message.quizzes} />
					) : null}
				</div>
			) : (
				<div className="p-1 rounded-md bg-blue-100">{message.content}</div>
			)}
		</div>
	)
}
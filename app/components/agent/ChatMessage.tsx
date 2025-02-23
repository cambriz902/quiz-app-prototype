'use client'

import AgentOutputDisplay from './AgentOutputDisplay';
import { ApiMessage } from '@/app/types/openAI';
const femaleAgentV1 = "/videos/female-agent-v2.mp4";

interface ChatMessageProps {
	message: ApiMessage;
	isLastMessage: boolean; 
	messageContainerRef: any;
}
export default function ChatMessage({ message, isLastMessage, messagesContainerRef }: ChatMessageProps) {

	const isUserMessage = message.role === 'user';
	return (
		<div className={`mt-1 p-1 rounded-sm ${isUserMessage ? "self-end" : ""}`}>
			{!isUserMessage ? (
				<div className="flex flex-col align-items-center gap-2">
					{isLastMessage ? (
						<>
							<AgentOutputDisplay
								video={femaleAgentV1}
								containerRef={messagesContainerRef}
								videoPlayEnabled={true}
								text={message.content}
							/>
						</>
					) : (
						<>
							<AgentOutputDisplay
								video={femaleAgentV1}
								containerRef={messagesContainerRef}
								videoPlayEnabled={false}
								text={message.content}
							/>
						</>
					)}
				</div>
			) : (
				<div className="p-1 rounded-md bg-gray-200">{message.content}</div>
			)}
		</div>
	)
}
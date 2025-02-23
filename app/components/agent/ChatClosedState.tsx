'use client'

interface ChatClosedStateProps {
	toggleChatOpen: () => void
}
export default function ChatClosedState({toggleChatOpen}: ChatClosedStateProps) {
	return (
		<button 
			className="p-1 border-2 rounded-lg bg-white text-md" 
			onClick={toggleChatOpen}
		>
			Need help?
		</button>
	)
}

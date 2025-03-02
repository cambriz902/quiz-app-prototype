'use client'

import Image from 'next/image';

interface ChatClosedStateProps {
	toggleChatOpen: () => void
}
export default function ChatClosedState({toggleChatOpen}: ChatClosedStateProps) {
	return (
		<button 
			className="p-1 border-4 border-blue-300 rounded-full bg-white hover:border-blue-500 transition" 
			onClick={toggleChatOpen}
		>
			<Image 
				src="/images/female-agent-pic-v3.webp" 
				width={35} 
			    height={35}
			    alt="Female agent avatar"
			/>
		</button>
	)
}

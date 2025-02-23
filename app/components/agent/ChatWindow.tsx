'use client'

import { useState } from 'react';

import UserInput from './UserInput';
import ChatMessages from './ChatMessages';

interface ChatWindowProps {
	toggleChatOpen: () => void;
}

export default function ChatWindow({ toggleChatOpen }: ChatWindowProps) {
	return (
		<div>
			<div className="relative h-[600px] max-h-[600px] w-[400px] border-2 bg-white rounded-lg">
				<button 
					className="flex items-center p-4 justify-center absolute right-0 top-[-40px] border-2 h-[24px] w-[24px] rounded-full text-gray-400 text-xl"
					onClick={toggleChatOpen}
				>
					x
				</button>
				<div className="flex flex-col h-full">
					<ChatMessages />
					<UserInput />
				</div>
			</div>
		</div>
	)
}
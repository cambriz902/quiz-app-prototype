'use client'

import { useState } from 'react';

export default function UserInput() {
	const [message, setMessage] = useState('');
	const [isDisabled, setIsDisabled] = useState(false);
	return (
		<div className="flex items-align-center p-2 border-1 bg-blue-200">
			<form className="flex w-full">
				<input
					type="text"
					readOnly={isDisabled}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					className="flex-1 p-2 mr-1 rounded-md"
				/>
				<button 
					type="submit"
					readOnly={isDisabled}
					className="p-1 bg-blue-500 rounded-md"
				>
					Send
				</button>
			</form>
		</div>
	)
}
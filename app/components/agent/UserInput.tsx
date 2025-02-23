'use client'

import { useForm } from 'react-hook-form';
import { useState } from 'react';

import { ApiMessage, AI_ROLE_TYPE } from '@/types/openAI'
import { useChatStore } from '@/store/useChatStore';

export default function UserInput() {
	const [isDisabled, setIsDisabled] = useState(false);

	const { register, handleSubmit, reset } = useForm();
	const { addMessage } = useChatStore();


	const onSubmit = (data) => {
		addMessage(data.message, AI_ROLE_TYPE.USER)
		reset();
	}
	return (
		<div className="flex items-align-center p-2 border-1 bg-blue-300">
			<form className="flex w-full" onSubmit={handleSubmit(onSubmit)}>
				<input
					type="text"
					{...register("message", { required: true })}
					readOnly={isDisabled}
					placeholder="Insert message..."
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
'use client'

import { useForm } from 'react-hook-form';

import { useChatStore } from '@/stores/useChatStore';

export default function UserInput() {
	const { register, handleSubmit, reset } = useForm();
	const { processUserResponse, isFetchingAgentResponse  } = useChatStore();


	const onSubmit = async (data) => {
		reset();
		await processUserResponse(data.message)
	}

	return (
		<div className="flex items-align-center p-2 border-1 bg-blue-300">
			<form className="flex w-full" onSubmit={handleSubmit(onSubmit)}>
				<input
					type="text"
					{...register("message", { required: true })}
					readOnly={isFetchingAgentResponse}
					placeholder="Insert message..."
					className="flex-1 p-2 mr-1 rounded-md"
				/>
				<button 
					type="submit"
					disabled={isFetchingAgentResponse}
					className="p-1 bg-blue-500 rounded-md"
				>
					Send
				</button>
			</form>
		</div>
	)
}
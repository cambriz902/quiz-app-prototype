import { NextResponse } from 'next/server';

import { ApiMessage } from '@/types/openAI';
import { promptUserForQuizSearch } from "@/lib/services/openaiService";

interface PostData {
	messages: ApiMessage[];
}

export async function POST(request: Request){
	const data: PostData = await request.json();
	const response = await promptUserForQuizSearch(data.messages);
	return NextResponse.json(response)
}
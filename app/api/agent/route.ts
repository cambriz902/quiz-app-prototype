import { NextResponse, NextResponse } from 'next/server';

import { ApiMessage, OpenAIGeneralHelperFormat } from '@/types/openAI';
import { promptUserForQuizSearch } from "@/lib/services/openaiService";

interface PostData {
	messages: ApiMessage[];
}

export async function POST(request: Request): NextResponse<OpenAIGeneralHelperFormat> {
	const data: PostDataType = await request.json();
	const response = await promptUserForQuizSearch(data.messages);
	return NextResponse.json(response)
}
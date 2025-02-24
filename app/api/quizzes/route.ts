import { NextResponse, NextRequest } from 'next/server';

import { fetchQuizzes } from '@/lib/quiz';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		const search = searchParams.get('search') || '';
		const page = searchParams.get('page') || 1;
		const pageSize = searchParams.get('pageSize') || 20;

		const data = await fetchQuizzes(page, pageSize, search);

		return NextResponse.json({
			data
		});
	} catch (error) {
		return NextResponse.json({
			error: `Server Error ${error}`, status: 500
		});
	}
}
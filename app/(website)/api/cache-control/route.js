import { NextResponse } from 'next/server';

export function GET() {
	const response = new NextResponse('Hello, Next.js!', {
		status: 200,
		headers: {
			'Cache-Control': 's-maxage=1, stale-while-revalidate'
		}
	});

	return response;
}

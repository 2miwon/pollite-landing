import type { RequestHandler } from '@sveltejs/kit';
import { getEmbedding } from '$lib/server/backend/nglok';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { question } = await request.json();
        const response = await getEmbedding(question);
        return new Response(JSON.stringify(response.result[0]), { status: 200 });
    } catch (error) {
        console.error('API: Error generating content:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate content' }), { status: 500 });
    }
};
import type { RequestHandler } from '@sveltejs/kit';
import { generateContent } from '$lib/server/ai/gemini';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { question, content } = await request.json();
        const response = await generateContent(question, content);
        const result = response.candidates[0].content.parts.map(part => part.text).join('\n');
        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        console.error('API: Error generating content:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate content' }), { status: 500 });
    }
};
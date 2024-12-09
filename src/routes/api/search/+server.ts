import type { RequestHandler } from '@sveltejs/kit';
import { getSearchResults } from '$lib/server/search/elastic';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { embeded } = await request.json();
        const response = await getSearchResults(embeded);

         const filtered = response.filter((item: any) => {
            const date = new Date(item._source.date);
            return date >= new Date('2020-01-01');
        });

        // const result = response.sort((a: any, b: any) => {
        //     const dateA = new Date(a._source.date);
        //     const dateB = new Date(b._source.date);
        //     return dateB.getTime() - dateA.getTime();
        // });

        return new Response(JSON.stringify(filtered[0]._source), { status: 200 });
    } catch (error) {
        console.error('API: Error generating content:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate content' }), { status: 500 });
    }
};
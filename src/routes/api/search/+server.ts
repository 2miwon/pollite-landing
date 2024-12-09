import type { RequestHandler } from '@sveltejs/kit';
import { vectorSearch, keywordSearch } from '$lib/server/search/elastic';

export const POST: RequestHandler = async ({ request }) => {
    console.log("embedding search is available");
    try {
        const { embeded } = await request.json();
        const response = await vectorSearch(embeded);
        console.log("res", response);
        return new Response(JSON.stringify(response[0]._source), { status: 200 });
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

export const GET: RequestHandler = async ({ url }) => {  
    console.log("keyword search is available");
    try {
        const keyword = url.searchParams.get('keyword');
        if (!keyword) {
            return new Response(JSON.stringify({ error: 'Keyword is required' }), { status: 400 });
        }

        const response = await keywordSearch(keyword);

        const filtered = response.filter((item: any) => {
            const date = new Date(item._source.date);
            return date >= new Date('2012-01-01');
        });
        if (filtered.length === 0) {
            return new Response(JSON.stringify({ error: 'No result found' }), { status: 404 });
        }
        return new Response(JSON.stringify(filtered[0]._source), { status: 200 });
    } catch (error) {
        console.error('API: Error generating content:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate content' }), { status: 500 });
    }
}
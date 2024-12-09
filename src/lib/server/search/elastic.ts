import { Client } from '@elastic/elasticsearch';
import { ELASTIC_PASSWORD } from '$env/static/private';

const client = new Client({
    node: 'https://gemini.es.ap-northeast-2.aws.elastic-cloud.com/',
    auth: {
        username: 'elastic',
        password: ELASTIC_PASSWORD
    }
});

export async function getSearchResults(embeded: any[]): Promise<any> {
    try {
        const response = await client.search({
            index: 'pdf_documents_with_kobert_embeddings',
            body: {
                knn: {
                    field: "content_vector",
                    query_vector: embeded,
                    k: 1000,
                    num_candidates: 10000
                }
            },
            sort: [
                {
                    _score: {
                        order: "desc"
                    },
                }
            ],
            size: 10000
            // scroll: '1m'
        });
        return response.hits.hits;
    }
    catch (error) {
        console.error(error);
    }
}

import axios from 'axios';

const ENDPOINT = 'https://eada-34-106-135-70.ngrok-free.app';

interface Embedding {
    result: string[][];
}

export async function getEmbedding(
    text: string,
): Promise<Embedding> {
    try {
        const response = await axios.get(ENDPOINT, {
            params: {
                text: text
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching embedding:', error);
        throw new Error('Failed to fetch embedding');
    }
}

export async function getEndpoint(): Promise<string> {
    const response = await axios.get('https://your-database-endpoint.com/get-ngrok-endpoint');
    return response.data.endpoint;
}
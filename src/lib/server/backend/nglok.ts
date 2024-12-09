import axios from 'axios';

const ENDPOINT = 'https://9b64-34-23-122-196.ngrok-free.app/embed';

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
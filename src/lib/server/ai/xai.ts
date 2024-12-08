import axios from 'axios';

const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';
const XAI_API_KEY = process.env.XAI_API_KEY;

interface Message {
    role: string;
    content: string;
}

interface ChatCompletionRequest {
    messages: Message[];
    model: string;
    stream: boolean;
    temperature: number;
}

interface ChatCompletionResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        message: Message;
        finish_reason: string;
        index: number;
    }[];
}

export async function getChatCompletion(
    content: string,
): Promise<ChatCompletionResponse> {
    const requestData: ChatCompletionRequest = {
        messages: [
            {
                role: 'system',
                content: 'You are a test assistant.'
            },
            {
                role: 'user',
                content: content
            }
        ],
        model: 'grok-beta',
        stream: false,
        temperature: 0
    };

    try {
        const response = await axios.post<ChatCompletionResponse>(XAI_API_URL, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${XAI_API_KEY}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching chat completion:', error);
        throw new Error('Failed to fetch chat completion');
    }
}
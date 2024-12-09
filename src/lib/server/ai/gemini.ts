import axios from 'axios';
import { GEMINI_API_KEY } from '$env/static/private';
import { sumSystemPrompt } from './prompt';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface ContentPart {
    text: string;
}

interface Content {
    parts: ContentPart[];
}

interface Candidate {
    content: Content;
    finishReason: string;
    avgLogprobs: number;
}

interface UsageMetadata {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
}

interface GenerateContentResponse {
    candidates: Candidate[];
    usageMetadata: UsageMetadata;
    modelVersion: string;
}

interface GenerateContentRequest {
    contents: Content[];
}

export async function generateContent(
    text: string, 
    content: string,
): Promise<GenerateContentResponse> {
    const requestData: GenerateContentRequest = {
        contents: [
            {
                parts: [
                    {
                        text: sumSystemPrompt
                    },
                    {
                        text: text
                    },
                    {
                        text: content
                    }
                ]
            }
        ]
    };

    try {
        const response = await axios.post<GenerateContentResponse>(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, requestData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('LIB: Error generating content:', error);
        throw new Error('Failed to generate content');
    }
}
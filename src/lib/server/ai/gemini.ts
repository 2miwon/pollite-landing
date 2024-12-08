import axios from 'axios';
import { GEMINI_API_KEY } from '$env/static/private';

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
    // document: String,
): Promise<GenerateContentResponse> {
    const requestData: GenerateContentRequest = {
        contents: [
            {
                parts: [
                    // {
                    //     text: 'You are a legislative expert system for the National Assembly. Your role is to assist users by providing detailed information and analysis on legislative bills. You should provide clear, concise, and accurate information based on the user\'s queries.'
                    // },
                    {
                        text: text
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
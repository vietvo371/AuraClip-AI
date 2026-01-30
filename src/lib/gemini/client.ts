import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_GEMINI_API_KEY) {
    throw new Error("GOOGLE_GEMINI_API_KEY is not set in environment variables");
}

/**
 * Google Gemini API Client
 */
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

/**
 * Get Gemini model instance
 * Using gemini-2.5-flash - latest and most capable flash model
 */
export function getGeminiModel() {
    return genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
            temperature: 0.9,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192, // Increased to prevent truncation
        },
    });
}

export { genAI };

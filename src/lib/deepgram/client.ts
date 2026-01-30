import { createClient } from "@deepgram/sdk";

if (!process.env.DEEPGRAM_API_KEY) {
    throw new Error("DEEPGRAM_API_KEY is not set in environment variables");
}

/**
 * Deepgram client for Text-to-Speech
 */
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

/**
 * Generate voiceover using Deepgram TTS
 * @param text - Text to convert to speech
 * @param voiceId - Voice ID (e.g., 'aura-asteria-en', 'aura-luna-en')
 * @param language - Language code (e.g., 'en', 'vi')
 * @returns Audio buffer and word-level timestamps
 */
export async function generateVoiceover(
    text: string,
    voiceId: string,
    language: string
): Promise<{ audioBuffer: Buffer; wordTimestamps: any[] }> {
    try {
        // Map language to Deepgram voice
        const voice = mapVoiceId(voiceId, language);

        console.log(`🎙️ Generating voiceover with voice: ${voice}`);
        console.log(`📝 Text length: ${text.length} characters`);

        // Call Deepgram TTS API with timeout
        const timeoutMs = 60000; // 60 seconds
        const responsePromise = deepgram.speak.request(
            { text },
            {
                model: voice,
                encoding: "linear16", // WAV format
                sample_rate: 24000,
            }
        );

        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Deepgram TTS timeout after 60s")), timeoutMs)
        );

        console.log("⏳ Waiting for Deepgram response...");
        const response = await Promise.race([responsePromise, timeoutPromise]) as Awaited<typeof responsePromise>;
        console.log("✅ Deepgram response received");

        // Get audio stream
        console.log("📥 Getting audio stream...");
        const stream = await response.getStream();
        if (!stream) {
            throw new Error("No audio stream returned from Deepgram");
        }
        console.log("✅ Stream received");

        // Convert stream to buffer
        console.log("🔄 Converting stream to buffer...");
        const audioBuffer = await streamToBuffer(stream);

        console.log(`✅ Voiceover generated: ${audioBuffer.length} bytes`);

        // Note: Deepgram TTS doesn't provide word timestamps directly
        // We'll need to use Deepgram STT (Speech-to-Text) to get timestamps
        // For now, return empty array - we'll implement this in the next iteration
        const wordTimestamps: any[] = [];

        return { audioBuffer, wordTimestamps };
    } catch (error) {
        console.error("❌ Deepgram TTS error:", error);
        console.error("Error details:", {
            message: error instanceof Error ? error.message : "Unknown",
            stack: error instanceof Error ? error.stack : undefined,
        });
        throw new Error(
            `Failed to generate voiceover: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

/**
 * Map voice ID to Deepgram voice model
 */
function mapVoiceId(voiceId: string, language: string): string {
    // Deepgram Aura voices
    const voices: Record<string, string> = {
        "en-male-1": "aura-asteria-en",
        "en-male-2": "aura-luna-en",
        "en-female-1": "aura-stella-en",
        "en-female-2": "aura-athena-en",
        "en-female-3": "aura-hera-en",
        "en-male-3": "aura-orion-en",
        "en-male-4": "aura-arcas-en",
        "en-male-5": "aura-perseus-en",
        "en-male-6": "aura-angus-en",
        "en-female-4": "aura-orpheus-en",
        "en-female-5": "aura-helios-en",
        "en-male-7": "aura-zeus-en",
    };

    // Default voice based on language
    if (language === "vi") {
        // Deepgram doesn't have Vietnamese voices yet
        // Use English voice as fallback
        return "aura-asteria-en";
    }

    return voices[voiceId] || "aura-asteria-en";
}

/**
 * Convert ReadableStream to Buffer
 */
async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
    }

    return Buffer.concat(chunks);
}

export { deepgram };

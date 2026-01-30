import { generateVoiceover } from "@/lib/deepgram/client";
import { uploadToStorage } from "@/lib/supabase/storage";
import type { VideoScript, GenerateVideoConfig, WordTimestamp } from "@/types/video";

/**
 * Generate voice audio from script using Deepgram TTS
 * @param videoId - Video ID for file naming
 * @param script - Generated script from Step 1
 * @param config - Video generation configuration
 * @returns Audio URL and word timestamps
 */
export async function generateVoice(
    videoId: string,
    script: VideoScript,
    config: GenerateVideoConfig
): Promise<{ audioUrl: string; wordTimestamps: WordTimestamp[] }> {
    try {
        console.log(`🎙️ Starting voice generation for video ${videoId}`);

        // Combine script text
        const fullText = combineScriptText(script);

        console.log(`📝 Full script: ${fullText.length} characters`);

        // Generate voiceover with Deepgram
        const { audioBuffer, wordTimestamps } = await generateVoiceover(
            fullText,
            config.voiceId,
            config.language
        );

        console.log(`✅ Audio generated: ${audioBuffer.length} bytes`);

        // Upload to Supabase Storage
        const audioPath = `${videoId}/voiceover.wav`;
        const audioUrl = await uploadToStorage(
            "audio",
            audioPath,
            audioBuffer,
            "audio/x-wav" // Supabase-compatible MIME type
        );

        console.log(`✅ Audio uploaded: ${audioUrl}`);

        return {
            audioUrl,
            wordTimestamps: wordTimestamps || [],
        };
    } catch (error) {
        console.error("❌ Voice generation error:", error);
        throw new Error(
            `Failed to generate voice: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

/**
 * Combine script parts into full text for TTS
 */
function combineScriptText(script: VideoScript): string {
    const parts: string[] = [];

    // Add hook
    if (script.hook) {
        parts.push(script.hook);
    }

    // Add scene texts
    script.scenes.forEach((scene) => {
        parts.push(scene.text);
    });

    // Add conclusion
    if (script.conclusion) {
        parts.push(script.conclusion);
    }

    // Join with pauses (periods create natural pauses in TTS)
    return parts.join(". ");
}

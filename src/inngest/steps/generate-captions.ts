import { uploadToStorage } from "@/lib/supabase/storage";
import type { WordTimestamp, CaptionSegment, CaptionData } from "@/types/video";

/**
 * Generate captions from word timestamps
 * @param videoId - Video ID for file naming
 * @param wordTimestamps - Word-level timestamps from TTS
 * @param captionStyle - Caption style (not used yet, for future styling)
 * @returns Caption URL and segments
 */
export async function generateCaptions(
    videoId: string,
    wordTimestamps: WordTimestamp[],
    captionStyle: string
): Promise<{ captionUrl: string; segments: CaptionSegment[] }> {
    try {
        console.log(`📝 Starting caption generation for video ${videoId}`);
        console.log(`📊 Word timestamps: ${wordTimestamps.length} words`);

        // If no timestamps, create simple captions (fallback)
        if (!wordTimestamps || wordTimestamps.length === 0) {
            console.warn("⚠️ No word timestamps available, skipping caption generation");
            return {
                captionUrl: "",
                segments: [],
            };
        }

        // Group words into caption segments (2-4 words per segment)
        const segments = groupWordsIntoSegments(wordTimestamps);

        console.log(`✅ Created ${segments.length} caption segments`);

        // Create caption data
        const captionData: CaptionData = {
            segments,
            totalDuration: segments[segments.length - 1]?.end || 0,
        };

        // Convert to JSON
        const captionJson = JSON.stringify(captionData, null, 2);
        const captionBuffer = Buffer.from(captionJson, "utf-8");

        // Upload to Supabase Storage
        const captionPath = `${videoId}/captions.json`;
        const captionUrl = await uploadToStorage(
            "captions",
            captionPath,
            captionBuffer,
            "application/json"
        );

        console.log(`✅ Captions uploaded: ${captionUrl}`);

        return {
            captionUrl,
            segments,
        };
    } catch (error) {
        console.error("❌ Caption generation error:", error);
        throw new Error(
            `Failed to generate captions: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

/**
 * Group words into caption segments
 * Each segment contains 2-4 words for optimal readability
 */
function groupWordsIntoSegments(
    wordTimestamps: WordTimestamp[]
): CaptionSegment[] {
    const segments: CaptionSegment[] = [];
    const wordsPerSegment = 3; // Average 3 words per caption
    let segmentId = 1;

    for (let i = 0; i < wordTimestamps.length; i += wordsPerSegment) {
        const segmentWords = wordTimestamps.slice(i, i + wordsPerSegment);

        if (segmentWords.length === 0) continue;

        const segment: CaptionSegment = {
            id: segmentId++,
            start: segmentWords[0].start,
            end: segmentWords[segmentWords.length - 1].end,
            text: segmentWords.map((w) => w.word).join(" "),
            words: segmentWords,
        };

        segments.push(segment);
    }

    return segments;
}

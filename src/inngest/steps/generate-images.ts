import { generateImage } from "@/lib/replicate/client";
import { uploadToStorage, downloadFile } from "@/lib/supabase/storage";
import type { VideoScene } from "@/types/video";

/**
 * Generate images for all scenes using Replicate SDXL Lightning
 * @param videoId - Video ID for file naming
 * @param scenes - Script scenes with image prompts
 * @param imageStyle - Image style (cinematic, anime, realistic)
 * @returns Array of image URLs
 */
export async function generateImages(
    videoId: string,
    scenes: VideoScene[],
    imageStyle: string
): Promise<{ imageUrls: string[] }> {
    try {
        console.log(`🎨 Starting image generation for video ${videoId}`);
        console.log(`📊 Scenes to generate: ${scenes.length}`);

        const imageUrls: string[] = [];

        // Generate images for each scene
        for (let i = 0; i < scenes.length; i++) {
            const scene = scenes[i];

            console.log(
                `🎨 Generating image ${i + 1}/${scenes.length} for scene ${scene.sceneNumber}`
            );

            try {
                // Generate image with Replicate
                const replicateUrl = await generateImage(
                    scene.imagePrompt,
                    imageStyle
                );

                // Download image from Replicate
                console.log(`⬇️ Downloading image from Replicate...`);
                const imageBuffer = await downloadFile(replicateUrl);

                // Upload to Supabase Storage
                const imagePath = `${videoId}/scene_${scene.sceneNumber}.png`;
                const imageUrl = await uploadToStorage(
                    "images",
                    imagePath,
                    imageBuffer,
                    "image/png"
                );

                console.log(`✅ Image ${i + 1} uploaded: ${imageUrl}`);

                imageUrls.push(imageUrl);
            } catch (sceneError) {
                console.error(
                    `❌ Failed to generate image for scene ${scene.sceneNumber}:`,
                    sceneError
                );

                // Continue with other scenes even if one fails
                // Push empty string as placeholder
                imageUrls.push("");
            }
        }

        const successCount = imageUrls.filter((url) => url !== "").length;
        console.log(
            `✅ Image generation complete: ${successCount}/${scenes.length} successful`
        );

        return { imageUrls };
    } catch (error) {
        console.error("❌ Image generation error:", error);
        throw new Error(
            `Failed to generate images: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

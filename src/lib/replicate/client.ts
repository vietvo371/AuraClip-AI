import Replicate from "replicate";

if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("REPLICATE_API_TOKEN is not set in environment variables");
}

/**
 * Replicate client for image generation
 */
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

/**
 * Generate image using SDXL Lightning (fast, high-quality)
 * @param prompt - Image generation prompt
 * @param style - Image style (cinematic, anime, realistic)
 * @returns Image URL from Replicate
 */
export async function generateImage(
    prompt: string,
    style: string
): Promise<string> {
    try {
        console.log(`🎨 Generating image with style: ${style}`);
        console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);

        // SDXL Lightning 4-step model (very fast)
        const model = "bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637";

        // Enhance prompt with style keywords
        const enhancedPrompt = enhancePrompt(prompt, style);

        // Run the model
        const output = await replicate.run(model, {
            input: {
                prompt: enhancedPrompt,
                negative_prompt:
                    "blurry, low quality, distorted, ugly, deformed, watermark, text, signature",
                num_inference_steps: 4,
                guidance_scale: 0, // SDXL Lightning works best with guidance_scale=0
                width: 1024,
                height: 1792, // 9:16 aspect ratio for vertical video
                num_outputs: 1,
            },
        });

        // Extract image URL
        const imageUrl = Array.isArray(output) ? output[0] : output;

        if (typeof imageUrl !== "string") {
            throw new Error("Invalid output from Replicate");
        }

        console.log(`✅ Image generated: ${imageUrl}`);

        return imageUrl;
    } catch (error) {
        console.error("❌ Replicate image generation error:", error);
        throw new Error(
            `Failed to generate image: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

/**
 * Enhance prompt with style-specific keywords
 */
function enhancePrompt(prompt: string, style: string): string {
    const styleEnhancements: Record<string, string> = {
        cinematic:
            "cinematic, professional photography, movie-like, dramatic lighting, high quality, 8k, detailed",
        anime: "anime style, Japanese animation, vibrant colors, detailed artwork, studio quality",
        realistic:
            "photorealistic, lifelike, natural lighting, high detail, authentic, professional photo",
    };

    const enhancement = styleEnhancements[style] || styleEnhancements.cinematic;

    return `${prompt}, ${enhancement}`;
}

export { replicate };

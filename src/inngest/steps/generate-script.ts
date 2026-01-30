import { getGeminiModel } from "@/lib/gemini/client";
import { VideoScript, GenerateVideoConfig } from "@/types/video";
import { jsonrepair } from "jsonrepair";

/**
 * Generate video script using Google Gemini API
 */
export async function generateScript(
    config: GenerateVideoConfig
): Promise<VideoScript> {
    const model = getGeminiModel();

    // Determine the topic
    const topic =
        config.niche === "custom" && config.customNiche
            ? config.customNiche
            : getNicheName(config.niche);

    // Build the prompt
    const prompt = buildScriptPrompt(topic, config);

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const rawText = response.text();

        console.log("=== Gemini Response ===");
        console.log("Length:", rawText.length, "chars");
        console.log("First 400:", rawText.substring(0, 400));
        console.log("Last 200:", rawText.substring(Math.max(0, rawText.length - 200)));
        console.log("======================");

        // Clean up markdown code blocks
        let cleanedText = rawText.trim();

        // Remove ```json at start
        if (cleanedText.startsWith("```json")) {
            cleanedText = cleanedText.substring(7).trim();
        } else if (cleanedText.startsWith("```")) {
            cleanedText = cleanedText.substring(3).trim();
        }

        // Remove ``` at end
        if (cleanedText.endsWith("```")) {
            cleanedText = cleanedText.substring(0, cleanedText.length - 3).trim();
        }

        console.log("✅ Cleaned, length:", cleanedText.length);
        console.log("First char:", cleanedText[0], "Last char:", cleanedText[cleanedText.length - 1]);

        // Parse JSON
        let script: VideoScript;

        try {
            script = JSON.parse(cleanedText);
            console.log("✅ Parsed successfully");
        } catch (parseError) {
            console.warn("⚠️ Parse failed, trying json-repair...");

            try {
                const repairedJson = jsonrepair(cleanedText);
                script = JSON.parse(repairedJson);
                console.log("✅ Repaired and parsed");
            } catch (repairError) {
                console.error("❌ Repair failed");
                console.error("Parse error:", parseError);
                console.error("Repair error:", repairError);
                console.error("Cleaned text:", cleanedText);
                throw parseError;
            }
        }

        // Log parsed script
        console.log("📋 Parsed script structure:");
        console.log("- Title:", script.title);
        console.log("- Hook:", script.hook?.substring(0, 50));
        console.log("- Scenes count:", script.scenes?.length || 0);
        if (script.scenes && script.scenes.length > 0) {
            script.scenes.forEach((scene, i) => {
                console.log(`  Scene ${i}:`, {
                    sceneNumber: scene.sceneNumber,
                    hasText: !!scene.text,
                    hasImagePrompt: !!scene.imagePrompt,
                    hasDuration: !!scene.duration,
                });
            });
        }
        console.log("- Conclusion:", script.conclusion?.substring(0, 50) || "missing");

        // Validate the response
        validateScript(script);

        console.log(`✅ Script validated: "${script.title}" with ${script.scenes.length} scenes`);

        return script;
    } catch (error) {
        console.error("❌ Error generating script:", error);
        if (error instanceof Error) {
            console.error("Error message:", error.message);
        }
        throw new Error(
            `Failed to generate script: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

/**
 * Build the prompt for script generation
 */
function buildScriptPrompt(
    topic: string,
    config: GenerateVideoConfig
): string {
    const platform = config.language === "vi" ? "TikTok/YouTube Shorts" : "TikTok/YouTube Shorts";
    const languageName = config.language === "vi" ? "Tiếng Việt" : "English";
    const styleDescription = getStyleDescription(config.imageStyle);

    return `You are a professional video script writer for ${platform} content.

**Topic**: ${topic}
**Language**: ${languageName}
**Visual Style**: ${styleDescription}
**Target Duration**: 60 seconds (1 minute)
**Platform**: Short-form vertical video (9:16 aspect ratio)

Generate a compelling, engaging video script optimized for ${platform} that will capture attention and keep viewers watching until the end.

**Script Structure Requirements:**

1. **Hook** (3-5 seconds): 
   - Start with a powerful, attention-grabbing opening
   - Use curiosity, shock value, or a bold statement
   - Must make viewers want to keep watching

2. **Main Content** (45-50 seconds):
   - Break into 4-5 distinct scenes
   - Each scene should be 8-12 seconds
   - Tell a compelling story or present fascinating information
   - Build tension or interest progressively
   - Use vivid, descriptive language

3. **Conclusion** (5-7 seconds):
   - Strong ending with impact
   - Call-to-action (like, follow, comment)
   - Leave viewers satisfied but wanting more

**For Each Scene, Provide:**
- **Scene Number**: Sequential number (1, 2, 3, etc.)
- **Text**: The exact narration/text that will be spoken or displayed (in ${languageName})
- **Image Prompt**: Detailed, vivid description for AI image generation (in English, regardless of script language)
  - Describe the visual scene in detail
  - Include style: "${styleDescription}"
  - Specify mood, lighting, composition
  - Be specific about subjects, actions, and environment
- **Duration**: Time in seconds for this scene (8-12 seconds typically)

**Important Guidelines:**
- Write naturally for ${languageName} audience
- Use emotional storytelling
- Keep language simple and engaging
- Make each scene visually distinct
- Ensure smooth transitions between scenes
- Total duration should be approximately 60 seconds

**CRITICAL: Return ONLY valid JSON** in this exact format. Do NOT include any markdown code blocks, explanations, or extra text. Just the raw JSON:

{
  "title": "Engaging video title that captures the essence (in ${languageName})",
  "hook": "Powerful opening hook text (in ${languageName})",
  "scenes": [
    {
      "sceneNumber": 1,
      "text": "Narration text for this scene (in ${languageName})",
      "imagePrompt": "Detailed visual description for image generation, ${styleDescription} style, cinematic lighting, [describe the scene in detail] (in English)",
      "duration": 10
    },
    {
      "sceneNumber": 2,
      "text": "Next scene narration (in ${languageName})",
      "imagePrompt": "Another detailed visual description, ${styleDescription} style, [describe scene] (in English)",
      "duration": 12
    }
  ],
  "conclusion": "Strong closing statement with call-to-action (in ${languageName})"
}

Generate the script now. Return ONLY the JSON, nothing else:`;
}

/**
 * Get niche display name
 */
function getNicheName(niche: string): string {
    const niches: Record<string, string> = {
        scary: "Horror Stories / Creepy Tales",
        motivational: "Motivational / Inspirational Stories",
        historical: "Historical Facts / Stories",
    };
    return niches[niche] || niche;
}

/**
 * Get style description for image generation
 */
function getStyleDescription(style: string): string {
    const styles: Record<string, string> = {
        cinematic:
            "cinematic, professional photography, movie-like, dramatic lighting, high quality",
        anime: "anime style, Japanese animation, vibrant colors, detailed artwork",
        realistic:
            "photorealistic, lifelike, natural lighting, high detail, authentic",
    };
    return styles[style] || "cinematic";
}

/**
 * Validate the generated script
 */
function validateScript(script: VideoScript): void {
    if (!script.title || typeof script.title !== "string") {
        throw new Error("Invalid script: missing or invalid title");
    }

    if (!script.hook || typeof script.hook !== "string") {
        throw new Error("Invalid script: missing or invalid hook");
    }

    // Conclusion is optional, provide default if missing
    if (!script.conclusion || typeof script.conclusion !== "string") {
        console.warn("⚠️ Conclusion missing, using default");
        script.conclusion = "Thanks for watching! Like and follow for more!";
    }

    if (!Array.isArray(script.scenes) || script.scenes.length === 0) {
        throw new Error("Invalid script: missing or empty scenes array");
    }

    // Validate each scene
    script.scenes.forEach((scene, index) => {
        if (typeof scene.sceneNumber !== "number") {
            throw new Error(`Scene ${index}: missing or invalid sceneNumber`);
        }
        if (!scene.text || typeof scene.text !== "string") {
            throw new Error(`Scene ${index}: missing or invalid text`);
        }
        if (!scene.imagePrompt || typeof scene.imagePrompt !== "string") {
            throw new Error(`Scene ${index}: missing or invalid imagePrompt`);
        }
        if (typeof scene.duration !== "number" || scene.duration <= 0) {
            throw new Error(`Scene ${index}: missing or invalid duration`);
        }
    });

    // Check total duration (should be around 60 seconds)
    const totalDuration = script.scenes.reduce(
        (sum, scene) => sum + scene.duration,
        0
    );
    if (totalDuration < 30 || totalDuration > 90) {
        console.warn(
            `Warning: Total duration is ${totalDuration}s, expected ~60s`
        );
    }
}

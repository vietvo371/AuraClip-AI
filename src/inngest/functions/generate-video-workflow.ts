import { inngest } from "@/lib/inngest/client";
import { supabaseAdmin } from "@/lib/supabase/server";
import { generateScript } from "../steps/generate-script";
import type { GenerateVideoConfig } from "@/types/video";

/**
 * Main video generation workflow
 * Handles the complete process of creating a video from script to final output
 */
export const generateVideoWorkflow = inngest.createFunction(
    {
        id: "generate-video-workflow",
        name: "Generate Video Workflow",
        retries: 3,
    },
    { event: "video/generate.requested" },
    async ({ event, step }) => {
        const config: GenerateVideoConfig = event.data;

        console.log(
            `Starting video generation for series ${config.seriesId}, episode ${config.episodeNumber}`
        );

        // Create or get existing video record
        const videoId = await step.run("create-video-record", async () => {
            // Check if video already exists
            const { data: existing } = await supabaseAdmin
                .from("videos")
                .select("id, status")
                .eq("series_id", config.seriesId)
                .eq("episode_number", config.episodeNumber)
                .single();

            // If exists and not failed, return existing ID
            if (existing && existing.status !== "failed") {
                console.log(`Video already exists with status: ${existing.status}`);
                return existing.id;
            }

            // If exists but failed, delete and recreate
            if (existing && existing.status === "failed") {
                await supabaseAdmin
                    .from("videos")
                    .delete()
                    .eq("id", existing.id);
            }

            // Create new video record
            const { data, error } = await supabaseAdmin
                .from("videos")
                .insert({
                    series_id: config.seriesId,
                    episode_number: config.episodeNumber,
                    title: "Generating...", // Will be updated with actual title
                    status: "pending",
                })
                .select("id")
                .single();

            if (error) {
                throw new Error(`Failed to create video record: ${error.message}`);
            }

            return data.id;
        });

        // Step 1: Generate Script with Gemini API
        const script = await step.run("generate-script", async () => {
            // Update status
            await supabaseAdmin
                .from("videos")
                .update({ status: "generating_script" })
                .eq("id", videoId);

            try {
                const generatedScript = await generateScript(config);

                // Save script to database
                const fullScriptText = `${generatedScript.hook}\n\n${generatedScript.scenes.map((s) => s.text).join("\n\n")}\n\n${generatedScript.conclusion}`;

                await supabaseAdmin
                    .from("videos")
                    .update({
                        title: generatedScript.title,
                        script_text: fullScriptText,
                        scenes: generatedScript.scenes,
                        status: "generating_images", // Ready for next step
                    })
                    .eq("id", videoId);

                return generatedScript;
            } catch (error) {
                // Update error status
                await supabaseAdmin
                    .from("videos")
                    .update({
                        status: "failed",
                        error_message: `Script generation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
                    })
                    .eq("id", videoId);

                throw error;
            }
        });

        console.log(`Script generated successfully: "${script.title}"`);
        console.log(`Total scenes: ${script.scenes.length}`);

        // Step 2: Generate Images (Future Implementation)
        // const images = await step.run("generate-images", async () => {
        //   await supabaseAdmin
        //     .from("videos")
        //     .update({ status: "generating_images" })
        //     .eq("id", videoId);
        //
        //   // TODO: Implement image generation using Replicate/Stability AI
        //   // For each scene.imagePrompt, generate an image
        //   // Save image URLs to database
        //
        //   return imageUrls;
        // });

        // Step 3: Generate Audio (Future Implementation)
        // const audio = await step.run("generate-audio", async () => {
        //   await supabaseAdmin
        //     .from("videos")
        //     .update({ status: "generating_audio" })
        //     .eq("id", videoId);
        //
        //   // TODO: Implement audio generation using ElevenLabs/Google TTS
        //   // Generate voice-over from script.text
        //   // Mix with background music
        //   // Save audio URL to database
        //
        //   return audioUrl;
        // });

        // Step 4: Assemble Video (Future Implementation)
        // const finalVideo = await step.run("assemble-video", async () => {
        //   await supabaseAdmin
        //     .from("videos")
        //     .update({ status: "assembling" })
        //     .eq("id", videoId);
        //
        //   // TODO: Implement video assembly using FFmpeg
        //   // Combine images, audio, captions
        //   // Export final video
        //   // Upload to storage
        //   // Save video URL to database
        //
        //   return videoUrl;
        // });

        // Mark as completed (for now, just script generation)
        await step.run("mark-completed", async () => {
            await supabaseAdmin
                .from("videos")
                .update({
                    status: "completed", // Will be "generating_images" when next step is implemented
                })
                .eq("id", videoId);
        });

        return {
            videoId,
            title: script.title,
            scenesCount: script.scenes.length,
            status: "Script generated successfully",
        };
    }
);

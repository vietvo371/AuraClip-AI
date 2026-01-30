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

        // Step 2: Generate Voice with Deepgram TTS
        const { audioUrl, wordTimestamps } = await step.run(
            "generate-voice",
            async () => {
                await supabaseAdmin
                    .from("videos")
                    .update({ status: "generating_audio" })
                    .eq("id", videoId);

                try {
                    const { generateVoice } = await import(
                        "../steps/generate-voice"
                    );
                    const result = await generateVoice(videoId, script, config);

                    // Save audio URL and timestamps
                    await supabaseAdmin
                        .from("videos")
                        .update({
                            audio_url: result.audioUrl,
                            word_timestamps: result.wordTimestamps,
                            status: "generating_captions",
                        })
                        .eq("id", videoId);

                    return result;
                } catch (error) {
                    await supabaseAdmin
                        .from("videos")
                        .update({
                            status: "failed",
                            error_message: `Voice generation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
                        })
                        .eq("id", videoId);

                    throw error;
                }
            }
        );

        console.log(`Voice generated: ${audioUrl}`);

        // Step 3: Generate Captions
        const { captionUrl } = await step.run(
            "generate-captions",
            async () => {
                try {
                    const { generateCaptions } = await import(
                        "../steps/generate-captions"
                    );
                    const result = await generateCaptions(
                        videoId,
                        wordTimestamps,
                        config.captionStyle
                    );

                    // Save caption URL
                    if (result.captionUrl) {
                        await supabaseAdmin
                            .from("videos")
                            .update({
                                caption_url: result.captionUrl,
                                status: "generating_images",
                            })
                            .eq("id", videoId);
                    } else {
                        // No captions, skip to images
                        await supabaseAdmin
                            .from("videos")
                            .update({ status: "generating_images" })
                            .eq("id", videoId);
                    }

                    return result;
                } catch (error) {
                    console.warn("Caption generation failed, continuing:", error);
                    // Don't fail the whole workflow if captions fail
                    await supabaseAdmin
                        .from("videos")
                        .update({ status: "generating_images" })
                        .eq("id", videoId);

                    return { captionUrl: "", segments: [] };
                }
            }
        );

        console.log(`Captions generated: ${captionUrl || "skipped"}`);

        // Step 4: Generate Images with Replicate
        const { imageUrls } = await step.run(
            "generate-images",
            async () => {
                try {
                    const { generateImages } = await import(
                        "../steps/generate-images"
                    );
                    const result = await generateImages(
                        videoId,
                        script.scenes,
                        config.imageStyle
                    );

                    // Save image URLs
                    await supabaseAdmin
                        .from("videos")
                        .update({
                            image_urls: result.imageUrls,
                            status: "completed", // All assets generated
                        })
                        .eq("id", videoId);

                    return result;
                } catch (error) {
                    await supabaseAdmin
                        .from("videos")
                        .update({
                            status: "failed",
                            error_message: `Image generation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
                        })
                        .eq("id", videoId);

                    throw error;
                }
            }
        );

        console.log(`Images generated: ${imageUrls.length} images`);

        // Mark as completed
        await step.run("mark-completed", async () => {
            await supabaseAdmin
                .from("videos")
                .update({
                    status: "completed",
                })
                .eq("id", videoId);
        });

        return {
            videoId,
            title: script.title,
            scenesCount: script.scenes.length,
            audioUrl,
            captionUrl,
            imageUrls,
            status: "All assets generated successfully",
        };
    }
);

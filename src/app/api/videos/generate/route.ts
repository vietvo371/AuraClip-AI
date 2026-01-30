import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { inngest } from "@/lib/inngest/client";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { GenerateVideoConfig } from "@/types/video";

/**
 * API Route to trigger video generation
 * POST /api/videos/generate
 */
export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { seriesId, episodeNumber } = body;

        if (!seriesId) {
            return NextResponse.json(
                { error: "Series ID is required" },
                { status: 400 }
            );
        }

        // Get series configuration
        const { data: series, error: seriesError } = await supabaseAdmin
            .from("series")
            .select("*")
            .eq("id", seriesId)
            .eq("user_id", userId)
            .single();

        if (seriesError || !series) {
            return NextResponse.json(
                { error: "Series not found" },
                { status: 404 }
            );
        }

        // Determine episode number
        const episode = episodeNumber || 1;

        // Build config for video generation
        const config: GenerateVideoConfig = {
            seriesId: series.id,
            episodeNumber: episode,
            niche: series.niche,
            customNiche: series.custom_niche,
            language: series.language,
            voiceId: series.voice_id,
            musicUrl: series.music_url,
            imageStyle: series.image_style,
            captionStyle: series.caption_style,
        };

        // Send event to Inngest
        await inngest.send({
            name: "video/generate.requested",
            data: config,
        });

        return NextResponse.json({
            success: true,
            message: "Video generation started",
            seriesId,
            episodeNumber: episode,
        });
    } catch (error) {
        console.error("Error triggering video generation:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}

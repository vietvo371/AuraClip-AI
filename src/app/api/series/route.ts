import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            niche,
            customNiche,
            language,
            voiceId,
            musicUrl,
            imageStyle,
            captionStyle,
            name,
            scheduleTime,
            platforms,
        } = body;

        // Validate required fields
        if (!name || !scheduleTime || !platforms || platforms.length === 0) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Insert series into Supabase
        const { data, error } = await supabaseAdmin
            .from("series")
            .insert({
                user_id: userId,
                name,
                niche,
                custom_niche: niche === "custom" ? customNiche : null,
                language,
                voice_id: voiceId,
                music_url: musicUrl,
                image_style: imageStyle,
                caption_style: captionStyle,
                schedule_time: scheduleTime,
                platforms,
                status: "scheduled",
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase error:", error);
            return NextResponse.json(
                { error: "Failed to create series" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data }, { status: 201 });
    } catch (error) {
        console.error("Error creating series:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data, error } = await supabaseAdmin
            .from("series")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase error:", error);
            return NextResponse.json(
                { error: "Failed to fetch series" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        console.error("Error fetching series:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

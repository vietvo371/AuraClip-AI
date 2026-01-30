import { NextResponse } from "next/server";
import { runMigrations, seedDatabase } from "@/lib/supabase/migrate";

/**
 * API Route to run database migrations
 * POST /api/migrate?seed=true
 */
export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const shouldSeed = searchParams.get("seed") === "true";

        // Run migrations
        await runMigrations();

        // Optionally run seeds
        if (shouldSeed) {
            await seedDatabase();
        }

        return NextResponse.json({
            success: true,
            message: "Migrations completed successfully",
        });
    } catch (error) {
        console.error("Migration error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Migration failed",
            },
            { status: 500 }
        );
    }
}

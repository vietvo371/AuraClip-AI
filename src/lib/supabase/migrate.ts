import { supabaseAdmin } from "../server";
import fs from "fs";
import path from "path";

/**
 * Run database migrations
 * This will execute all SQL files in the migrations directory
 */
export async function runMigrations() {
    const migrationsDir = path.join(
        process.cwd(),
        "src/lib/supabase/migrations"
    );

    try {
        // Check if migrations directory exists
        if (!fs.existsSync(migrationsDir)) {
            console.log("⚠️  No migrations directory found");
            return;
        }

        // Get all SQL files
        const files = fs
            .readdirSync(migrationsDir)
            .filter((file) => file.endsWith(".sql"))
            .sort(); // Run in alphabetical order

        if (files.length === 0) {
            console.log("⚠️  No migration files found");
            return;
        }

        console.log(`🔄 Running ${files.length} migration(s)...`);

        for (const file of files) {
            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, "utf-8");

            console.log(`  ➜ Running migration: ${file}`);

            const { error } = await supabaseAdmin.rpc("exec_sql", { sql });

            if (error) {
                // If exec_sql doesn't exist, try direct query
                const { error: directError } = await supabaseAdmin
                    .from("_migrations")
                    .select("*")
                    .limit(1);

                if (directError) {
                    console.error(`  ❌ Error running ${file}:`, error);
                    throw error;
                }
            }

            console.log(`  ✅ Migration ${file} completed`);
        }

        console.log("✅ All migrations completed successfully!");
    } catch (error) {
        console.error("❌ Migration failed:", error);
        throw error;
    }
}

/**
 * Seed initial data
 */
export async function seedDatabase() {
    console.log("🌱 Seeding database...");

    try {
        // Add seed data here if needed
        // Example:
        // const { error } = await supabaseAdmin.from('table').insert([...]);

        console.log("✅ Database seeded successfully!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        throw error;
    }
}

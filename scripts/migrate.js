#!/usr/bin/env node

/**
 * Database Migration Script
 * Usage:
 *   yarn migrate          - Run migrations only
 *   yarn migrate --seed   - Run migrations and seed data
 */

const { execSync } = require("child_process");

const args = process.argv.slice(2);
const shouldSeed = args.includes("--seed");

console.log("🚀 Starting database migration...\n");

try {
    // Build the URL
    const url = shouldSeed
        ? "http://localhost:3000/api/migrate?seed=true"
        : "http://localhost:3000/api/migrate";

    // Make request using curl
    const result = execSync(`curl -X POST "${url}"`, {
        encoding: "utf-8",
    });

    const response = JSON.parse(result);

    if (response.success) {
        console.log("\n✅ Migration completed successfully!");
        process.exit(0);
    } else {
        console.error("\n❌ Migration failed:", response.error);
        process.exit(1);
    }
} catch (error) {
    console.error("\n❌ Migration script error:", error.message);
    console.log("\n💡 Make sure your Next.js server is running (yarn dev)");
    process.exit(1);
}

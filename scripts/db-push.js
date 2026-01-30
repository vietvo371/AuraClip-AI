#!/usr/bin/env node

/**
 * Database Push Script
 * Displays SQL migrations for manual execution in Supabase
 * Usage: yarn db:push
 */

const fs = require("fs");
const path = require("path");

function pushDatabase() {
    console.log("🚀 Database Migration SQL\n");
    console.log("=".repeat(70));
    console.log("Copy the SQL below and run it in Supabase SQL Editor:");
    console.log("Dashboard → SQL Editor → New Query → Paste → Run");
    console.log("=".repeat(70) + "\n");

    try {
        const migrationsDir = path.join(__dirname, "../src/lib/supabase/migrations");

        if (!fs.existsSync(migrationsDir)) {
            console.error("❌ Migrations directory not found");
            process.exit(1);
        }

        const files = fs
            .readdirSync(migrationsDir)
            .filter((file) => file.endsWith(".sql"))
            .sort();

        if (files.length === 0) {
            console.error("❌ No migration files found");
            process.exit(1);
        }

        for (const file of files) {
            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, "utf-8");

            console.log(`-- Migration: ${file}`);
            console.log(sql);
            console.log("\n");
        }

        console.log("=".repeat(70));
        console.log("✅ Copy the SQL above and execute it in Supabase Dashboard");
        console.log("=".repeat(70));

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

pushDatabase();

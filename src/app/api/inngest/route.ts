import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { generateVideoWorkflow } from "@/inngest/functions/generate-video-workflow";

/**
 * Inngest API Route
 * Serves Inngest functions and handles webhooks
 */
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        generateVideoWorkflow,
        // Add more functions here as needed
    ],
});

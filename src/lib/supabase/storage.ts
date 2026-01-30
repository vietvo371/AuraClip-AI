import { supabaseAdmin } from "./server";

/**
 * Upload file to Supabase Storage
 * @param bucket - Storage bucket name (e.g., 'audio', 'images', 'captions')
 * @param path - File path within bucket (e.g., 'videoId/voiceover.mp3')
 * @param file - File buffer or blob to upload
 * @param contentType - MIME type (e.g., 'audio/mpeg', 'image/png')
 * @returns Public URL of uploaded file
 */
export async function uploadToStorage(
    bucket: string,
    path: string,
    file: Buffer | Blob,
    contentType: string
): Promise<string> {
    const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(path, file, {
            contentType,
            upsert: true, // Overwrite if exists
            cacheControl: "3600", // Cache for 1 hour
        });

    if (error) {
        console.error(`Storage upload error (${bucket}/${path}):`, error);
        throw new Error(`Failed to upload to storage: ${error.message}`);
    }

    // Get public URL
    const {
        data: { publicUrl },
    } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

    return publicUrl;
}

/**
 * Download file from URL as Buffer
 * @param url - URL to download from
 * @returns File buffer
 */
export async function downloadFile(url: string): Promise<Buffer> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

/**
 * Delete file from Supabase Storage
 * @param bucket - Storage bucket name
 * @param path - File path within bucket
 */
export async function deleteFromStorage(
    bucket: string,
    path: string
): Promise<void> {
    const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);

    if (error) {
        console.error(`Storage delete error (${bucket}/${path}):`, error);
        throw new Error(`Failed to delete from storage: ${error.message}`);
    }
}

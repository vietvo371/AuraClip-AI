// Video-related TypeScript types

export interface VideoScene {
    sceneNumber: number;
    text: string;
    imagePrompt: string;
    duration: number;
}

export interface VideoScript {
    title: string;
    hook: string;
    scenes: VideoScene[];
    conclusion: string;
}

export type VideoStatus =
    | "pending"
    | "generating_script"
    | "generating_images"
    | "generating_audio"
    | "assembling"
    | "completed"
    | "failed";

export interface Video {
    id: string;
    series_id: string;

    // Metadata
    title: string;
    episode_number: number;

    // Script data
    script_text?: string;
    scenes?: VideoScene[];

    // Image data
    image_urls?: string[];

    // Audio data
    voice_url?: string;
    final_audio_url?: string;

    // Final video
    video_url?: string;
    thumbnail_url?: string;
    duration_seconds?: number;

    // Status
    status: VideoStatus;
    error_message?: string;

    // Timestamps
    created_at: string;
    updated_at: string;
}

export interface GenerateVideoConfig {
    seriesId: string;
    episodeNumber: number;
    niche: string;
    customNiche?: string;
    language: string;
    voiceId: string;
    musicUrl: string;
    imageStyle: "cinematic" | "anime" | "realistic";
    captionStyle: string;
}

export interface GenerateVideoEvent {
    name: "video/generate.requested";
    data: GenerateVideoConfig;
}

// Word-level timestamp from Deepgram TTS
export interface WordTimestamp {
    word: string;
    start: number; // seconds
    end: number; // seconds
    confidence?: number;
}

// Caption segment with word-level timing
export interface CaptionSegment {
    id: number;
    start: number; // seconds
    end: number; // seconds
    text: string;
    words: WordTimestamp[];
}

// Complete caption data
export interface CaptionData {
    segments: CaptionSegment[];
    totalDuration: number;
}

// Generated assets from workflow
export interface GeneratedAssets {
    audioUrl: string;
    captionUrl: string;
    imageUrls: string[];
    wordTimestamps: WordTimestamp[];
}

export type Niche = 'scary' | 'motivational' | 'historical' | 'custom'
export type ImageStyle = 'cinematic' | 'anime' | 'realistic'
export type Platform = 'youtube' | 'tiktok'
export type SeriesStatus = 'draft' | 'scheduled' | 'published'

export interface SeriesFormData {
    // Step 1: Niche
    niche: Niche
    customNiche?: string

    // Step 2: Voice
    language: string
    voiceId: string

    // Step 3: Music
    musicUrl: string

    // Step 4: Style
    imageStyle: ImageStyle

    // Step 5: Captions
    captionStyle: string

    // Step 6: Schedule
    name: string
    scheduleTime: string // HH:mm format
    platforms: Platform[]
}

export interface Series extends SeriesFormData {
    id: string
    userId: string
    status: SeriesStatus
    createdAt: string
    updatedAt: string
}

export interface Voice {
    id: string
    name: string
    language: string
    gender: 'male' | 'female'
    sampleUrl?: string
}

export interface CaptionStyleOption {
    id: string
    name: string
    preview: string
    className: string
}

"use client";

import { useState } from "react";
import { Voice } from "@/types/series";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Play, Pause } from "lucide-react";

interface VoiceStepProps {
    language: string;
    voiceId: string;
    onLanguageChange: (language: string) => void;
    onVoiceChange: (voiceId: string) => void;
}

// Mock voice data
const voices: Voice[] = [
    {
        id: "vi-male-1",
        name: "Nam Miền Bắc",
        language: "vi",
        gender: "male",
    },
    {
        id: "vi-female-1",
        name: "Nữ Miền Bắc",
        language: "vi",
        gender: "female",
    },
    {
        id: "vi-male-2",
        name: "Nam Miền Nam",
        language: "vi",
        gender: "male",
    },
    {
        id: "vi-female-2",
        name: "Nữ Miền Nam",
        language: "vi",
        gender: "female",
    },
    {
        id: "en-male-1",
        name: "English Male",
        language: "en",
        gender: "male",
    },
    {
        id: "en-female-1",
        name: "English Female",
        language: "en",
        gender: "female",
    },
];

const languages = [
    { code: "vi", name: "Tiếng Việt" },
    { code: "en", name: "English" },
];

export function VoiceStep({
    language,
    voiceId,
    onLanguageChange,
    onVoiceChange,
}: VoiceStepProps) {
    const [playingVoice, setPlayingVoice] = useState<string | null>(null);

    const filteredVoices = voices.filter((v) => v.language === language);

    const handlePlayVoice = (id: string) => {
        if (playingVoice === id) {
            setPlayingVoice(null);
        } else {
            setPlayingVoice(id);
            // Simulate audio playback
            setTimeout(() => setPlayingVoice(null), 3000);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Chọn giọng nói</h2>
                <p className="text-muted-foreground">
                    Chọn ngôn ngữ và giọng đọc cho video của bạn
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="language">Ngôn ngữ</Label>
                <Select value={language} onValueChange={onLanguageChange}>
                    <SelectTrigger id="language" className="max-w-xs">
                        <SelectValue placeholder="Chọn ngôn ngữ" />
                    </SelectTrigger>
                    <SelectContent>
                        {languages.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                                {lang.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label className="mb-4 block">Giọng nói</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredVoices.map((voice) => {
                        const isSelected = voiceId === voice.id;
                        const isPlaying = playingVoice === voice.id;

                        return (
                            <Card
                                key={voice.id}
                                className={`p-4 cursor-pointer transition-all hover:shadow-lg ${isSelected
                                        ? "ring-2 ring-primary shadow-lg"
                                        : "hover:border-primary/50"
                                    }`}
                                onClick={() => onVoiceChange(voice.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center ${voice.gender === "male"
                                                    ? "bg-blue-500/10 text-blue-500"
                                                    : "bg-pink-500/10 text-pink-500"
                                                }`}
                                        >
                                            <span className="text-xl font-bold">
                                                {voice.gender === "male" ? "♂" : "♀"}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{voice.name}</h3>
                                            <p className="text-sm text-muted-foreground capitalize">
                                                {voice.gender === "male" ? "Nam" : "Nữ"}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePlayVoice(voice.id);
                                        }}
                                        className={isPlaying ? "text-primary" : ""}
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-5 h-5" />
                                        ) : (
                                            <Play className="w-5 h-5" />
                                        )}
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

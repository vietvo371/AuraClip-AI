"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Music } from "lucide-react";

interface MusicStepProps {
    musicUrl: string;
    onMusicUrlChange: (url: string) => void;
}

export function MusicStep({ musicUrl, onMusicUrlChange }: MusicStepProps) {
    const isValidUrl = musicUrl && musicUrl.startsWith("http");

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Chọn nhạc nền</h2>
                <p className="text-muted-foreground">
                    Nhập link nhạc nền từ ImageKit cho video của bạn
                </p>
            </div>

            <div className="max-w-2xl space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="musicUrl">URL nhạc nền (ImageKit)</Label>
                    <div className="relative">
                        <Music className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            id="musicUrl"
                            type="url"
                            placeholder="https://ik.imagekit.io/..."
                            value={musicUrl}
                            onChange={(e) => onMusicUrlChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Nhập URL đầy đủ từ ImageKit (bắt đầu với https://)
                    </p>
                </div>

                {isValidUrl && (
                    <div className="p-4 border rounded-lg bg-muted/50 animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Music className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">Nhạc nền đã chọn</p>
                                <p className="text-sm text-muted-foreground truncate max-w-md">
                                    {musicUrl}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            ✓ URL hợp lệ - Nhạc nền sẽ được sử dụng cho tất cả video trong
                            series
                        </p>
                    </div>
                )}

                <div className="p-4 border border-dashed rounded-lg">
                    <h3 className="font-medium mb-2">💡 Gợi ý</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Sử dụng nhạc không bản quyền để tránh vi phạm</li>
                        <li>• Chọn nhạc phù hợp với chủ đề video</li>
                        <li>• Âm lượng nhạc nên thấp hơn giọng đọc</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

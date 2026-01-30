"use client";

import { Platform } from "@/types/series";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Youtube } from "lucide-react";

interface ScheduleStepProps {
    name: string;
    scheduleTime: string;
    platforms: Platform[];
    onNameChange: (name: string) => void;
    onScheduleTimeChange: (time: string) => void;
    onPlatformsChange: (platforms: Platform[]) => void;
}

const platformOptions = [
    {
        id: "youtube" as Platform,
        name: "YouTube",
        icon: Youtube,
        color: "text-red-500",
    },
    {
        id: "tiktok" as Platform,
        name: "TikTok",
        icon: () => (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
        ),
        color: "text-black dark:text-white",
    },
];

export function ScheduleStep({
    name,
    scheduleTime,
    platforms,
    onNameChange,
    onScheduleTimeChange,
    onPlatformsChange,
}: ScheduleStepProps) {
    const handlePlatformToggle = (platform: Platform) => {
        if (platforms.includes(platform)) {
            onPlatformsChange(platforms.filter((p) => p !== platform));
        } else {
            onPlatformsChange([...platforms, platform]);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Lên lịch đăng bài</h2>
                <p className="text-muted-foreground">
                    Đặt tên series và cấu hình lịch đăng video
                </p>
            </div>

            <div className="max-w-2xl space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="seriesName">Tên Series *</Label>
                    <Input
                        id="seriesName"
                        placeholder="Ví dụ: Câu chuyện kinh dị hàng ngày"
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                        Tên này sẽ được sử dụng để quản lý series của bạn
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="scheduleTime">Thời gian đăng *</Label>
                    <div className="relative max-w-xs">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            id="scheduleTime"
                            type="time"
                            value={scheduleTime}
                            onChange={(e) => onScheduleTimeChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Video sẽ được đăng vào thời gian này mỗi ngày
                    </p>
                </div>

                <div className="space-y-3">
                    <Label>Nền tảng đăng bài *</Label>
                    <div className="space-y-3">
                        {platformOptions.map((platform) => {
                            const Icon = platform.icon;
                            const isChecked = platforms.includes(platform.id);

                            return (
                                <div
                                    key={platform.id}
                                    className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                                    onClick={() => handlePlatformToggle(platform.id)}
                                >
                                    <Checkbox
                                        id={platform.id}
                                        checked={isChecked}
                                        onCheckedChange={() => handlePlatformToggle(platform.id)}
                                    />
                                    <div className="flex items-center gap-2 flex-1">
                                        <div className={platform.color}>
                                            <Icon />
                                        </div>
                                        <Label
                                            htmlFor={platform.id}
                                            className="cursor-pointer font-medium"
                                        >
                                            {platform.name}
                                        </Label>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Chọn ít nhất một nền tảng để đăng video
                    </p>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                        <span className="text-xl">✅</span>
                        Sẵn sàng tạo series
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Nhấn "Lên lịch" để lưu cấu hình và bắt đầu tạo video tự động
                    </p>
                </div>
            </div>
        </div>
    );
}

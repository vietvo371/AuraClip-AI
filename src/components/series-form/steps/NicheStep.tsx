"use client";

import { Niche } from "@/types/series";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ghost, TrendingUp, BookOpen, Sparkles } from "lucide-react";

interface NicheStepProps {
    niche: Niche;
    customNiche?: string;
    onNicheChange: (niche: Niche) => void;
    onCustomNicheChange: (value: string) => void;
}

const niches = [
    {
        id: "scary" as Niche,
        name: "Kinh dị",
        description: "Câu chuyện ma quái, bí ẩn",
        icon: Ghost,
        gradient: "from-purple-500 to-pink-500",
    },
    {
        id: "motivational" as Niche,
        name: "Động lực",
        description: "Truyền cảm hứng, thành công",
        icon: TrendingUp,
        gradient: "from-orange-500 to-red-500",
    },
    {
        id: "historical" as Niche,
        name: "Lịch sử",
        description: "Sự kiện, nhân vật lịch sử",
        icon: BookOpen,
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        id: "custom" as Niche,
        name: "Tùy chỉnh",
        description: "Nhập chủ đề của riêng bạn",
        icon: Sparkles,
        gradient: "from-green-500 to-emerald-500",
    },
];

export function NicheStep({
    niche,
    customNiche,
    onNicheChange,
    onCustomNicheChange,
}: NicheStepProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Chọn chủ đề video</h2>
                <p className="text-muted-foreground">
                    Chọn loại nội dung bạn muốn tạo cho series của mình
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {niches.map((nicheOption) => {
                    const Icon = nicheOption.icon;
                    const isSelected = niche === nicheOption.id;

                    return (
                        <Card
                            key={nicheOption.id}
                            className={`p-6 cursor-pointer transition-all hover:shadow-lg ${isSelected
                                    ? "ring-2 ring-primary shadow-lg"
                                    : "hover:border-primary/50"
                                }`}
                            onClick={() => onNicheChange(nicheOption.id)}
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className={`p-3 rounded-lg bg-gradient-to-br ${nicheOption.gradient}`}
                                >
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-1">
                                        {nicheOption.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {nicheOption.description}
                                    </p>
                                </div>
                                <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected
                                            ? "border-primary bg-primary"
                                            : "border-muted-foreground"
                                        }`}
                                >
                                    {isSelected && (
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {niche === "custom" && (
                <div className="space-y-2 animate-fade-in-up">
                    <Label htmlFor="customNiche">Nhập chủ đề tùy chỉnh</Label>
                    <Input
                        id="customNiche"
                        placeholder="Ví dụ: Khoa học, Công nghệ, Du lịch..."
                        value={customNiche || ""}
                        onChange={(e) => onCustomNicheChange(e.target.value)}
                        className="max-w-md"
                    />
                </div>
            )}
        </div>
    );
}

"use client";

import { ImageStyle } from "@/types/series";
import { Card } from "@/components/ui/card";
import { Film, Sparkles, Camera } from "lucide-react";

interface StyleStepProps {
    imageStyle: ImageStyle;
    onImageStyleChange: (style: ImageStyle) => void;
}

const styles = [
    {
        id: "cinematic" as ImageStyle,
        name: "Cinematic",
        description: "Phong cách điện ảnh chuyên nghiệp",
        icon: Film,
        gradient: "from-slate-700 to-slate-900",
        preview: "🎬",
    },
    {
        id: "anime" as ImageStyle,
        name: "Anime",
        description: "Phong cách hoạt hình Nhật Bản",
        icon: Sparkles,
        gradient: "from-pink-500 to-purple-600",
        preview: "🎨",
    },
    {
        id: "realistic" as ImageStyle,
        name: "Realistic",
        description: "Hình ảnh chân thực, sống động",
        icon: Camera,
        gradient: "from-emerald-500 to-teal-600",
        preview: "📸",
    },
];

export function StyleStep({ imageStyle, onImageStyleChange }: StyleStepProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Chọn phong cách hình ảnh</h2>
                <p className="text-muted-foreground">
                    Chọn phong cách AI sẽ tạo hình ảnh cho video của bạn
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {styles.map((style) => {
                    const Icon = style.icon;
                    const isSelected = imageStyle === style.id;

                    return (
                        <Card
                            key={style.id}
                            className={`p-6 cursor-pointer transition-all hover:shadow-lg ${isSelected
                                    ? "ring-2 ring-primary shadow-lg"
                                    : "hover:border-primary/50"
                                }`}
                            onClick={() => onImageStyleChange(style.id)}
                        >
                            <div className="text-center space-y-4">
                                <div
                                    className={`mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br ${style.gradient} flex items-center justify-center text-4xl`}
                                >
                                    {style.preview}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">{style.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {style.description}
                                    </p>
                                </div>
                                <div
                                    className={`mx-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected
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

            <div className="p-4 border border-dashed rounded-lg max-w-2xl">
                <h3 className="font-medium mb-2">ℹ️ Lưu ý</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                        • <strong>Cinematic:</strong> Phù hợp với video nghiêm túc, chuyên
                        nghiệp
                    </li>
                    <li>
                        • <strong>Anime:</strong> Phù hợp với nội dung giải trí, trẻ trung
                    </li>
                    <li>
                        • <strong>Realistic:</strong> Phù hợp với nội dung giáo dục, tài
                        liệu
                    </li>
                </ul>
            </div>
        </div>
    );
}

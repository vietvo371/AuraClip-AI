"use client";

import { CaptionStyleOption } from "@/types/series";
import { Card } from "@/components/ui/card";

interface CaptionsStepProps {
    captionStyle: string;
    onCaptionStyleChange: (style: string) => void;
}

const captionStyles: CaptionStyleOption[] = [
    {
        id: "bold",
        name: "Bold",
        preview: "Chữ Đậm",
        className: "font-bold text-2xl",
    },
    {
        id: "outlined",
        name: "Outlined",
        preview: "Viền Chữ",
        className:
            "font-bold text-2xl text-white [text-shadow:_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000,_2px_2px_0_#000]",
    },
    {
        id: "shadow",
        name: "Shadow",
        preview: "Bóng Đổ",
        className: "font-bold text-2xl [text-shadow:_4px_4px_8px_rgb(0_0_0_/_80%)]",
    },
    {
        id: "minimal",
        name: "Minimal",
        preview: "Tối Giản",
        className: "font-medium text-xl",
    },
];

export function CaptionsStep({
    captionStyle,
    onCaptionStyleChange,
}: CaptionsStepProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Chọn kiểu phụ đề</h2>
                <p className="text-muted-foreground">
                    Chọn cách hiển thị phụ đề trong video của bạn
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {captionStyles.map((style) => {
                    const isSelected = captionStyle === style.id;

                    return (
                        <Card
                            key={style.id}
                            className={`p-6 cursor-pointer transition-all hover:shadow-lg ${isSelected
                                    ? "ring-2 ring-primary shadow-lg"
                                    : "hover:border-primary/50"
                                }`}
                            onClick={() => onCaptionStyleChange(style.id)}
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-lg">{style.name}</h3>
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
                                <div className="h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
                                    <p className={style.className}>{style.preview}</p>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className="p-4 border border-dashed rounded-lg max-w-2xl">
                <h3 className="font-medium mb-2">💡 Gợi ý</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Bold:</strong> Dễ đọc, phù hợp mọi loại video</li>
                    <li>
                        • <strong>Outlined:</strong> Nổi bật trên mọi nền, phù hợp TikTok
                    </li>
                    <li>
                        • <strong>Shadow:</strong> Sang trọng, phù hợp video chuyên nghiệp
                    </li>
                    <li>• <strong>Minimal:</strong> Tinh tế, không làm mất tập trung</li>
                </ul>
            </div>
        </div>
    );
}

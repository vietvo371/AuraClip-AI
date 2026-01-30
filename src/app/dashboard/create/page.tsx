"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { SeriesFormData } from "@/types/series";
import { ProgressBar } from "@/components/series-form/ProgressBar";
import { NicheStep } from "@/components/series-form/steps/NicheStep";
import { VoiceStep } from "@/components/series-form/steps/VoiceStep";
import { MusicStep } from "@/components/series-form/steps/MusicStep";
import { StyleStep } from "@/components/series-form/steps/StyleStep";
import { CaptionsStep } from "@/components/series-form/steps/CaptionsStep";
import { ScheduleStep } from "@/components/series-form/steps/ScheduleStep";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { toast } from "sonner";

const TOTAL_STEPS = 6;

export default function CreateSeriesPage() {
    const router = useRouter();
    const { user } = useUser();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<SeriesFormData>({
        niche: "scary",
        customNiche: "",
        language: "vi",
        voiceId: "",
        musicUrl: "",
        imageStyle: "cinematic",
        captionStyle: "bold",
        name: "",
        scheduleTime: "09:00",
        platforms: [],
    });

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                if (formData.niche === "custom" && !formData.customNiche?.trim()) {
                    toast.error("Vui lòng nhập chủ đề tùy chỉnh");
                    return false;
                }
                return true;
            case 2:
                if (!formData.language || !formData.voiceId) {
                    toast.error("Vui lòng chọn ngôn ngữ và giọng nói");
                    return false;
                }
                return true;
            case 3:
                if (!formData.musicUrl || !formData.musicUrl.startsWith("http")) {
                    toast.error("Vui lòng nhập URL nhạc nền hợp lệ");
                    return false;
                }
                return true;
            case 4:
                if (!formData.imageStyle) {
                    toast.error("Vui lòng chọn phong cách hình ảnh");
                    return false;
                }
                return true;
            case 5:
                if (!formData.captionStyle) {
                    toast.error("Vui lòng chọn kiểu phụ đề");
                    return false;
                }
                return true;
            case 6:
                if (!formData.name?.trim()) {
                    toast.error("Vui lòng nhập tên series");
                    return false;
                }
                if (!formData.scheduleTime) {
                    toast.error("Vui lòng chọn thời gian đăng");
                    return false;
                }
                if (formData.platforms.length === 0) {
                    toast.error("Vui lòng chọn ít nhất một nền tảng");
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/series", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to create series");
            }

            const data = await response.json();
            toast.success("Series đã được tạo thành công!");
            router.push("/dashboard");
        } catch (error) {
            console.error("Error creating series:", error);
            toast.error("Có lỗi xảy ra khi tạo series");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/dashboard")}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại Dashboard
                    </Button>
                    <h1 className="text-3xl font-bold">Tạo Series Mới</h1>
                    <p className="text-muted-foreground mt-2">
                        Hoàn thành {TOTAL_STEPS} bước để tạo series video tự động
                    </p>
                </div>

                <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

                <div className="bg-card border rounded-lg p-8 mb-6">
                    {currentStep === 1 && (
                        <NicheStep
                            niche={formData.niche}
                            customNiche={formData.customNiche}
                            onNicheChange={(niche) => setFormData({ ...formData, niche })}
                            onCustomNicheChange={(customNiche) =>
                                setFormData({ ...formData, customNiche })
                            }
                        />
                    )}

                    {currentStep === 2 && (
                        <VoiceStep
                            language={formData.language}
                            voiceId={formData.voiceId}
                            onLanguageChange={(language) =>
                                setFormData({ ...formData, language, voiceId: "" })
                            }
                            onVoiceChange={(voiceId) =>
                                setFormData({ ...formData, voiceId })
                            }
                        />
                    )}

                    {currentStep === 3 && (
                        <MusicStep
                            musicUrl={formData.musicUrl}
                            onMusicUrlChange={(musicUrl) =>
                                setFormData({ ...formData, musicUrl })
                            }
                        />
                    )}

                    {currentStep === 4 && (
                        <StyleStep
                            imageStyle={formData.imageStyle}
                            onImageStyleChange={(imageStyle) =>
                                setFormData({ ...formData, imageStyle })
                            }
                        />
                    )}

                    {currentStep === 5 && (
                        <CaptionsStep
                            captionStyle={formData.captionStyle}
                            onCaptionStyleChange={(captionStyle) =>
                                setFormData({ ...formData, captionStyle })
                            }
                        />
                    )}

                    {currentStep === 6 && (
                        <ScheduleStep
                            name={formData.name}
                            scheduleTime={formData.scheduleTime}
                            platforms={formData.platforms}
                            onNameChange={(name) => setFormData({ ...formData, name })}
                            onScheduleTimeChange={(scheduleTime) =>
                                setFormData({ ...formData, scheduleTime })
                            }
                            onPlatformsChange={(platforms) =>
                                setFormData({ ...formData, platforms })
                            }
                        />
                    )}
                </div>

                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại
                    </Button>

                    {currentStep < TOTAL_STEPS ? (
                        <Button onClick={handleNext}>
                            Tiếp theo
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-primary to-purple-600"
                        >
                            {isSubmitting ? (
                                "Đang lưu..."
                            ) : (
                                <>
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Lên lịch
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

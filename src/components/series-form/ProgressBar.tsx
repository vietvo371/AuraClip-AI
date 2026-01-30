"use client";

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full mb-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                    Bước {currentStep} / {totalSteps}
                </span>
                <span className="text-sm font-medium text-primary">
                    {Math.round(progress)}%
                </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="flex justify-between mt-4">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                    <div
                        key={step}
                        className={`flex flex-col items-center ${step === currentStep ? "opacity-100" : "opacity-40"
                            }`}
                    >
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step < currentStep
                                    ? "bg-primary text-primary-foreground"
                                    : step === currentStep
                                        ? "bg-gradient-to-r from-primary to-purple-600 text-white"
                                        : "bg-muted text-muted-foreground"
                                }`}
                        >
                            {step < currentStep ? "✓" : step}
                        </div>
                        <span className="text-xs mt-1 text-center hidden sm:block">
                            {step === 1 && "Chủ đề"}
                            {step === 2 && "Giọng nói"}
                            {step === 3 && "Nhạc nền"}
                            {step === 4 && "Phong cách"}
                            {step === 5 && "Phụ đề"}
                            {step === 6 && "Lên lịch"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

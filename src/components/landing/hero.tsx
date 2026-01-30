import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

/**
 * Render the landing hero section with animated background, headline, CTAs, and social proof.
 *
 * @returns A JSX element that renders the complete hero section for the landing page.
 */
export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 animate-gradient" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Tạo Video AI Chuyên Nghiệp
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                        Tạo Video Tuyệt Đẹp với{" "}
                        <span className="text-primary">
                            Sức Mạnh AI
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                        Biến ý tưởng của bạn thành video chuyên nghiệp chỉ trong vài phút.
                        Script AI tự động, lên lịch đăng bài, và xuất bản liền mạch—tất cả trong một nền tảng.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/dashboard">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-base md:text-lg px-8 py-6 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                            >
                                Bắt Đầu Miễn Phí
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Button
                            size="lg"
                            variant="outline"
                            className="text-base md:text-lg px-8 py-6 border-2 hover:bg-accent"
                        >
                            <Play className="mr-2 w-5 h-5" />
                            Xem Demo
                        </Button>
                    </div>

                    {/* Social Proof */}
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 border-2 border-background"
                                    />
                                ))}
                            </div>
                            <span>10.000+ nhà sáng tạo</span>
                        </div>
                        <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground/50" />
                        <span>⭐⭐⭐⭐⭐ 4.9/5 đánh giá</span>
                        <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground/50" />
                        <span>🚀 100k+ video đã tạo</span>
                    </div>
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </section>
    );
}
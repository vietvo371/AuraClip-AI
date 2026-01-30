import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Wand2,
    Calendar,
    Share2,
    BarChart3,
    Layers,
    Users,
} from "lucide-react";

const features = [
    {
        icon: Wand2,
        title: "Tạo Script AI",
        description:
            "Tạo kịch bản video hấp dẫn ngay lập tức với AI tiên tiến. Chỉ cần cung cấp chủ đề và để AI làm phần sáng tạo.",
    },
    {
        icon: Calendar,
        title: "Tự Động Lên Lịch",
        description:
            "Lên lịch video của bạn trên nhiều nền tảng tự động. Cài đặt một lần và quên đi—AI xử lý phần còn lại.",
    },
    {
        icon: Share2,
        title: "Đa Nền Tảng",
        description:
            "Đăng lên YouTube, TikTok, Instagram và nhiều hơn nữa chỉ với một cú nhấp chuột. Tối ưu hóa tự động cho từng nền tảng.",
    },
    {
        icon: BarChart3,
        title: "Bảng Phân Tích",
        description:
            "Theo dõi hiệu suất trên tất cả nền tảng ở một nơi. Nhận thông tin chi tiết từ AI để phát triển khán giả nhanh hơn.",
    },
    {
        icon: Layers,
        title: "Thư Viện Mẫu",
        description:
            "Truy cập hàng trăm mẫu được thiết kế chuyên nghiệp. Tùy chỉnh chúng để phù hợp với thương hiệu của bạn trong vài giây.",
    },
    {
        icon: Users,
        title: "Cộng Tác Nhóm",
        description:
            "Làm việc cùng nhau một cách liền mạch với nhóm của bạn. Chia sẻ dự án, phân công nhiệm vụ và tối ưu hóa quy trình làm việc.",
    },
];

/**
 * Renders the "Features" section containing a header and a responsive grid of feature cards.
 *
 * Each card displays an icon, title, and description, uses a staggered entrance animation, and
 * applies hover effects including a border/shadow change and a gradient overlay.
 *
 * @returns The React element for the features section containing the header and responsive grid of cards.
 */
export function Features() {
    return (
        <section id="features" className="py-20 md:py-32 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                        Mọi Thứ Bạn Cần Để{" "}
                        <span className="text-primary">
                            Tạo & Phát Triển
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Các tính năng mạnh mẽ được thiết kế để giúp bạn tạo video chuyên nghiệp nhanh hơn và dễ dàng hơn bao giờ hết.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={index}
                                className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <CardHeader className="relative">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl font-semibold">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="relative">
                                    <CardDescription className="text-base">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
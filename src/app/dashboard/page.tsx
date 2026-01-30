import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Layers, TrendingUp, Clock } from "lucide-react";

/**
 * Renders the dashboard page showing metric cards and a list of recent videos.
 *
 * The component builds a responsive stats grid and a "Video gần đây" section from
 * internal arrays, displaying titles, values, descriptions, icons, trends, and
 * video metadata (title, series, views, status) with corresponding visual badges.
 *
 * @returns A JSX element containing the dashboard layout with stats cards and the recent videos list.
 */
export default function DashboardPage() {
    const stats = [
        {
            title: "Tổng Series",
            value: "12",
            description: "+2 từ tháng trước",
            icon: Layers,
            trend: "+16.5%",
        },
        {
            title: "Tổng Video",
            value: "48",
            description: "+8 từ tuần trước",
            icon: Video,
            trend: "+20.1%",
        },
        {
            title: "Lượt xem",
            value: "125.4K",
            description: "+12.3K từ hôm qua",
            icon: TrendingUp,
            trend: "+10.9%",
        },
        {
            title: "Thời gian xem",
            value: "2,847h",
            description: "+124h từ tuần trước",
            icon: Clock,
            trend: "+4.5%",
        },
    ];

    const recentVideos = [
        {
            title: "Hướng dẫn tạo Video AI",
            series: "Bắt đầu",
            views: "12.5K",
            status: "Đã xuất bản",
        },
        {
            title: "Kỹ thuật chỉnh sửa nâng cao",
            series: "Mẹo chuyên nghiệp",
            views: "8.2K",
            status: "Đã xuất bản",
        },
        {
            title: "Chiến lược kiếm tiền",
            series: "Kinh doanh",
            views: "15.7K",
            status: "Đã xuất bản",
        },
        {
            title: "Lập kế hoạch lịch nội dung",
            series: "Năng suất",
            views: "Bản nháp",
            status: "Bản nháp",
        },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển</h1>
                    <p className="text-muted-foreground mt-2">
                        Chào mừng trở lại! Đây là tổng quan về hiệu suất nội dung của bạn.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {stat.description}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <span className="text-xs font-medium text-green-600">
                                            {stat.trend}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Recent Videos */}
                <Card>
                    <CardHeader>
                        <CardTitle>Video gần đây</CardTitle>
                        <CardDescription>
                            Nội dung video mới nhất và hiệu suất của bạn
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentVideos.map((video, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                                            <Video className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{video.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {video.series}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{video.views}</p>
                                            <p className="text-xs text-muted-foreground">lượt xem</p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${video.status === "Đã xuất bản"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                }`}
                                        >
                                            {video.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
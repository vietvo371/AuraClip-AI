"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Video,
    Layers,
    CreditCard,
    Settings,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const navItems = [
    {
        title: "Series",
        href: "/dashboard",
        icon: Layers,
    },
    {
        title: "Video",
        href: "/dashboard/videos",
        icon: Video,
    },
    {
        title: "Thanh toán",
        href: "/dashboard/billing",
        icon: CreditCard,
    },
    {
        title: "Cài đặt",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            <div className="flex h-full flex-col">
                {/* Logo */}
                <div className="flex h-16 items-center justify-between px-4 border-b border-border">
                    {!isCollapsed && (
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="AuraClip AI Logo"
                                width={24}
                                height={24}
                                unoptimized
                            />
                            <span className="text-lg font-bold text-foreground">
                                AuraClip AI
                            </span>
                        </Link>
                    )}
                    {isCollapsed && (
                        <Link href="/" className="mx-auto">
                            <Image
                                src="/logo.png"
                                alt="AuraClip AI Logo"
                                width={24}
                                height={24}
                                unoptimized
                            />
                        </Link>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent",
                                    isActive
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "text-muted-foreground hover:text-foreground",
                                    isCollapsed && "justify-center"
                                )}
                                title={isCollapsed ? item.title : undefined}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                {!isCollapsed && <span>{item.title}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Collapse Toggle */}
                <div className="border-t border-border p-3">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="flex w-full items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-5 h-5" />
                        ) : (
                            <>
                                <ChevronLeft className="w-5 h-5 mr-2" />
                                <span>Thu gọn</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </aside>
    );
}

"use client";

import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { DashboardHeader } from "./dashboard-header";

interface DashboardLayoutProps {
    children: ReactNode;
}

/**
 * Renders the dashboard layout with a persistent sidebar, header, and main content area.
 *
 * @param children - Content to render inside the layout's main area.
 * @returns A React element containing the dashboard chrome (sidebar and header) and the provided children.
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="pl-64">
                <DashboardHeader />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
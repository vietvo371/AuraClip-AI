import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AuraClip AI - Tạo Video AI Chuyên Nghiệp",
  description: "Tạo video chuyên nghiệp với AI trong vài phút. AI Script tự động, lên lịch đăng bài, và phân tích hiệu suất - tất cả trong một nền tảng.",
};

/**
 * Root layout component that renders the top-level HTML structure for the app.
 *
 * Renders an <html> element with Vietnamese language and hydration warning suppressed, and a <body>
 * that applies the Geist font CSS variables and `antialiased` class before rendering `children`.
 *
 * @param children - The content to render inside the document body (application pages/components).
 * @returns The root HTML and body elements containing the provided children.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
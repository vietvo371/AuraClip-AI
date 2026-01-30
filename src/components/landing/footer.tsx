import Link from "next/link";
import Image from "next/image";
import { Twitter, Github, Linkedin, Youtube } from "lucide-react";

const footerLinks = {
    product: [
        { label: "Tính năng", href: "#features" },
        { label: "Bảng giá", href: "#pricing" },
        { label: "Mẫu", href: "#templates" },
        { label: "API", href: "#api" },
    ],
    company: [
        { label: "Giới thiệu", href: "#about" },
        { label: "Blog", href: "#blog" },
        { label: "Tuyển dụng", href: "#careers" },
        { label: "Liên hệ", href: "#contact" },
    ],
    resources: [
        { label: "Tài liệu", href: "#docs" },
        { label: "Trung tâm hỗ trợ", href: "#help" },
        { label: "Cộng đồng", href: "#community" },
        { label: "Hướng dẫn", href: "#tutorials" },
    ],
    legal: [
        { label: "Bảo mật", href: "#privacy" },
        { label: "Điều khoản", href: "#terms" },
        { label: "Bảo vệ", href: "#security" },
        { label: "Cookies", href: "#cookies" },
    ],
};

const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
];

/**
 * Renders the landing-page footer with brand, social icons, navigation groups, and a bottom bar.
 *
 * The footer includes a brand block (logo, name, short description, social links), four link groups
 * ("Sản phẩm", "Công ty", "Tài nguyên", "Pháp lý") populated from data arrays, and a bottom bar with
 * the current year copyright and a short technology note.
 *
 * @returns The footer JSX element containing brand information, social icons, navigation links, and the bottom bar.
 */
export function Footer() {
    return (
        <footer className="border-t border-border bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-12">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Image
                                src="/logo.png"
                                alt="AuraClip AI Logo"
                                width={32}
                                height={32}
                                unoptimized
                            />
                            <span className="text-xl font-bold text-foreground">
                                AuraClip AI
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                            Tạo video AI tuyệt đẹp trong vài phút. Biến quy trình tạo nội dung của bạn với tự động hóa thông minh.
                        </p>
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <Link
                                        key={social.label}
                                        href={social.href}
                                        className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                                        aria-label={social.label}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Sản phẩm</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Công ty</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Tài nguyên</h3>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Pháp lý</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} AuraClip AI. Bảo lưu mọi quyền.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Được xây dựng với ❤️ bằng Next.js & AI
                    </p>
                </div>
            </div>
        </footer>
    );
}
"use client";

import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
    const footerLinks = {
        Product: [
            { name: "Features", href: "#features" },
            { name: "Pricing", href: "#pricing" },
            { name: "Documentation", href: "#" },
            { name: "API", href: "#" },
            { name: "Changelog", href: "#" }
        ],
        Company: [
            { name: "About", href: "#" },
            { name: "Blog", href: "#" },
            { name: "Careers", href: "#" },
            { name: "Contact", href: "#" }
        ],
        Legal: [
            { name: "Privacy Policy", href: "#" },
            { name: "Terms of Service", href: "#" },
            { name: "Cookie Policy", href: "#" },
            { name: "Security", href: "#" }
        ]
    };

    const socialLinks = [
        { name: "GitHub", icon: Github, href: "#" },
        { name: "Twitter", icon: Twitter, href: "#" },
        { name: "LinkedIn", icon: Linkedin, href: "#" },
        { name: "Email", icon: Mail, href: "mailto:hello@designspace.pro" }
    ];

    return (
        <footer className="relative bg-gradient-to-b from-secondary to-primary border-t border-border overflow-hidden">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4">
                {/* Main Footer Content */}
                <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="relative h-8 w-8 flex items-center justify-center">
                                <div
                                    className="absolute inset-0 rounded-md shadow ring-1"
                                    style={{
                                        background:
                                            "linear-gradient(to bottom right, var(--color-accent-light), var(--color-accent))",
                                        boxShadow: `0 0 0 1px var(--color-accent)`,
                                    }}
                                />
                                <div
                                    className="relative h-3.5 w-3.5 rotate-45 rounded-[3px] shadow-sm"
                                    style={{
                                        backgroundColor: "var(--color-background)",
                                    }}
                                />
                            </div>
                            <span className="text-xl font-bold text-text-primary">
                                DesignSpace <span className="text-accent">Pro</span>
                            </span>
                        </div>
                        <p className="text-sm text-muted max-w-sm leading-relaxed">
                            Professional CAD software that combines the power of traditional design tools with modern AI assistance. Create, collaborate, and innovate faster than ever.
                        </p>
                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        aria-label={social.name}
                                        className="p-2.5 bg-elevated hover:bg-accent/10 border border-border hover:border-accent/50 rounded-lg transition-all duration-300 group"
                                    >
                                        <Icon className="w-4 h-4 text-muted group-hover:text-accent transition-colors duration-300" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
                                {category}
                            </h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-muted hover:text-accent transition-colors duration-300 inline-flex items-center group"
                                        >
                                            <span className="group-hover:translate-x-1 transition-transform duration-300">
                                                {link.name}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted">
                        © {new Date().getFullYear()} DesignSpace Pro. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted">Built with</span>
                        <span className="text-accent">♥</span>
                        <span className="text-xs text-muted">for designers</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

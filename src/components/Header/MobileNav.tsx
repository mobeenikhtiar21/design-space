"use client";

import { useState, useRef, useEffect } from "react";
import { primaryNav } from "@/lib/NavLinks";
import { NavLink } from "./NavLink";
import { X, Menu } from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const firstFocusable = useRef<HTMLButtonElement | null>(null);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <div className="md:hidden">
            {/* Menu Button */}
            <button
                onClick={() => setIsOpen(true)}
                aria-label="Open navigation"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-text-primary hover:bg-elevated border border-border transition-all duration-200 hover:border-accent/50"
            >
                <Menu size={20} />
            </button>

            {/* Overlay & Panel */}
            <div
                className={clsx(
                    "fixed inset-0 z-50 transition-all duration-300",
                    isOpen ? "pointer-events-auto" : "pointer-events-none"
                )}
            >
                {/* Backdrop */}
                <div
                    className={clsx(
                        "absolute inset-0 bg-primary/90 backdrop-blur-md transition-opacity duration-300",
                        isOpen ? "opacity-100" : "opacity-0"
                    )}
                    onClick={() => setIsOpen(false)}
                />

                {/* Sliding Panel */}
                <div
                    ref={panelRef}
                    className={clsx(
                        "absolute top-0 right-0 bottom-0 w-[85%] max-w-sm",
                        "bg-secondary/95 backdrop-blur-xl",
                        "border-l border-border shadow-2xl",
                        "flex flex-col gap-6 p-6",
                        "transition-transform duration-500 ease-out",
                        isOpen ? "translate-x-0" : "translate-x-full"
                    )}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-semibold text-text-primary"
                            onClick={() => setIsOpen(false)}
                        >
                            <div className="relative h-7 w-7 flex items-center justify-center">
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
                                        backgroundColor: "var(--background)",
                                    }}
                                />
                            </div>
                            <span>
                                DesignSpace <span className="text-accent">Pro</span>
                            </span>
                        </Link>

                        <button
                            ref={firstFocusable}
                            onClick={() => setIsOpen(false)}
                            aria-label="Close navigation"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-elevated transition-all duration-200 hover:border-accent/50 border border-transparent"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-2">
                        {primaryNav.map((item) => (
                            <div key={item.href} onClick={() => setIsOpen(false)}>
                                <NavLink href={item.href} external={item.external}>
                                    {item.title}
                                </NavLink>
                            </div>
                        ))}
                    </nav>

                    {/* Divider */}
                    <div className="border-t border-border"></div>

                    {/* CTA Buttons */}
                    <div className="mt-auto flex flex-col gap-3 pb-4">
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="w-full text-center rounded-lg border-2 border-border text-text-primary py-3 text-sm font-semibold hover:border-accent hover:bg-accent/5 transition-all duration-200"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            onClick={() => setIsOpen(false)}
                            className="w-full text-center rounded-lg bg-accent text-background py-3 text-sm font-semibold shadow-lg shadow-accent/30 hover:bg-accent-light transition-all duration-200 hover:scale-[1.02]"
                        >
                            Get Started Free
                        </Link>

                        {/* Footer */}
                        <p className="text-xs text-muted text-center mt-4">
                            © {new Date().getFullYear()} DesignSpace Pro.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

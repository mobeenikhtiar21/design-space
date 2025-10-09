"use client";

import Link from "next/link";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import { clsx } from "clsx";

export function SiteHeader() {
    return (
        <header
            className={clsx(
                "sticky top-0 z-50 w-full bg-tertiary/80 backdrop-blur-xl"
            )}
            style={{
                borderBottom: `1px solid var(--color-border-default)`,
            }}
        >
            {/* Accent bar */}
            <div
                style={{
                    height: "0.25rem",
                    background:
                        "linear-gradient(to right, transparent, var(--color-accent), transparent)",
                    opacity: 0.6,
                }}
            />

            <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:py-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 rounded-md transition-transform hover:scale-105"
                    style={{
                        color: "var(--color-text-primary)",
                    }}
                >
                    <div className="relative h-9 w-9 flex items-center justify-center">
                        <div
                            className="absolute inset-0 rounded-lg shadow-lg group-hover:shadow-accent/50 transition-shadow duration-300"
                            style={{
                                background:
                                    "linear-gradient(135deg, var(--color-accent-light), var(--color-accent))",
                            }}
                        />
                        <div
                            className="relative h-4 w-4 rotate-45 rounded-sm shadow-sm"
                            style={{
                                backgroundColor: "var(--background)",
                            }}
                        />
                    </div>
                    <span
                        className="text-lg font-bold tracking-tight hidden sm:inline-block"
                        style={{
                            color: "var(--color-text-primary)",
                        }}
                    >
                        DesignSpace{" "}
                        <span style={{ color: "var(--color-accent)" }}>Pro</span>
                    </span>
                </Link>

                <DesktopNav />

                <div className="ml-auto flex items-center gap-2 md:gap-3">
                    {/* Auth buttons */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link
                            href="/auth/login"
                            className="text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:text-accent hover:bg-elevated"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/auth/signup"
                            className="group relative inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold shadow-lg focus:outline-none focus-visible:ring-2 transition-all hover:scale-105 overflow-hidden"
                            style={{
                                backgroundColor: "var(--color-accent)",
                                color: "var(--background)",
                                boxShadow: `0 4px 12px var(--color-accent-dark)`,
                            }}
                        >
                            {/* Button shine effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                            <span className="relative">Get Started</span>
                        </Link>
                    </div>

                    <MobileNav />
                </div>
            </div>
        </header>
    );
}

"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useTransition } from "react";
import toast from "react-hot-toast";
import { logoutAction } from "@/app/auth/_logout/actions";

type ProfileDropdownProps = {
    name: string | undefined;
    email: string | undefined;
    onAction: (action: "profile" | "settings" | "logout") => void;
};

export default function ProfileDropdown({ name = "User", email = "user@mail.com", onAction }: ProfileDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

    const handleLogout = () => {
        setIsOpen(false);
        onAction("logout");

        startTransition(async () => {
            const res = await logoutAction();

            if (res?.error) {
                toast.error(res.error);
                console.error("❌ Logout failed:", res.error);
                return;
            }

            toast.success("You’ve been logged out successfully.");
            router.push("/auth/login");
        });
    };

    return (
        <div ref={dropdownRef} className="relative">
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2"
                style={{
                    backgroundColor: "var(--color-accent)",
                    color: "var(--background)",
                }}
            >
                {name.slice(0, 2).toUpperCase()}
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-56 rounded-lg shadow-2xl overflow-hidden z-50"
                    style={{
                        backgroundColor: "var(--color-elevated)",
                        border: "1px solid var(--color-border-default)",
                    }}
                >
                    <div className="px-4 py-3 border-b" style={{ borderColor: "var(--color-border-default)" }}>
                        <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                            {name}
                        </p>
                        <p className="text-xs opacity-70 truncate" style={{ color: "var(--color-text-tertiary)" }}>
                            {email}
                        </p>
                    </div>

                    <div className="py-1">
                        <button
                            onClick={() => {
                                onAction("profile");
                                router.push("/account/settings");
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-accent/10"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            Profile / Settings
                        </button>

                        <button
                            onClick={handleLogout}
                            disabled={isPending}
                            className={`w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 ${isPending ? "opacity-60 cursor-wait" : ""
                                }`}
                        >
                            {isPending ? "Logging out..." : "Logout"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}


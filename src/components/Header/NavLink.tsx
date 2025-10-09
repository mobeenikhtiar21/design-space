"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

interface Props {
    href: string;
    children: React.ReactNode;
    onClick?(): void;
    external?: boolean;
}

export function NavLink({ href, children, onClick, external }: Props) {
    const pathname = usePathname();
    const isActive =
        href === "/"
            ? pathname === "/"
            : pathname.startsWith(href) && href !== "/";

    const base =
        "relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500/70 dark:focus-visible:ring-indigo-400/70 focus-visible:ring-offset-transparent";

    return (
        <Link
            href={href}
            onClick={onClick}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className={clsx(
                base,
                "text-slate-600 dark:text-slate-300",
                "hover:text-slate-900 dark:hover:text-white",
                isActive && [
                    "text-slate-900 dark:text-white",
                    "before:absolute before:inset-0 before:rounded-md before:bg-indigo-500/10 dark:before:bg-indigo-400/10",
                    "after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-px after:h-px after:w-10 after:bg-gradient-to-r after:from-indigo-500/0 after:via-indigo-500 after:to-indigo-500/0",
                ]
            )}
            aria-current={isActive ? "page" : undefined}
        >
            {children}
        </Link>
    );
}

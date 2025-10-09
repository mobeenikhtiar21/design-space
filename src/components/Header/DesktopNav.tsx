"use client";

import { primaryNav } from "@/lib/NavLinks";
import { NavLink } from "./NavLink";

export function DesktopNav() {
    return (
        <nav className="hidden md:flex items-center gap-2">
            {primaryNav.map((item) => (
                <NavLink key={item.href} href={item.href} external={item.external}>
                    {item.title}
                </NavLink>
            ))}
        </nav>
    );
}

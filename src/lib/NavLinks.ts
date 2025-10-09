export interface NavItem {
    title: string;
    href: string;
    external?: boolean;
}

export const primaryNav: NavItem[] = [
    { title: "Features", href: "/features" },
    { title: "Pricing", href: "/pricing" },
    { title: "Contact Us", href: "/contact" },
];

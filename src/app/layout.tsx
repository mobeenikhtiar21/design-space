import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "DesignSpace Pro",
    description: "Design collaboration platform",
};

export default function RootLayout({
    children,
}: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${inter.variable} font-sans antialiased bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100`}>
                <Toaster
                    position="top-center"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: 'var(--color-elevated)',
                            color: 'var(--color-text-primary)',
                            border: '1px solid var(--color-border)',
                        },
                        success: {
                            iconTheme: {
                                primary: 'var(--color-accent)',
                                secondary: 'var(--color-text-primary)',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: 'var(--color-error)',
                                secondary: 'var(--color-text-primary)',
                            },
                        },
                    }}
                />
                {children}
            </body>
        </html>
    );
}

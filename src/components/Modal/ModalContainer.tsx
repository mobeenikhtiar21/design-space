"use client";

import { useEffect, useRef } from "react";
import { clsx } from "clsx";

interface ModalContainerProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function ModalContainer({
    open,
    onClose,
    children,
    maxWidth = "md",
}: ModalContainerProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (open) {
            previousActiveElement.current = document.activeElement as HTMLElement;
            modalRef.current?.focus();
        } else {
            previousActiveElement.current?.focus();
        }
    }, [open]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && open) {
                onClose();
            }
        };

        if (open) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    // Focus trap logic
    useEffect(() => {
        if (!open || !modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
            focusableElements.length - 1
        ] as HTMLElement;

        const handleTab = (event: KeyboardEvent) => {
            if (event.key !== "Tab") return;

            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement?.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        modalRef.current.addEventListener("keydown", handleTab);
        return () => {
            modalRef.current?.removeEventListener("keydown", handleTab);
        };
    }, [open]);

    if (!open) return null;

    const maxWidthClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 backdrop-blur-sm"
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                }}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                className={clsx(
                    "relative w-full rounded-xl shadow-2xl bg-tertiary",
                    maxWidthClasses[maxWidth],
                    "animate-in fade-in zoom-in-95 duration-200"
                )}
                style={{
                    border: "1px solid var(--color-border-default)",
                }}
            >
                {/* Accent bar */}
                <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                    style={{
                        background:
                            "linear-gradient(to right, transparent, var(--color-accent), transparent)",
                        opacity: 0.6,
                    }}
                />

                {/* Content */}
                <div className="p-6 pt-8">{children}</div>
            </div>
        </div>
    );
}

import { useRef, useEffect } from "react";
import { clsx } from "clsx";

type MenuItem = {
    label?: string;
    action?: string;
    shortcut?: string;
    type?: "separator";
    danger?: boolean;
};

type MenuDropdownProps = {
    label: string;
    items: MenuItem[];
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
    onAction: (action: string) => void;
};

export default function MenuDropdown({
    label,
    items,
    isOpen,
    onToggle,
    onClose,
    onAction,
}: MenuDropdownProps) {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen, onClose]);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={onToggle}
                className={clsx(
                    "px-3 py-1.5 text-sm font-medium rounded transition-colors",
                    isOpen ? "bg-elevated" : "hover:bg-elevated/60"
                )}
                style={{ color: "var(--color-text-primary)" }}
            >
                {label}
            </button>

            {isOpen && (
                <div
                    className="absolute left-0 mt-1 min-w-[200px] rounded-lg shadow-2xl overflow-hidden"
                    style={{
                        backgroundColor: "var(--color-elevated)",
                        border: "1px solid var(--color-border-default)",
                        zIndex: 100
                    }}
                >
                    {items.map((item, index) => {
                        if (item.type === "separator") {
                            return (
                                <div
                                    key={`separator-${index}`}
                                    className="my-1"
                                    style={{
                                        height: "1px",
                                        backgroundColor: "var(--color-border-default)",
                                    }}
                                />
                            );
                        }

                        return (
                            <button
                                key={item.action}
                                onClick={() => {
                                    if (item.action) onAction(item.action);
                                    onClose();
                                }}
                                className={clsx(
                                    "w-full px-4 py-2 text-left text-sm transition-colors flex items-center justify-between gap-4",
                                    item.danger ? "hover:bg-red-500/10 text-red-400" : "hover:bg-accent/10"
                                )}
                                style={{
                                    color: item.danger ? undefined : "var(--color-text-primary)",
                                }}
                            >
                                <span>{item.label}</span>
                                {item.shortcut && (
                                    <span
                                        className="text-xs font-mono opacity-60"
                                        style={{ color: "var(--color-text-tertiary)" }}
                                    >
                                        {item.shortcut}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}


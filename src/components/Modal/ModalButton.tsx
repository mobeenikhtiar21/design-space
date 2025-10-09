import clsx from "clsx";

interface ModalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger";
    children: React.ReactNode;
}

export function ModalButton({
    variant = "secondary",
    children,
    className,
    ...props
}: ModalButtonProps) {
    const variantStyles = {
        primary: {
            backgroundColor: "var(--color-accent)",
            color: "var(--background)",
        },
        secondary: {
            backgroundColor: "var(--color-elevated)",
            color: "var(--color-text-primary)",
        },
        danger: {
            backgroundColor: "rgb(239 68 68)",
            color: "white",
        },
    };

    return (
        <button
            className={clsx(
                "px-6 py-2.5 rounded-lg font-semibold text-sm transition-all",
                "hover:scale-105 hover:shadow-lg",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                className
            )}
            style={variantStyles[variant]}
            {...props}
        >
            {children}
        </button>
    );
}

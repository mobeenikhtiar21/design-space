import clsx from "clsx";

interface ModalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string;
}

export function ModalInput({
    label,
    helperText,
    className,
    ...props
}: ModalInputProps) {
    return (
        <div className="mb-4">
            {label && (
                <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-text-secondary)" }}
                >
                    {label}
                </label>
            )}
            <input
                className={clsx(
                    "w-full px-4 py-3 rounded-lg text-base",
                    "border transition-colors duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-accent/50",
                    "placeholder:text-sm",
                    className
                )}
                style={{
                    backgroundColor: "var(--color-primary)",
                    borderColor: "var(--color-border-default)",
                    color: "var(--color-text-primary)",
                }}
                {...props}
            />
            {helperText && (
                <p
                    className="mt-2 text-xs"
                    style={{ color: "var(--color-text-tertiary)" }}
                >
                    {helperText}
                </p>
            )}
        </div>
    );
}

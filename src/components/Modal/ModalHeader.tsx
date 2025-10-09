interface ModalHeaderProps {
    children: React.ReactNode;
    onClose?: () => void;
}

export function ModalHeader({ children, onClose }: ModalHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <h2
                className="text-2xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
            >
                {children}
            </h2>
            {onClose && (
                <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-elevated transition-colors"
                    style={{ color: "var(--color-text-tertiary)" }}
                    aria-label="Close modal"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
}

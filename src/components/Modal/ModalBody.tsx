interface ModalBodyProps {
    children: React.ReactNode;
}

export function ModalBody({ children }: ModalBodyProps) {
    return (
        <div className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
            {children}
        </div>
    );
}

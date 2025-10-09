import clsx from "clsx";

interface ModalActionsProps {
    children: React.ReactNode;
    align?: "left" | "right" | "center";
}

export function ModalActions({ children, align = "right" }: ModalActionsProps) {
    const alignClasses = {
        left: "justify-start",
        right: "justify-end",
        center: "justify-center",
    };

    return (
        <div className={clsx("flex items-center gap-3", alignClasses[align])}>
            {children}
        </div>
    );
}

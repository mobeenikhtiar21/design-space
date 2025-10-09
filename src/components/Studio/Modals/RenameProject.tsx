"use client";

import {
    ModalContainer,
    ModalHeader,
    ModalBody,
    ModalActions,
    ModalButton,
    ModalInput,
} from "@/components/Modal";
import { useState } from "react";

type RenameProjectProps = {
    open: boolean;
    onClose: () => void;
    currentName: string;
    onRename: (newName: string) => void;
};

export function RenameProject({
    open,
    onClose,
    currentName,
    onRename,
}: RenameProjectProps) {
    const [newName, setNewName] = useState(currentName);
    const [error, setError] = useState("");

    const handleRename = () => {
        if (!newName.trim()) {
            setError("Project name cannot be empty.");
            return;
        }
        if (newName === currentName) {
            setError("Please choose a different name.");
            return;
        }
        onRename(newName.trim());
        onClose();
    };

    return (
        <ModalContainer open={open} onClose={onClose} maxWidth="sm">
            <ModalHeader onClose={onClose}>Rename Project</ModalHeader>

            <ModalBody>
                <p
                    className="text-sm mb-4"
                    style={{ color: "var(--color-text-secondary)" }}
                >
                    Enter a new name for your project:
                </p>

                <ModalInput
                    label="Project Name"
                    value={newName}
                    onChange={(e) => {
                        setNewName(e.target.value);
                        setError("");
                    }}
                    placeholder="Enter new project name"
                />

                {error && (
                    <p
                        className="mt-1 text-sm"
                        style={{ color: "rgb(239 68 68)" }}
                    >
                        {error}
                    </p>
                )}
            </ModalBody>

            <ModalActions>
                <ModalButton variant="secondary" onClick={onClose}>
                    Cancel
                </ModalButton>
                <ModalButton variant="primary" onClick={handleRename}>
                    Rename
                </ModalButton>
            </ModalActions>
        </ModalContainer>
    );
}

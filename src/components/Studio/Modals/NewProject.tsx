"use client";

import { useState } from "react";
import {
    ModalContainer,
    ModalHeader,
    ModalBody,
    ModalActions,
    ModalButton,
    ModalInput,
} from "@/components/Modal";

interface NewProjectProps {
    open: boolean;
    onClose: () => void;
    onCreate: (name: string) => void;
}

export function NewProject({
    open,
    onClose,
    onCreate,
}: NewProjectProps) {
    const [projectName, setProjectName] = useState("");

    const handleCreate = () => {
        if (projectName.trim()) {
            onCreate(projectName.trim());
            setProjectName("");
            onClose();
        }
    };

    return (
        <ModalContainer open={open} onClose={onClose} maxWidth="sm">
            <ModalHeader onClose={onClose}>Create New Project</ModalHeader>
            <ModalBody>
                <ModalInput
                    label="Project Name"
                    placeholder="Enter project name..."
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    autoFocus
                />
            </ModalBody>
            <ModalActions align="right">
                <ModalButton variant="secondary" onClick={onClose}>
                    Cancel
                </ModalButton>
                <ModalButton
                    variant="primary"
                    onClick={handleCreate}
                    disabled={!projectName.trim()}
                >
                    Create
                </ModalButton>
            </ModalActions>
        </ModalContainer>
    );
}

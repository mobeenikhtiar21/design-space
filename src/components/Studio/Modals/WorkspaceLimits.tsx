"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
    ModalContainer,
    ModalHeader,
    ModalBody,
    ModalActions,
    ModalButton,
    ModalInput,
} from "@/components/Modal";

interface WorkspaceProps {
    open: boolean;
    onClose: () => void;
    mode: "create" | "edit"; // determines modal text
    currentValues?: { width: number; height: number };
    onSave: (values: { width: number; height: number }) => void;
    workspaceExists?: boolean;
}

export function WorkspaceModal({
    open,
    onClose,
    mode,
    currentValues,
    onSave,
    workspaceExists,
}: WorkspaceProps) {
    const [width, setWidth] = useState(currentValues?.width || 1000);
    const [height, setHeight] = useState(currentValues?.height || 1000);

    // Prevent opening multiple workspaces
    useEffect(() => {
        if (open && mode === "create" && workspaceExists) {
            toast.error("Only one workspace can be active at a time.");
            onClose();
        }
    }, [open, mode, workspaceExists, onClose]);

    const handleSave = () => {
        if (width <= 0 || height <= 0) {
            toast.error("Dimensions must be positive values.");
            return;
        }
        onSave({ width, height });
        toast.success(
            mode === "create"
                ? "New workspace created!"
                : "Workspace limits updated."
        );
        onClose();
    };

    return (
        <ModalContainer open={open} onClose={onClose} maxWidth="sm">
            <ModalHeader onClose={onClose}>
                {mode === "create" ? "New Workspace" : "Edit Workspace Limits"}
            </ModalHeader>

            <ModalBody>
                <ModalInput
                    label="Width (mm)"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                />
                <ModalInput
                    label="Height (mm)"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                />
            </ModalBody>

            <ModalActions>
                <ModalButton variant="secondary" onClick={onClose}>
                    Cancel
                </ModalButton>
                <ModalButton variant="primary" onClick={handleSave}>
                    {mode === "create" ? "Create" : "Save"}
                </ModalButton>
            </ModalActions>
        </ModalContainer>
    );
}


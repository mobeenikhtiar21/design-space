"use client";

import {
    ModalContainer,
    ModalHeader,
    ModalBody,
    ModalActions,
    ModalButton,
} from "@/components/Modal";

type ResetProjectProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export function ResetProject({
    open,
    onClose,
    onConfirm,
}: ResetProjectProps) {
    return (
        <ModalContainer open={open} onClose={onClose} maxWidth="sm">
            <ModalHeader onClose={onClose}>Reset Project</ModalHeader>
            <ModalBody>
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    Are you sure you want to reset this project?
                    <br />
                    This will revert all unsaved changes to their original state.
                </p>
            </ModalBody>
            <ModalActions>
                <ModalButton variant="secondary" onClick={onClose}>
                    Cancel
                </ModalButton>
                <ModalButton variant="danger" onClick={onConfirm}>
                    Reset Project
                </ModalButton>
            </ModalActions>
        </ModalContainer>
    );
}


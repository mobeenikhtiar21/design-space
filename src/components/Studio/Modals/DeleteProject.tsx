"use client";

import {
    ModalContainer,
    ModalHeader,
    ModalBody,
    ModalActions,
    ModalButton,
} from "@/components/Modal";

type DeleteProjectProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export function DeleteProject({
    open,
    onClose,
    onConfirm,
}: DeleteProjectProps) {
    return (
        <ModalContainer open={open} onClose={onClose} maxWidth="sm">
            <ModalHeader onClose={onClose}>Delete Project</ModalHeader>
            <ModalBody>
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    This action will permanently delete your project and its data.
                    <br />
                    <strong style={{ color: "var(--color-accent)" }}>
                        This cannot be undone.
                    </strong>
                </p>
            </ModalBody>
            <ModalActions>
                <ModalButton variant="secondary" onClick={onClose}>
                    Cancel
                </ModalButton>
                <ModalButton variant="danger" onClick={onConfirm}>
                    Delete Project
                </ModalButton>
            </ModalActions>
        </ModalContainer>
    );
}

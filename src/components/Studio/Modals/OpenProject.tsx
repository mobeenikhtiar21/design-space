"use client";

import {
    ModalContainer,
    ModalHeader,
    ModalBody,
    ModalActions,
    ModalButton,
} from "@/components/Modal";
import { useState } from "react";

// Define the type for a project
type Project = {
    id: string;
    name: string;
    createdAt: string;
};

interface OpenProjectProps {
    open: boolean;
    onClose: () => void;
    onOpen: (projectId: string) => void;
}

export function OpenProject({ open, onClose, onOpen }: OpenProjectProps) {
    // Dummy projects for now
    const [projects] = useState<Project[]>([
        { id: "1", name: "Landing Page Design", createdAt: "2025-09-12" },
        { id: "2", name: "Brand Identity Concept", createdAt: "2025-09-24" },
        { id: "3", name: "3D Product Mockup", createdAt: "2025-10-01" },
        { id: "4", name: "Portfolio Redesign", createdAt: "2025-10-06" },
    ]);

    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    return (
        <ModalContainer open={open} onClose={onClose} maxWidth="md">
            <ModalHeader onClose={onClose}>Open Project</ModalHeader>

            <ModalBody>
                <div className="space-y-2">
                    {projects.map((project) => (
                        <button
                            key={project.id}
                            onClick={() => setSelectedProject(project.id)}
                            className={`w-full flex justify-between items-center px-4 py-3 rounded-lg border transition-all ${selectedProject === project.id
                                ? "border-accent bg-accent/10"
                                : "border-transparent hover:bg-elevated/60"
                                }`}
                            style={{
                                color: "var(--color-text-primary)",
                                borderColor:
                                    selectedProject === project.id
                                        ? "var(--color-accent)"
                                        : "var(--color-border-default)",
                            }}
                        >
                            <div className="flex flex-col items-start text-left">
                                <span className="font-medium text-base">
                                    {project.name}
                                </span>
                                <span
                                    className="text-xs opacity-70"
                                    style={{
                                        color: "var(--color-text-tertiary)",
                                    }}
                                >
                                    Created on {project.createdAt}
                                </span>
                            </div>
                            {selectedProject === project.id && (
                                <span
                                    className="text-sm font-semibold"
                                    style={{
                                        color: "var(--color-accent)",
                                    }}
                                >
                                    Selected
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </ModalBody>

            <ModalActions align="right">
                <ModalButton variant="secondary" onClick={onClose}>
                    Cancel
                </ModalButton>
                <ModalButton
                    variant="primary"
                    disabled={!selectedProject}
                    onClick={() => {
                        if (selectedProject) {
                            onOpen(selectedProject);
                            onClose();
                        }
                    }}
                >
                    Open
                </ModalButton>
            </ModalActions>
        </ModalContainer>
    );
}

"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Grid } from "lucide-react";
import { WorkspaceModal } from "@/components/Studio/Modals";

export default function Toolbar() {
    const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
    const [workspaceExists, setWorkspaceExists] = useState(false);
    const [workspaceSize, setWorkspaceSize] = useState<{ width: number; height: number } | null>(null);
    const [gridSize, setGridSize] = useState(200);
    const [zoom, setZoom] = useState(100);
    const [gridEnabled, setGridEnabled] = useState(true);

    const handleWorkspaceSave = (values: { width: number; height: number }) => {
        setWorkspaceSize(values);
        setWorkspaceExists(true);
        setShowWorkspaceModal(false);
    };

    return (
        <>
            <div className="w-full bg-primary/95 backdrop-blur-sm border-b border-[var(--color-border-default)]">
                <div className="flex items-center justify-between px-4 py-2">
                    {/* Left Section */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowWorkspaceModal(true)}
                            className={clsx(
                                "flex items-center gap-1 px-3 py-1.5 rounded-md",
                                "hover:bg-elevated focus:outline-none focus-visible:ring-2"
                            )}
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            <Grid className="w-4 h-4" />
                            <span className="text-sm whitespace-nowrap">
                                {workspaceExists ? "Edit Workspace" : "Set Workspace"}
                            </span>
                        </button>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">

                        {/* Grid Control */}
                        <div className="flex items-center gap-1">
                            <label className="text-sm text-[var(--color-text-secondary)]">
                                Grid:
                            </label>
                            <input
                                type="number"
                                value={gridSize}
                                onChange={(e) => setGridSize(parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 text-sm text-center border rounded-md"
                                style={{
                                    borderColor: "var(--color-border-default)",
                                    background: "var(--background)",
                                    color: "var(--color-text-primary)",
                                }}
                            />
                        </div>

                        {/* Grid Toggle Button */}
                        <button
                            onClick={() => setGridEnabled(!gridEnabled)}
                            className={clsx(
                                "flex items-center justify-center p-1.5 rounded-md border transition-colors",
                                gridEnabled
                                    ? "text-accent border-accent hover:bg-accent/10"
                                    : "text-[var(--color-text-secondary)] border-[var(--color-border-default)] hover:bg-elevated"
                            )}
                        >
                            <Grid className="w-4 h-4" />
                        </button>

                        {/* Divider */}
                        <div className="h-4 w-px bg-[var(--color-border-default)] mx-1" />

                        {/* Zoom Control */}
                        <div className="flex items-center gap-1">
                            <label className="text-sm text-[var(--color-text-secondary)]">
                                Zoom:
                            </label>
                            <select
                                value={zoom}
                                onChange={(e) => setZoom(parseInt(e.target.value))}
                                className="px-2 py-1 text-sm border rounded-md"
                                style={{
                                    borderColor: "var(--color-border-default)",
                                    background: "var(--background)",
                                    color: "var(--color-text-primary)",
                                }}
                            >
                                {[25, 50, 75, 100, 150, 200].map((z) => (
                                    <option key={z} value={z}>
                                        {z}%
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Workspace Modal */}
            <WorkspaceModal
                open={showWorkspaceModal}
                onClose={() => setShowWorkspaceModal(false)}
                mode={workspaceExists ? "edit" : "create"}
                currentValues={workspaceSize ?? undefined}
                onSave={handleWorkspaceSave}
                workspaceExists={workspaceExists}
            />
        </>
    );
}


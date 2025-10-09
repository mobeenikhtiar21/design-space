"use client";

import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import ProfileDropdown from "./ProfileDropdown";
import MenuDropdown from "./MenuDropdown";
import {
    NewProject,
    OpenProject,
    ResetProject,
    DeleteProject,
    RenameProject,
} from "@/components/Studio/Modals";
import Link from "next/link";
import toast from "react-hot-toast";

type MenuItem = {
    label?: string;
    action?: string;
    shortcut?: string;
    type?: "separator";
    danger?: boolean;
};

const menuItems: Record<string, MenuItem[]> = {
    File: [
        { label: "New Project", action: "new" },
        { label: "Open Project", action: "open" },
        { label: "Save Project", action: "save", shortcut: "⌘S" },
        { type: "separator" },
        { label: "Reset Project", action: "reset", danger: true },
        { label: "Delete Project", action: "delete", danger: true },
    ],
    Edit: [
        { label: "Rename Project", action: "rename", shortcut: "⌘R" },
        { label: "Undo", action: "undo", shortcut: "⌘Z" },
        { label: "Redo", action: "redo", shortcut: "⌘⇧Z" },
    ],
    View: [
        { label: "Fit to View", action: "fit" },
        { label: "Zoom In", action: "zoom-in", shortcut: "⌘+" },
        { label: "Zoom Out", action: "zoom-out", shortcut: "⌘-" },
        { label: "Reset Zoom", action: "reset-zoom", shortcut: "⌘0" },
    ],
    Export: [
        { label: "Export DXF", action: "export-dxf" },
        { label: "Export PNG", action: "export-png" },
        { label: "Export SVG", action: "export-svg" },
    ],
};

type SaveState = "unsaved" | "saving" | "saved";

type MenuBarProps = {
    projectName?: string;
    onAction?: (action: string) => void;
};

export function MenuBar({ onAction }: MenuBarProps) {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [saveState, setSaveState] = useState<SaveState>("saved");
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [showOpenProjectModal, setShowOpenProjectModal] = useState(false);
    const [showResetProject, setShowResetProject] = useState(false);
    const [showDeleteProject, setShowDeleteProject] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [projectName, setProjectName] = useState("Untitled Project");
    const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (error) {
                console.error("Error fetching user:", error.message);
                return;
            }

            if (!user) {
                toast.error('no user found')
                return
            }

            setUser({
                name: user.user_metadata.first_name || user.email?.split('@')[0],
                email: user.email,
            });
        };

        fetchUser();
    }, []);



    // Toggle menu
    const handleMenuToggle = (menuLabel: string) => {
        setOpenMenu(openMenu === menuLabel ? null : menuLabel);
    };

    // Simulate save (manual + auto)
    const simulateSaving = () => {
        if (saveState === "saving") return;
        setSaveState("saving");
        setTimeout(() => setSaveState("saved"), 1000);
    };

    // 🔁 Auto-save every 2 minutes if unsaved
    useEffect(() => {
        const interval = setInterval(() => {
            if (saveState === "unsaved") {
                simulateSaving();
                console.log("💾 Auto-saved project at", new Date().toLocaleTimeString());
            }
        }, 120000); // 2 minutes

        return () => clearInterval(interval);
    }, [saveState]);

    // Handle menu actions
    const handleAction = (action: string) => {
        onAction?.(action);

        if (["rename", "reset", "delete", "new", "open"].includes(action)) {
            setSaveState("unsaved");
        }

        if (action === "save") simulateSaving();
        if (action === "new") setShowNewProjectModal(true);
        if (action === "open") setShowOpenProjectModal(true);
        if (action === "reset") setShowResetProject(true);
        if (action === "delete") setShowDeleteProject(true);
        if (action === "rename") setShowRenameModal(true);
    };

    // Handlers for modals
    const handleRenameProject = (newName: string) => {
        console.log("✏️ Project renamed to:", newName);
        setProjectName(newName);
        setSaveState("unsaved");
    };

    const handleOpenProject = (id: string) => {
        console.log("📂 Opened project:", id);
        setSaveState("saved");
    };

    const handleCreateProject = (name: string) => {
        console.log("✅ Created new project:", name);
        setSaveState("unsaved");
    };

    // Compact save state indicator
    const saveIcon =
        saveState === "saving" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-yellow-400" />
        ) : saveState === "saved" ? (
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
            <AlertCircle className="h-3.5 w-3.5 text-gray-400" />
        );

    const saveLabel =
        saveState === "saving"
            ? "Saving..."
            : saveState === "saved"
                ? "Saved"
                : "Unsaved";

    return (
        <>
            <header
                className={clsx("w-full bg-tertiary/95 border-b")}
                style={{
                    borderColor: "var(--color-border-default)",
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        height: "0.25rem",
                        background:
                            "linear-gradient(to right, transparent, var(--color-accent), transparent)",
                        opacity: 0.6,
                    }}
                />

                <div className="flex items-center justify-between px-4 py-2">
                    {/* Left: App Name + Menus */}
                    <div className="flex items-center gap-1">
                        <div
                            className="flex items-center gap-2 mr-4 pr-4 border-r"
                            style={{
                                borderColor: "var(--color-border-default)",
                            }}
                        >
                            <div className="relative h-7 w-7 flex items-center justify-center">
                                <div
                                    className="absolute inset-0 rounded-lg shadow-md"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, var(--color-accent-light), var(--color-accent))",
                                    }}
                                />
                                <div
                                    className="relative h-3 w-3 rotate-45 rounded-sm"
                                    style={{
                                        backgroundColor: "var(--background)",
                                    }}
                                />
                            </div>
                            <Link href="/">
                                <span
                                    className="text-base font-bold tracking-tight"
                                    style={{ color: "var(--color-text-primary)" }}
                                >
                                    DesignSpace
                                    <span style={{ color: "var(--color-accent)" }}>
                                        Pro
                                    </span>
                                </span>
                            </Link>
                        </div>

                        {Object.entries(menuItems).map(([label, items]) => (
                            <MenuDropdown
                                key={label}
                                label={label}
                                items={items}
                                isOpen={openMenu === label}
                                onToggle={() => handleMenuToggle(label)}
                                onClose={() => setOpenMenu(null)}
                                onAction={handleAction}
                            />
                        ))}
                    </div>

                    {/* Center: Project Name */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                        <span
                            className="text-sm font-medium"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            {projectName}
                        </span>
                    </div>

                    {/* Right: Save Status + Profile */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-xs font-medium">
                            {saveIcon}
                            <span
                                style={{
                                    color:
                                        saveState === "saved"
                                            ? "var(--color-accent)"
                                            : "var(--color-text-tertiary)",
                                }}
                            >
                                {saveLabel}
                            </span>
                        </div>

                        <ProfileDropdown
                            name={user?.name}
                            email={user?.email}
                            onAction={(action) => {
                                if (action === "logout") {
                                    console.log("Logging out...");
                                } else if (action === "profile") {
                                    console.log("Opening profile/settings...");
                                }
                            }}
                        />
                    </div>
                </div>
            </header>

            {/* Modals */}
            <NewProject
                open={showNewProjectModal}
                onClose={() => setShowNewProjectModal(false)}
                onCreate={handleCreateProject}
            />

            <OpenProject
                open={showOpenProjectModal}
                onClose={() => setShowOpenProjectModal(false)}
                onOpen={handleOpenProject}
            />

            <ResetProject
                open={showResetProject}
                onClose={() => setShowResetProject(false)}
                onConfirm={() => {
                    console.log("Project reset");
                    setShowResetProject(false);
                    setSaveState("unsaved");
                }}
            />

            <DeleteProject
                open={showDeleteProject}
                onClose={() => setShowDeleteProject(false)}
                onConfirm={() => {
                    console.log("Project deleted");
                    setShowDeleteProject(false);
                    setSaveState("unsaved");
                }}
            />

            <RenameProject
                open={showRenameModal}
                onClose={() => setShowRenameModal(false)}
                currentName={projectName}
                onRename={handleRenameProject}
            />
        </>
    );
}


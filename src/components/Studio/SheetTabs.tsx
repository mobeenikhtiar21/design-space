"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Plus, X, Copy } from "lucide-react";

export default function SheetTabs() {
    const [sheets, setSheets] = useState([
        { id: "sheet-1", name: "Sheet 1", isActive: true },
    ]);
    const [editingSheetId, setEditingSheetId] = useState<string | null>(null);
    const [tempName, setTempName] = useState("");

    const handleSheetClick = (sheetId: string) => {
        setSheets((prev) =>
            prev.map((sheet) => ({
                ...sheet,
                isActive: sheet.id === sheetId,
            }))
        );
    };

    const handleAddSheet = () => {
        const newSheet = {
            id: `sheet-${Date.now()}`,
            name: `Sheet ${sheets.length + 1}`,
            isActive: false,
        };
        setSheets((prev) => [...prev, newSheet]);
    };

    const handleDeleteSheet = (e: React.MouseEvent, sheetId: string) => {
        e.stopPropagation();
        if (sheets.length <= 1) return;
        setSheets((prev) => {
            const filtered = prev.filter((s) => s.id !== sheetId);
            if (prev.find((s) => s.id === sheetId)?.isActive && filtered.length > 0) {
                filtered[0].isActive = true;
            }
            return filtered;
        });
    };

    const handleDuplicateSheet = (e: React.MouseEvent, sheetId: string) => {
        e.stopPropagation();
        const sheet = sheets.find((s) => s.id === sheetId);
        if (!sheet) return;

        const baseName = sheet.name.replace(/\s\(\d+\)$/, "");
        const copies = sheets.filter((s) => s.name.startsWith(baseName + " (")).length;
        const newName = `${baseName} (${copies + 2})`;

        const newSheet = {
            id: `sheet-${Date.now()}`,
            name: newName,
            isActive: false,
        };
        setSheets((prev) => [...prev, newSheet]);
    };

    const startEditing = (e: React.MouseEvent, sheet: { id: string; name: string }) => {
        e.stopPropagation();
        setEditingSheetId(sheet.id);
        setTempName(sheet.name);
    };

    const finishEditing = () => {
        if (editingSheetId && tempName.trim()) {
            setSheets((prev) =>
                prev.map((sheet) =>
                    sheet.id === editingSheetId
                        ? { ...sheet, name: tempName.trim() }
                        : sheet
                )
            );
        }
        setEditingSheetId(null);
        setTempName("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") finishEditing();
        else if (e.key === "Escape") setEditingSheetId(null);
    };

    return (
        <div
            className="w-full flex items-center gap-2 px-3 py-1"
            style={{
                backgroundColor: "var(--color-secondary)",
                borderTop: "1px solid var(--color-border-default)",
            }}
        >
            <div className="flex items-center gap-1 flex-1 overflow-x-auto">
                {sheets.map((sheet) => (
                    <div
                        key={sheet.id}
                        onClick={() => handleSheetClick(sheet.id)}
                        className={clsx(
                            "group relative flex items-center gap-1 px-3 py-1 rounded-md text-xs cursor-pointer transition-all duration-150 min-w-[90px] max-w-[140px]",
                            sheet.isActive
                                ? "bg-elevated"
                                : "hover:bg-elevated/50"
                        )}
                        style={{
                            borderBottom: sheet.isActive
                                ? "2px solid var(--color-accent)"
                                : "2px solid transparent",
                        }}
                    >
                        {editingSheetId === sheet.id ? (
                            <input
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onBlur={finishEditing}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                className="flex-1 bg-transparent text-xs outline-none"
                                style={{
                                    color: "var(--color-text-primary)",
                                }}
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <span
                                className="flex-1 truncate text-xs font-medium"
                                style={{
                                    color: sheet.isActive
                                        ? "var(--color-text-primary)"
                                        : "var(--color-text-secondary)",
                                }}
                                onDoubleClick={(e) => startEditing(e, sheet)}
                            >
                                {sheet.name}
                            </span>
                        )}

                        {/* Duplicate */}
                        <button
                            onClick={(e) => handleDuplicateSheet(e, sheet.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-primary/20 transition-opacity"
                            style={{ color: "var(--color-text-tertiary)" }}
                            aria-label="Duplicate Sheet"
                        >
                            <Copy className="w-3 h-3" />
                        </button>

                        {/* Delete */}
                        {sheets.length > 1 && (
                            <button
                                onClick={(e) => handleDeleteSheet(e, sheet.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-opacity"
                                style={{ color: "var(--color-text-tertiary)" }}
                                aria-label="Delete Sheet"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                ))}

                {/* Add */}
                <button
                    onClick={handleAddSheet}
                    className="flex items-center justify-center p-1.5 rounded-md hover:scale-105 transition-all"
                    style={{
                        backgroundColor: "var(--color-accent)",
                        color: "var(--background)",
                    }}
                    aria-label="Add Sheet"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            <div
                className="hidden md:flex items-center gap-1 px-2 py-1 text-xs rounded-md"
                style={{
                    backgroundColor: "var(--color-elevated)",
                    color: "var(--color-text-tertiary)",
                }}
            >
                {sheets.length} {sheets.length === 1 ? "Sheet" : "Sheets"}
            </div>
        </div>
    );
}


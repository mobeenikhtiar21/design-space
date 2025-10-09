"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Move, RotateCw, Expand } from "lucide-react";

interface ObjectItem {
    id: string;
    name: string;
    type: "wall" | "furniture" | "dimension" | "offset";
}

interface LayerItem {
    id: string;
    name: string;
    color: string;
    icon?: string;
    visible: boolean;
    locked: boolean;
    objects: ObjectItem[];
}

interface PresetItem {
    id: string;
    name: string;
    icon?: string;
}

interface SidebarProps {
    projectName?: string;
    layers?: LayerItem[];
}

type ModeType = "move" | "rotate" | "scale";

export default function Sidebar({
    projectName = "Untitled Project",
    layers = [
        {
            id: "dimensions",
            name: "Dimensions",
            color: "#10b981",
            visible: true,
            locked: false,
            objects: [
                { id: "dim-1", name: "Wall Length 1", type: "dimension" },
                { id: "dim-2", name: "Wall Length 2", type: "dimension" },
            ],
        },
        {
            id: "offsets",
            name: "Offsets",
            color: "#3b82f6",
            visible: true,
            locked: false,
            objects: [
                { id: "off-1", name: "Offset 1", type: "offset" },
            ],
        },
        {
            id: "walls-sp1",
            name: "Walls - SP1",
            color: "#f59e0b",
            visible: true,
            locked: false,
            objects: [
                { id: "wall-1", name: "North Wall", type: "wall" },
                { id: "wall-2", name: "South Wall", type: "wall" },
                { id: "wall-3", name: "East Wall", type: "wall" },
            ],
        },
        {
            id: "walls-sp2",
            name: "Walls - SP2",
            color: "#f59e0b",
            visible: true,
            locked: false,
            objects: [],
        },
        {
            id: "walls-sp3",
            name: "Walls - SP3",
            color: "#f59e0b",
            visible: true,
            locked: false,
            objects: [],
        },
    ],
}: SidebarProps) {
    const [selectedMode, setSelectedMode] = useState<ModeType>("move");
    const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set());

    const doorPresets: PresetItem[] = [
        { id: "door-800", name: "Standard Door (800mm)" },
        { id: "door-1600", name: "Double Door (1600mm)" },
        { id: "door-1800", name: "Sliding Door (1800mm)" },
    ];

    const windowPresets: PresetItem[] = [
        { id: "window-1200", name: "Standard Window (1200mm)" },
        { id: "window-1500", name: "Large Window (1500mm)" },
    ];

    const toggleLayer = (layerId: string) => {
        setExpandedLayers((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(layerId)) {
                newSet.delete(layerId);
            } else {
                newSet.add(layerId);
            }
            return newSet;
        });
    };

    return (
        <aside
            className="w-56 h-full flex flex-col bg-secondary overflow-y-auto"
            style={{
                borderRight: "1px solid var(--color-border-default)",
            }}
        >
            <div className="flex-1 overflow-y-auto p-3 space-y-5 h-full">
                {/* Status Section */}
                <section>
                    <h3
                        className="text-xs font-semibold uppercase mb-2"
                        style={{ color: "var(--color-text-muted)" }}
                    >
                        Status:
                    </h3>
                    <p
                        className="text-xs"
                        style={{ color: "var(--color-text-secondary)" }}
                    >
                        Loaded: {projectName}
                    </p>
                </section>

                {/* Mode Section */}
                <section>
                    <h3
                        className="text-sm font-bold uppercase mb-2"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        MODE
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        {/* Move Mode */}
                        <button
                            onClick={() => setSelectedMode("move")}
                            className={clsx(
                                "p-2.5 rounded-lg border-2 transition-all duration-200",
                                "hover:scale-105 focus:outline-none focus-visible:ring-2"
                            )}
                            style={{
                                backgroundColor:
                                    selectedMode === "move"
                                        ? "rgba(16, 185, 129, 0.15)"
                                        : "var(--color-elevated)",
                                borderColor:
                                    selectedMode === "move"
                                        ? "var(--color-accent)"
                                        : "var(--color-border-default)",
                            }}
                            aria-label="Move mode"
                        >
                            <Move
                                className="w-5 h-5 mx-auto"
                                style={{
                                    color:
                                        selectedMode === "move"
                                            ? "var(--color-accent)"
                                            : "var(--color-text-secondary)",
                                }}
                            />
                        </button>

                        {/* Rotate Mode */}
                        <button
                            onClick={() => setSelectedMode("rotate")}
                            className={clsx(
                                "p-2.5 rounded-lg border-2 transition-all duration-200",
                                "hover:scale-105 focus:outline-none focus-visible:ring-2"
                            )}
                            style={{
                                backgroundColor:
                                    selectedMode === "rotate"
                                        ? "rgba(16, 185, 129, 0.15)"
                                        : "var(--color-elevated)",
                                borderColor:
                                    selectedMode === "rotate"
                                        ? "var(--color-accent)"
                                        : "var(--color-border-default)",
                            }}
                            aria-label="Rotate mode"
                        >
                            <RotateCw
                                className="w-5 h-5 mx-auto"
                                style={{
                                    color:
                                        selectedMode === "rotate"
                                            ? "var(--color-accent)"
                                            : "var(--color-text-secondary)",
                                }}
                            />
                        </button>

                        {/* Scale Mode */}
                        <button
                            onClick={() => setSelectedMode("scale")}
                            className={clsx(
                                "p-2.5 rounded-lg border-2 transition-all duration-200",
                                "hover:scale-105 focus:outline-none focus-visible:ring-2"
                            )}
                            style={{
                                backgroundColor:
                                    selectedMode === "scale"
                                        ? "rgba(16, 185, 129, 0.15)"
                                        : "var(--color-elevated)",
                                borderColor:
                                    selectedMode === "scale"
                                        ? "var(--color-accent)"
                                        : "var(--color-border-default)",
                            }}
                            aria-label="Scale mode"
                        >
                            <Expand
                                className="w-5 h-5 mx-auto"
                                style={{
                                    color:
                                        selectedMode === "scale"
                                            ? "var(--color-accent)"
                                            : "var(--color-text-secondary)",
                                }}
                            />
                        </button>
                    </div>
                </section>

                {/* Layers Section with Scrollable Area */}
                <section>
                    <h3
                        className="text-sm font-bold mb-2"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        Layers
                    </h3>
                    <div className="max-h-64 overflow-y-auto space-y-1 pr-1 bg-primary rounded-lg">
                        {layers.map((layer) => (
                            <div key={layer.id} className="space-y-1">
                                <div
                                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-elevated transition-colors"
                                >
                                    <button
                                        onClick={() => toggleLayer(layer.id)}
                                        className="flex-shrink-0 transition-transform"
                                    >
                                        <svg
                                            className={clsx(
                                                "w-3 h-3 transition-transform",
                                                expandedLayers.has(layer.id) && "rotate-90"
                                            )}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            style={{ color: "var(--color-text-secondary)" }}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={3}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </button>

                                    <button
                                        className="flex-shrink-0 w-4 h-4 rounded border transition-colors"
                                        style={{
                                            backgroundColor: layer.visible
                                                ? layer.color
                                                : "transparent",
                                            borderColor: layer.color,
                                        }}
                                        aria-label={`Toggle ${layer.name} visibility`}
                                    >
                                        {layer.visible && (
                                            <svg
                                                className="w-full h-full"
                                                fill="white"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                            </svg>
                                        )}
                                    </button>

                                    <div
                                        className="w-4 h-4 rounded flex-shrink-0"
                                        style={{ backgroundColor: layer.color }}
                                    />

                                    <span
                                        className="text-xs flex-1 truncate"
                                        style={{ color: "var(--color-text-primary)" }}
                                    >
                                        {layer.name}
                                    </span>

                                    <span
                                        className="text-xs px-1 py-0.5 rounded flex-shrink-0"
                                        style={{
                                            color: "var(--color-text-muted)",
                                            backgroundColor: "var(--color-elevated)",
                                        }}
                                    >
                                        ({layer.objects.length})
                                    </span>
                                </div>

                                {/* Nested Objects */}
                                {expandedLayers.has(layer.id) && layer.objects.length > 0 && (
                                    <div className="ml-6 space-y-0.5">
                                        {layer.objects.map((obj) => (
                                            <button
                                                key={obj.id}
                                                className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-elevated transition-colors text-left"
                                            >
                                                <div
                                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: layer.color }}
                                                />
                                                <span
                                                    className="text-xs truncate"
                                                    style={{ color: "var(--color-text-secondary)" }}
                                                >
                                                    {obj.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Furniture Presets */}
                <section>
                    <h3
                        className="text-sm font-bold mb-2"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        Furniture Presets
                    </h3>

                    {/* Door Presets with Scrollable Area */}
                    <div className="mb-3">
                        <h4
                            className="text-xs font-semibold mb-1.5"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            Door Presets
                        </h4>
                        <div className="max-h-32 overflow-y-auto space-y-0.5 pr-1  bg-primary rounded-lg">
                            {doorPresets.map((preset) => (
                                <button
                                    key={preset.id}
                                    className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-elevated transition-colors text-left"
                                >
                                    <div
                                        className="w-4 h-4 rounded flex-shrink-0"
                                        style={{ backgroundColor: "#f59e0b" }}
                                    />
                                    <span
                                        className="text-xs truncate"
                                        style={{ color: "var(--color-text-secondary)" }}
                                    >
                                        {preset.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Window Presets with Scrollable Area */}
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <div
                                className="w-4 h-4 rounded flex-shrink-0"
                                style={{ backgroundColor: "#94a3b8" }}
                            />
                            <h4
                                className="text-xs font-semibold"
                                style={{ color: "var(--color-text-secondary)" }}
                            >
                                Window Presets
                            </h4>
                        </div>
                        <div className="max-h-32 overflow-y-auto space-y-0.5 pr-1 bg-primary rounded-lg">
                            {windowPresets.map((preset) => (
                                <button
                                    key={preset.id}
                                    className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-elevated transition-colors text-left"
                                >
                                    <div
                                        className="w-4 h-4 rounded flex-shrink-0"
                                        style={{ backgroundColor: "#94a3b8" }}
                                    />
                                    <span
                                        className="text-xs truncate"
                                        style={{ color: "var(--color-text-secondary)" }}
                                    >
                                        {preset.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Object Properties Section */}
                <section>
                    <h3
                        className="text-sm font-bold mb-2"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        Object Properties
                    </h3>
                    <p
                        className="text-xs italic"
                        style={{ color: "var(--color-text-muted)" }}
                    >
                        Set drawing area and add a space first.
                    </p>
                </section>

                <section className="mb-12" />
            </div>
        </aside>
    );
}

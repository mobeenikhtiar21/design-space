"use client";

import { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import {
    Square,
    PenTool,
    Minus,
    Spline as BezierCurve,
    Circle,
    RotateCcw as Arc,
    Shapes,
    Type,
    GripVertical,
} from "lucide-react";

export function DrawToolbar() {
    const [selectedTool, setSelectedTool] = useState<string>("rectangle");
    const [position, setPosition] = useState({ x: 240, y: 110 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const toolbarRef = useRef<HTMLDivElement>(null);
    const dragHandleRef = useRef<HTMLDivElement>(null);

    const tools = [
        { id: "rectangle", label: "Rectangle", icon: <Square className="w-4 h-4" /> },
        { id: "polyline", label: "Polyline", icon: <PenTool className="w-4 h-4" /> },
        { id: "line", label: "Line", icon: <Minus className="w-4 h-4 rotate-45" /> },
        { id: "bezier", label: "Bezier Curve", icon: <BezierCurve className="w-4 h-4" /> },
        { id: "circle", label: "Circle", icon: <Circle className="w-4 h-4" /> },
        { id: "arc", label: "Arc", icon: <Arc className="w-4 h-4" /> },
        { id: "shape", label: "Custom Shape", icon: <Shapes className="w-4 h-4" /> },
        { id: "text", label: "Text", icon: <Type className="w-4 h-4" /> },
    ];

    const handleToolSelect = (toolId: string) => setSelectedTool(toolId);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (dragHandleRef.current?.contains(e.target as Node)) {
            setIsDragging(true);
            setDragOffset({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            });
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragOffset.x,
                    y: e.clientY - dragOffset.y,
                });
            }
        };
        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    return (
        <div
            ref={toolbarRef}
            className="fixed z-50 rounded-lg shadow-lg select-none"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                backgroundColor: "var(--color-secondary)",
                border: "1px solid var(--color-border-default)",
                cursor: isDragging ? "grabbing" : "default",
                transform: "scale(0.9)", // optional fine-tune
                transformOrigin: "top left",
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Drag Handle */}
            <div
                ref={dragHandleRef}
                className="flex items-center justify-center py-1.5 px-3 cursor-grab active:cursor-grabbing rounded-t-lg transition-colors hover:bg-elevated/50"
                style={{ borderBottom: "1px solid var(--color-border-default)" }}
            >
                <div className="flex items-center gap-1 text-[var(--color-text-tertiary)]">
                    <GripVertical className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">
                        Draw
                    </span>
                </div>
            </div>

            {/* Tool Buttons */}
            <div className="p-2">
                <div className="grid grid-cols-2 gap-1.5">
                    {tools.map((tool) => (
                        <button
                            key={tool.id}
                            onClick={() => handleToolSelect(tool.id)}
                            className={clsx(
                                "p-2.5 rounded-md flex items-center justify-center transition-all duration-150",
                                "hover:scale-105 focus:outline-none focus-visible:ring-1"
                            )}
                            style={{
                                backgroundColor:
                                    selectedTool === tool.id
                                        ? "var(--color-elevated)"
                                        : "var(--color-tertiary)",
                                border: `1px solid ${selectedTool === tool.id
                                    ? "var(--color-accent)"
                                    : "transparent"
                                    }`,
                                color:
                                    selectedTool === tool.id
                                        ? "var(--color-accent)"
                                        : "var(--color-text-secondary)",
                            }}
                            aria-label={tool.label}
                            title={tool.label}
                        >
                            {tool.icon}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bottom Grip Indicator */}
            <div
                className="flex justify-center py-0.5 rounded-b-lg"
                style={{ borderTop: "1px solid var(--color-border-default)" }}
            >
                <div
                    className="w-6 h-0.5 rounded-full"
                    style={{ backgroundColor: "var(--color-border-default)" }}
                />
            </div>
        </div>
    );
}


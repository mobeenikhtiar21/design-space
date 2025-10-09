"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";

export function DangerZone({ userId }: { userId: string }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            const res = await fetch("/api/account/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            if (res.ok) toast.success("Account deleted successfully");
            else toast.error("Failed to delete account");
        });
    };

    return (
        <section
            className="rounded-xl p-6"
            style={{
                backgroundColor: "var(--color-secondary)",
                border: "1px solid var(--color-error)",
            }}
        >
            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--color-error)" }}>
                Danger Zone
            </h2>

            <div className="flex items-center justify-between">
                <div>
                    <p
                        className="text-sm font-medium mb-1"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        Delete Account
                    </p>
                    <p
                        className="text-sm"
                        style={{ color: "var(--color-text-tertiary)" }}
                    >
                        Permanently delete your account and all associated data
                    </p>
                </div>

                <button
                    onClick={() => setShowConfirm(true)}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold"
                    style={{
                        backgroundColor: "var(--color-error)",
                        color: "white",
                    }}
                >
                    Delete Account
                </button>
            </div>

            {showConfirm && (
                <div
                    className="mt-4 p-4 rounded-lg border-2"
                    style={{
                        backgroundColor: "var(--color-elevated)",
                        borderColor: "var(--color-error)",
                    }}
                >
                    <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-error)" }}>
                        Are you sure you want to delete your account?
                    </p>
                    <p
                        className="text-sm mb-4"
                        style={{ color: "var(--color-text-secondary)" }}
                    >
                        This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDelete}
                            disabled={isPending}
                            className="px-4 py-2 rounded-lg text-sm font-semibold"
                            style={{
                                backgroundColor: "var(--color-error)",
                                color: "white",
                            }}
                        >
                            {isPending ? "Deleting..." : "Yes, Delete My Account"}
                        </button>
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="px-4 py-2 rounded-lg text-sm font-medium"
                            style={{
                                backgroundColor: "var(--color-elevated)",
                                color: "var(--color-text-primary)",
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

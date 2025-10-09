"use client";

import { useState } from "react";
import { clsx } from "clsx";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase/client";

export function ProfileSection({ user }: { user: any }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
    });

    const handleCancel = () => {
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
        });
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    phone_number: formData.phone,
                },
            });

            if (error) throw error;

            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (err: any) {
            console.error("❌ Error updating profile:", err);
            toast.error(err.message || "Error updating profile");
        }
    };

    return (
        <section
            className="rounded-xl p-6"
            style={{
                backgroundColor: "var(--color-secondary)",
                border: "1px solid var(--color-border-default)",
            }}
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
                    Profile Information
                </h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 rounded-lg text-sm font-medium"
                        style={{
                            backgroundColor: "var(--color-elevated)",
                            color: "var(--color-text-primary)",
                        }}
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {["firstName", "lastName", "phone"].map((field) => (
                    <div key={field}>
                        <label
                            htmlFor={field}
                            className="block text-sm font-medium mb-2"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            {field === "firstName"
                                ? "First Name"
                                : field === "lastName"
                                    ? "Last Name"
                                    : "Phone"}
                        </label>
                        <input
                            id={field}
                            type="text"
                            value={(formData as any)[field]}
                            onChange={(e) =>
                                setFormData({ ...formData, [field]: e.target.value })
                            }
                            disabled={!isEditing}
                            className={clsx(
                                "w-full px-4 py-3 rounded-lg border",
                                "focus:outline-none focus:ring-2 focus:ring-accent/50",
                                !isEditing && "opacity-60 cursor-not-allowed"
                            )}
                            style={{
                                backgroundColor: "var(--color-elevated)",
                                borderColor: "var(--color-border-default)",
                                color: "var(--color-text-primary)",
                            }}
                        />
                    </div>
                ))}

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--color-text-secondary)" }}
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-3 rounded-lg border opacity-60 cursor-not-allowed"
                        style={{
                            backgroundColor: "var(--color-elevated)",
                            borderColor: "var(--color-border-default)",
                            color: "var(--color-text-primary)",
                        }}
                    />
                    <p className="mt-1 text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                        Email cannot be changed
                    </p>
                </div>

                {isEditing && (
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleSave}
                            className="px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg"
                            style={{
                                backgroundColor: "var(--color-accent)",
                                color: "var(--background)",
                            }}
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2.5 rounded-lg text-sm font-medium"
                            style={{
                                backgroundColor: "var(--color-elevated)",
                                color: "var(--color-text-primary)",
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}


"use client";

export function SubscriptionSection({ user }: { user: any }) {
    return (
        <section
            className="rounded-xl p-6"
            style={{
                backgroundColor: "var(--color-secondary)",
                border: "1px solid var(--color-border-default)",
            }}
        >
            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>
                Subscription
            </h2>

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm mb-1" style={{ color: "var(--color-text-secondary)" }}>
                        Current Plan
                    </p>
                    <div className="flex items-center gap-2">
                        <span
                            className="text-2xl font-bold capitalize"
                            style={{ color: "var(--color-accent)" }}
                        >
                            {user.plan}
                        </span>
                        {user.plan === "Pro" && (
                            <span
                                className="px-2 py-1 rounded text-xs font-semibold"
                                style={{
                                    backgroundColor: "var(--color-accent)",
                                    color: "var(--background)",
                                }}
                            >
                                Active
                            </span>
                        )}
                    </div>
                </div>

                <button
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg"
                    style={{
                        backgroundColor:
                            user.plan === "free"
                                ? "var(--color-accent)"
                                : "var(--color-elevated)",
                        color:
                            user.plan === "free"
                                ? "var(--background)"
                                : "var(--color-text-primary)",
                    }}
                >
                    {user.plan === "free" ? "Upgrade to Pro" : "Manage Plan"}
                </button>
            </div>
        </section>
    );
}

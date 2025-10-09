import {
    DangerZone,
    SubscriptionSection,
    ProfileSection
} from '@/components/Account/Settings'
import { createClient as createServerClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AccountSettings() {
    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    console.log(user)

    // Fetch profile data (or mock if not yet connected)
    const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user?.id)
        .single();

    const { data: subscription } = await supabase
        .from("subscriptions")
        .select("plan_id")
        .eq("user_id", user?.id)
        .single()


    const userData = {
        // firstName: profile?.first_name ?? "Graham",
        // lastName: profile?.last_name ?? "Jack",
        firstName: user?.user_metadata.first_name ?? "Graham",
        lastName: user?.user_metadata.last_name ?? "Jack",
        email: user?.email ?? "example@gmail.com",
        phone: user?.user_metadata.phone_number ?? "+1 555 123456",
        plan: subscription?.plan_id ?? "N/A",
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-b from-primary via-secondary to-primary"
            style={{ backgroundColor: "var(--background)" }}
        >
            {/* Header */}
            <header className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-border/50 bg-tertiary/70">
                <div
                    style={{
                        height: "0.25rem",
                        background:
                            "linear-gradient(to right, transparent, var(--color-accent), transparent)",
                        opacity: 0.6,
                    }}
                />
                <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="relative h-8 w-8 flex items-center justify-center">
                            <div
                                className="absolute inset-0 rounded-lg shadow-lg"
                                style={{
                                    background:
                                        "linear-gradient(135deg, var(--color-accent-light), var(--color-accent))",
                                }}
                            />
                            <div
                                className="relative h-3.5 w-3.5 rotate-45 rounded-sm"
                                style={{
                                    backgroundColor: "var(--background)",
                                }}
                            />
                        </div>
                        <Link href="/">
                            <span
                                className="text-base font-bold tracking-tight"
                                style={{
                                    color: "var(--color-text-primary)",
                                }}
                            >
                                DesignSpace{" "}
                                <span style={{ color: "var(--color-accent)" }}>Pro</span>
                            </span>
                        </Link>
                    </div>

                    <h1
                        className="text-xl font-bold"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        Account Settings
                    </h1>

                    <Link
                        href="/studio"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-elevated"
                        style={{ color: "var(--color-text-secondary)" }}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        <span className="text-sm font-medium">Back to Studio</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-4xl px-6 py-8 space-y-6">
                <ProfileSection user={userData} />
                <SubscriptionSection user={userData} />
                <DangerZone userId={user?.id} />
            </main>
        </div>
    );
}


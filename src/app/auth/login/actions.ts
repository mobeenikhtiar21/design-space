'use server';

import { createClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email and password are required" };
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        if (
            error.message.toLowerCase().includes("email not confirmed") ||
            error.message.toLowerCase().includes("email not verified")
        ) {
            return { error: "Email not verified", needsVerification: true };
        }
        return { error: error.message || "Invalid credentials" };
    }

    if (!data?.session) {
        return { error: "Login failed — no session returned." };
    }

    // Return session for client-side setSession
    return { success: true, session: data.session };
}


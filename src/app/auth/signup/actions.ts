"use server";

import { createClient } from "@/lib/supabase/server";

type SignupResult =
    | { success: true; message: string }
    | { success: false; error: string };

type ResendResult =
    | { success: true; message: string }
    | { success: false; error: string };

const cooldownMap = new Map<string, number>();

export async function signupUser(formData: {
    email: string;
    password: string;
    phone: string;
    firstName: string;
    lastName: string;
}): Promise<SignupResult> {
    const supabase = await createClient();

    const fullPhone = `${formData.phone}`;

    try {
        // 1️⃣ Create user in Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            phone: fullPhone,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify-email`,
                data: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    phone_number: formData.phone
                }
            },
        });

        console.error('db error:', error)

        if (error) {
            return { success: false, error: error.message };
        }

        // 2️⃣ Insert profile record
        // if (data?.user) {
        //     const { error: profileError } = await supabase.from("profiles").insert([
        //         {
        //             id: data.user.id,
        //             first_name: formData.firstName,
        //             last_name: formData.lastName,
        //         },
        //     ]);
        //
        //     console.error('profile error:', profileError)
        //     if (profileError) {
        //         return { success: false, error: profileError.message };
        //     }
        // }

        return {
            success: true,
            message: "Account created! Please check your email to verify your account.",
        };
    } catch (err: any) {
        console.error(err)
        return {
            success: false,
            error: err.message || "An unexpected error occurred during signup.",
        };
    }
}

export async function resendConfirmation(email: string): Promise<ResendResult> {
    const supabase = await createClient();

    // Cooldown window in milliseconds
    const COOLDOWN_MS = 60 * 1000; // 1 minute

    try {
        const lastSent = cooldownMap.get(email);
        const now = Date.now();

        if (lastSent && now - lastSent < COOLDOWN_MS) {
            const secondsLeft = Math.ceil((COOLDOWN_MS - (now - lastSent)) / 1000);
            return {
                success: false,
                error: `Please wait ${secondsLeft}s before resending another confirmation email.`,
            };
        }

        const { error } = await supabase.auth.resend({
            type: "signup",
            email,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify-email`,
            },
        });

        if (error) {
            return { success: false, error: error.message };
        }

        cooldownMap.set(email, now);

        return {
            success: true,
            message: "Confirmation email resent! Check your inbox.",
        };
    } catch (err: any) {
        return {
            success: false,
            error: err.message || "Failed to resend confirmation email.",
        };
    }
}

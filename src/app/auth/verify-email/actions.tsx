'use server';

import { createClient } from "@/lib/supabase/server";

export interface VerificationResult {
    success: boolean;
    message: string;
    session?: any; // session object if verification succeeded
    shouldRedirect?: boolean;
    redirectTo?: string;
}

/**
 * Verify email using code from URL
 */
export async function verifyEmailWithCode(code: string): Promise<VerificationResult> {
    try {

        const supabase = await createClient()

        await supabase.auth.signOut();

        const { data, error } = await supabase.auth.verifyOtp({
            token_hash: code,
            type: 'signup',
        });

        if (error) {
            console.error("❌ Code verification error:", error);
            return {
                success: false,
                message: error.message || "Verification failed. The link may be expired."
            };
        }

        const session = data?.session;

        console.log("✅ Email verified successfully with code");
        return {
            success: true,
            message: "Email verified successfully!",
            session,
            shouldRedirect: true,
            redirectTo: '/auth/login'
        };
    } catch (err: any) {
        console.error("❌ Unexpected verification error:", err);
        return {
            success: false,
            message: err.message || "An unexpected error occurred during verification."
        };
    }
}

/**
 * Verify email using token hash
 */
export async function verifyEmailWithToken(tokenHash: string): Promise<VerificationResult> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'signup'
        });

        if (error) {
            console.error("❌ Token verification error:", error);
            return {
                success: false,
                message: error.message || "Verification failed. The link may be expired."
            };
        }

        console.log("✅ Email verified successfully with token");
        return {
            success: true,
            message: "Email verified successfully!",
            shouldRedirect: true,
            redirectTo: '/studio'
        };
    } catch (err: any) {
        console.error("❌ Unexpected token verification error:", err);
        return {
            success: false,
            message: err.message || "An unexpected error occurred during verification."
        };
    }
}

/**
 * Set session using access and refresh tokens
 */
export async function setSessionWithTokens(
    accessToken: string,
    refreshToken: string
): Promise<VerificationResult> {
    try {
        const supabase = await createClient();

        const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
        });

        if (error) {
            console.error("❌ Session error:", error);
            return {
                success: false,
                message: error.message || "Failed to establish session"
            };
        }

        console.log("✅ Session established, email verified");
        return {
            success: true,
            message: "Email verified successfully!",
            shouldRedirect: true,
            redirectTo: '/studio'
        };
    } catch (err: any) {
        console.error("❌ Unexpected session error:", err);
        return {
            success: false,
            message: err.message || "An unexpected error occurred while establishing session."
        };
    }
}

/**
 * Get current user session and email
 */
export async function getCurrentUserEmail(): Promise<{
    email: string | null;
    isVerified: boolean;
}> {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        return {
            email: session?.user?.email || null,
            isVerified: !!session?.user?.email_confirmed_at
        };
    } catch (err) {
        console.error("❌ Error getting session:", err);
        return {
            email: null,
            isVerified: false
        };
    }
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(email: string): Promise<VerificationResult> {
    try {
        if (!email) {
            return {
                success: false,
                message: "No email address found. Please sign up again."
            };
        }

        const supabase = await createClient();

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/verify-email`,
            }
        });

        if (error) {
            console.error("❌ Resend error:", error);
            return {
                success: false,
                message: error.message || "Failed to resend verification email"
            };
        }

        console.log("✅ Verification email resent successfully");
        return {
            success: true,
            message: "Verification email sent! Check your inbox."
        };
    } catch (err: any) {
        console.error("❌ Unexpected resend error:", err);
        return {
            success: false,
            message: err.message || "An unexpected error occurred while resending email."
        };
    }
}

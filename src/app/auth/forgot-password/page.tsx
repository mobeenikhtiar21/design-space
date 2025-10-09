"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Mail, AlertCircle, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { ResendConfirmation } from "@/components/Auth/ResendButton";

type PageState = "idle" | "loading" | "success" | "error";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [state, setState] = useState<PageState>("idle");

    const validateEmail = (email: string): boolean => {
        if (!email) {
            setError("Email is required");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address");
            return false;
        }
        return true;
    };

    const handleResetPassword = useCallback(async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        console.log("🔐 Password reset requested for:", email);

        setError("");

        if (!validateEmail(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setState("loading");

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (resetError) throw resetError;

            console.log("✅ Password reset email sent successfully");
            setState("success");
            toast.success("Password reset email sent!");
        } catch (error: any) {
            console.error("❌ Password reset error:", error);
            const errorMsg = error.message || "Failed to send reset email. Please try again.";
            setError(errorMsg);
            setState("error");
            toast.error(errorMsg);
        }
    }, [email]);

    const handleResendReset = useCallback(async () => {
        console.log("📧 Resending password reset email to:", email);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (resetError) throw resetError;

            console.log("✅ Password reset email resent successfully");
            toast.success("Password reset email sent!");
        } catch (error: any) {
            console.error("❌ Resend error:", error);
            const errorMsg = error.message || "Failed to resend reset email";
            toast.error(errorMsg);
            throw error;
        }
    }, [email]);

    const handleTryAgain = useCallback(() => {
        console.log("🔄 User resetting form");
        setState("idle");
        setEmail("");
        setError("");
    }, []);

    // Success State
    if (state === "success") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center px-4 py-12 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative z-10 w-full max-w-md">
                    <div className="bg-secondary/80 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-8">
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto animate-bounce">
                                <CheckCircle className="w-8 h-8 text-accent" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-text-primary mb-2">
                                    Check Your Email
                                </h2>
                                <p className="text-muted mb-4">
                                    We've sent a password reset link to
                                </p>
                                <p className="text-accent font-semibold mb-6">{email}</p>
                            </div>

                            <div className="bg-elevated/50 border border-border rounded-xl p-4 space-y-3 text-left">
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-muted">
                                        Click the link in the email to reset your password
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-muted">
                                        The link will expire in 1 hour
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Mail className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-muted">
                                        Check your spam folder if you don't see it
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link
                                    href="/auth/login"
                                    className="group relative w-full overflow-hidden flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-accent-light text-background font-semibold rounded-xl shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:scale-[1.02]"
                                >
                                    <span className="relative z-10">Back to Login</span>
                                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                                </Link>

                                <button
                                    onClick={handleTryAgain}
                                    className="block w-full py-3 px-6 bg-elevated border border-border text-text-primary font-medium rounded-xl hover:bg-tertiary hover:border-accent/30 transition-all duration-300"
                                >
                                    Try Another Email
                                </button>
                            </div>
                        </div>

                        {/* Resend Component */}
                        <ResendConfirmation
                            show={true}
                            onResend={handleResendReset}
                            cooldown={60}
                            className="text-muted"
                            promptText="Didn't receive the email?"
                        />
                    </div>

                    <p className="text-center text-sm text-muted mt-8">
                        Need help?{" "}
                        <Link href="/contact" className="text-accent hover:text-accent-light transition-colors duration-300">
                            Contact support
                        </Link>
                    </p>
                </div>
            </div>
        );
    }

    // Main Form (Idle, Loading, or Error)
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
                    <div className="relative h-10 w-10 flex items-center justify-center">
                        <div
                            className="absolute inset-0 rounded-lg shadow-lg group-hover:shadow-accent/50 transition-shadow duration-300"
                            style={{
                                background: "linear-gradient(135deg, var(--color-accent-light), var(--color-accent))",
                            }}
                        />
                        <div
                            className="relative h-4 w-4 rotate-45 rounded-sm"
                            style={{ backgroundColor: "var(--background)" }}
                        />
                    </div>
                    <span className="text-2xl font-bold text-text-primary">
                        DesignSpace <span className="text-accent">Pro</span>
                    </span>
                </Link>

                {/* Forgot Password Card */}
                <div className="bg-secondary/80 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
                            <Mail className="w-8 h-8 text-accent" />
                        </div>
                        <h1 className="text-3xl font-bold text-text-primary mb-2">
                            Forgot Password?
                        </h1>
                        <p className="text-muted">
                            No worries, we'll send you reset instructions
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && state === "error" && (
                        <div className="mb-6 p-4 bg-error/10 border border-error/50 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-error">{error}</p>
                        </div>
                    )}

                    {/* Reset Password Form */}
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-muted" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError("");
                                        if (state === "error") setState("idle");
                                    }}
                                    required
                                    disabled={state === "loading"}
                                    className={`
                                        block w-full pl-10 pr-3 py-3 rounded-lg
                                        bg-elevated border
                                        ${error ? 'border-error' : 'border-border focus:border-accent'}
                                        text-text-primary placeholder-muted
                                        focus:outline-none focus:ring-2 focus:ring-accent/20
                                        transition-all duration-200
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                    `}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {error && (
                                <p className="mt-1 text-sm text-error flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {error}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={state === "loading"}
                            className="group relative w-full overflow-hidden flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-accent-light text-background font-semibold rounded-xl shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {state === "loading" ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <span className="relative z-10">Send Reset Link</span>
                                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent-light to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="mt-8 text-center text-sm text-muted">
                        Don't have an account?{" "}
                        <Link href="/auth/signup" className="text-accent hover:text-accent-light font-semibold transition-colors">
                            Sign up for free
                        </Link>
                    </p>
                </div>

                {/* Back to Login */}
                <div className="text-center mt-6">
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

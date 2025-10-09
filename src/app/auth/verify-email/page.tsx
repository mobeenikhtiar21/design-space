"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Loader2, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ResendConfirmation } from "@/components/Auth/ResendButton";
import {
    verifyEmailWithCode,
    verifyEmailWithToken,
    setSessionWithTokens,
    getCurrentUserEmail,
    resendVerificationEmail,
    type VerificationResult
} from "./actions";
import { supabase } from "@/lib/supabase/client";

type VerificationState = "idle" | "verifying" | "verified" | "error";

interface StateConfig {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    description: string;
    showButtons?: boolean;
    showResend?: boolean;
    showErrorDetails?: boolean;
}

export default function VerifyEmailPage() {
    const [state, setState] = useState<VerificationState>("idle");
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [showResend, setShowResend] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const initializeVerification = async () => {
            console.log("🔍 Initializing email verification page");

            // Get email from Supabase session
            // const { email: userEmail, isVerified } = await getCurrentUserEmail();
            //
            // if (userEmail) {
            //     console.log("📧 User email found:", userEmail);
            //     setEmail(userEmail);
            //
            //     // Check if user is already verified
            //     if (isVerified) {
            //         console.log("✅ Email already verified, redirecting...");
            //         setState("verified");
            //         toast.success("Your email is already verified!");
            //         setTimeout(() => router.push('/studio'), 2000);
            //         return;
            //     }
            // }

            // Handle Supabase verification redirect
            await handleVerificationRedirect();
        };

        initializeVerification();
    }, [router]);

    const handleVerificationRedirect = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get('code');
        const token = queryParams.get('token');
        const type = queryParams.get('type');
        const access_token = queryParams.get('access_token');
        const refresh_token = queryParams.get('refresh_token');
        const error_code = queryParams.get('error_code');
        const error_description = queryParams.get('error_description');

        console.log("🔗 URL params:", { code, token, type, access_token: !!access_token, refresh_token: !!refresh_token });

        // Handle errors in URL
        if (error_code || error_description) {
            console.error("❌ Error in URL params:", { error_code, error_description });
            const errorMessage = error_description
                ? decodeURIComponent(error_description)
                : "Verification link is invalid or expired";

            handleVerificationResult({ success: false, message: errorMessage });
            return;
        }

        // Handle code-based verification
        if (code) {
            console.log("🔐 Code-based verification detected");
            setState("verifying");
            const result = await verifyEmailWithCode(code);

            if (!result.session) {
                // toast.error("No session returned from server");
                // return;
            }

            // await supabase.auth.setSession({
            //     access_token: result.session.access_token,
            //     refresh_token: result.session.refresh_token
            // });

            handleVerificationResult(result);
            return;
        }

        // Handle token-based verification
        if (type === 'signup' && token) {
            console.log("🔐 Token-based verification detected");
            setState("verifying");
            const result = await verifyEmailWithToken(token);
            handleVerificationResult(result);
            return;
        }

        // Handle session-based verification
        if (type === 'signup' && access_token && refresh_token) {
            console.log("🔐 Session-based verification detected");
            setState("verifying");
            const result = await setSessionWithTokens(access_token, refresh_token);
            handleVerificationResult(result);
            return;
        }

        // No verification params found - show waiting state
        console.log("⏳ No verification params found, showing waiting screen");
        setShowResend(false);
    };

    const handleVerificationResult = (result: VerificationResult) => {
        if (result.success) {
            setState("verified");
            toast.success(result.message);
            if (result.shouldRedirect && result.redirectTo) {
                setTimeout(() => router.push(result.redirectTo!), 2000);
            }
        } else {
            setState("error");
            setError(result.message);
            toast.error(result.message);
            setShowResend(true);
        }
    };

    const handleResendVerification = async () => {
        console.log("📧 Resending verification email to:", email);

        const result = await resendVerificationEmail(email);

        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
            throw new Error(result.message);
        }
    };

    // State configurations
    const stateConfigs: Record<VerificationState, StateConfig> = {
        idle: {
            icon: <Mail className="w-8 h-8 text-accent" />,
            iconBg: "bg-accent/20",
            title: "Verify Your Email",
            description: email
                ? `We've sent a verification email to ${email}`
                : "We've sent a verification email to your email address",
            showButtons: true,
            showResend: true
        },
        verifying: {
            icon: <Loader2 className="w-8 h-8 text-accent animate-spin" />,
            iconBg: "bg-accent/20 animate-pulse",
            title: "Verifying Your Email",
            description: "Please wait while we verify your email address..."
        },
        verified: {
            icon: <CheckCircle className="w-10 h-10 text-accent" />,
            iconBg: "bg-accent/20 animate-bounce",
            title: "Email Verified! 🎉",
            description: "Your email has been successfully verified. Redirecting you to your dashboard..."
        },
        error: {
            icon: <AlertCircle className="w-8 h-8 text-error" />,
            iconBg: "bg-error/20",
            title: "Verification Failed",
            description: error,
            showButtons: true,
            showResend: true,
            showErrorDetails: true
        }
    };

    const currentConfig = stateConfigs[state];

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Header - Only show for idle state */}
                {state === "idle" && (
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                            <div className="relative h-10 w-10 flex items-center justify-center">
                                <div
                                    className="absolute inset-0 rounded-lg shadow-lg"
                                    style={{
                                        background: "linear-gradient(to bottom right, var(--color-accent-light), var(--color-accent))",
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
                    </div>
                )}

                {/* Main Card */}
                <div className="bg-secondary/80 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl">
                    <div className="text-center space-y-6">
                        {/* Icon */}
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${currentConfig.iconBg}`}>
                            {currentConfig.icon}
                        </div>

                        {/* Title & Description */}
                        <div>
                            <h2 className="text-2xl font-bold text-text-primary mb-2">
                                {currentConfig.title}
                            </h2>
                            <p className="text-sm text-muted">
                                {currentConfig.description}
                            </p>
                        </div>

                        {/* Additional Info Box - For idle state */}
                        {state === "idle" && (
                            <div className="bg-elevated/50 border border-border rounded-xl p-4 space-y-3">
                                <p className="text-sm text-muted">
                                    Click the verification link in the email to activate your account.
                                </p>
                                <div className="flex items-start gap-2 text-xs text-muted">
                                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                    <span>Check your spam folder if you don't see it</span>
                                </div>
                            </div>
                        )}

                        {/* Error Details */}
                        {currentConfig.showErrorDetails && (
                            <div className="bg-error/10 border border-error/50 rounded-lg p-4">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                                    <div className="text-left">
                                        <p className="text-sm text-error font-medium mb-1">
                                            Common causes:
                                        </p>
                                        <ul className="text-xs text-error/80 space-y-1">
                                            <li>• The verification link has expired</li>
                                            <li>• The link has already been used</li>
                                            <li>• The link is invalid or corrupted</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Loading indicator for verified state */}
                        {state === "verified" && (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin text-accent" />
                                <span className="text-sm text-muted">Redirecting...</span>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {currentConfig.showButtons && (
                            <div className="space-y-3">
                                {state === "error" ? (
                                    <>
                                        <Link
                                            href="/auth/login"
                                            className="group relative w-full overflow-hidden flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-accent-light text-background font-semibold rounded-xl shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:scale-[1.02]"
                                        >
                                            <span className="relative z-10">Go to Login</span>
                                            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                                        </Link>
                                        <Link
                                            href="/auth/signup"
                                            className="block text-sm text-accent hover:text-accent-light transition-colors duration-300"
                                        >
                                            Sign up again
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        href="/auth/login"
                                        className="block text-sm text-accent hover:text-accent-light transition-colors duration-300"
                                    >
                                        Back to Sign In
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Resend Component */}
                    {email && currentConfig.showResend && (
                        <ResendConfirmation
                            show={showResend || state === "idle"}
                            onResend={handleResendVerification}
                            cooldown={60}
                            className="text-muted"
                            promptText={state === "error" ? "Need a new verification link?" : undefined}
                        />
                    )}
                </div>

                {/* Footer */}
                {(state === "idle" || state === "error") && (
                    <p className="text-center text-sm text-muted mt-8">
                        Need help?{" "}
                        <Link href="/contact" className="text-accent hover:text-accent-light transition-colors duration-300">
                            Contact support
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
}

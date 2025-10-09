"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Lock, AlertCircle, CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type PageState = "verifying" | "ready" | "submitting" | "success" | "error";

export default function ResetPasswordPage() {
    const [state, setState] = useState<PageState>("verifying");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; submit?: string }>({});
    const [passwordStrength, setPasswordStrength] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const verifyRecoveryToken = async () => {
            console.log("🔍 Verifying recovery token...");

            // Check both hash and query params
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const queryParams = new URLSearchParams(window.location.search);

            const token = queryParams.get('token') || hashParams.get('token');
            const type = queryParams.get('type') || hashParams.get('type');
            const access_token = hashParams.get('access_token');
            const refresh_token = hashParams.get('refresh_token');
            const error_code = queryParams.get('error_code') || hashParams.get('error_code');
            const error_description = queryParams.get('error_description') || hashParams.get('error_description');

            console.log("🔗 URL params:", {
                token: !!token,
                type,
                access_token: !!access_token,
                refresh_token: !!refresh_token,
                error_code,
                error_description,
                hash: window.location.hash,
                search: window.location.search
            });

            // Check for error in URL
            if (error_code || error_description) {
                console.error("❌ Error in URL params:", { error_code, error_description });
                setState("error");
                const errorMsg = error_description
                    ? decodeURIComponent(error_description)
                    : "Invalid or expired reset link";
                setErrors({ submit: errorMsg });
                toast.error(errorMsg);
                return;
            }

            // Handle session-based recovery (Supabase redirects with hash params)
            if (type === 'recovery' && access_token && refresh_token) {
                console.log("🔐 Session-based recovery detected (from hash)");
                try {
                    const { error: sessionError } = await supabase.auth.setSession({
                        access_token,
                        refresh_token,
                    });

                    if (sessionError) throw sessionError;

                    console.log("✅ Recovery session established");
                    setState("ready");
                    toast.success("You can now reset your password");
                } catch (err: any) {
                    console.error("❌ Session error:", err);
                    setState("error");
                    const errorMsg = err.message || "Failed to establish recovery session";
                    setErrors({ submit: errorMsg });
                    toast.error(errorMsg);
                }
                return;
            }

            // Handle token-based recovery (from email link)
            if (type === 'recovery' && token) {
                console.log("🔐 Token-based recovery detected");
                try {
                    const { data, error: verifyError } = await supabase.auth.verifyOtp({
                        token_hash: token,
                        type: 'recovery'
                    });

                    if (verifyError) throw verifyError;

                    console.log("✅ Recovery token verified successfully");
                    setState("ready");
                    toast.success("You can now reset your password");
                } catch (err: any) {
                    console.error("❌ Token verification error:", err);
                    setState("error");
                    const errorMsg = err.message || "Invalid or expired reset link";
                    setErrors({ submit: errorMsg });
                    toast.error(errorMsg);
                }
                return;
            }

            // No recovery params found - this page requires a reset token
            console.error("❌ No valid recovery token found in URL");
            setState("error");
            setErrors({ submit: "No reset token found. Please request a new password reset link." });
            toast.error("Invalid or missing reset link");
        };

        verifyRecoveryToken();
    }, []);

    const calculatePasswordStrength = useCallback((password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        return strength;
    }, []);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(calculatePasswordStrength(newPassword));
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: undefined }));
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        if (errors.confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { password?: string; confirmPassword?: string } = {};

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("🔐 Password reset submission started");

        if (!validateForm()) {
            console.warn("⚠️ Form validation failed");
            toast.error("Please fix the errors in the form");
            return;
        }

        setState("submitting");
        setErrors({});

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) throw updateError;

            console.log("✅ Password updated successfully");
            setState("success");
            toast.success("Password reset successful!");

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);

        } catch (error: any) {
            console.error("❌ Password update error:", error);
            setState("ready");
            const errorMsg = error.message || "Failed to reset password. Please try again.";
            setErrors({ submit: errorMsg });
            toast.error(errorMsg);
        }
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 1) return "bg-error";
        if (passwordStrength <= 3) return "bg-warning";
        return "bg-accent";
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength <= 1) return "Weak";
        if (passwordStrength <= 3) return "Medium";
        return "Strong";
    };

    // Verifying State
    if (state === "verifying") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center px-4 py-12 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative z-10 w-full max-w-md">
                    <div className="bg-secondary/80 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-8">
                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 animate-pulse">
                                <Loader2 className="w-8 h-8 text-accent animate-spin" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-text-primary mb-2">
                                    Verifying Reset Link
                                </h2>
                                <p className="text-sm text-muted">
                                    Please wait while we verify your password reset link...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Success State
    if (state === "success") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center px-4 py-12 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative z-10 w-full max-w-md">
                    <div className="bg-secondary/80 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-8 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 mb-6 animate-bounce">
                            <CheckCircle className="w-10 h-10 text-accent" />
                        </div>

                        <h1 className="text-3xl font-bold text-text-primary mb-4">
                            Password Reset! 🎉
                        </h1>

                        <p className="text-muted mb-8">
                            Your password has been successfully reset. Redirecting to login...
                        </p>

                        <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin text-accent" />
                            <span className="text-sm text-muted">Redirecting...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error State
    if (state === "error") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center px-4 py-12 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative z-10 w-full max-w-md">
                    <div className="bg-secondary/80 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-8">
                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/20">
                                <AlertCircle className="w-8 h-8 text-error" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-text-primary mb-2">
                                    Invalid Reset Link
                                </h2>
                                <p className="text-sm text-muted mb-6">
                                    {errors.submit}
                                </p>
                            </div>

                            <div className="bg-error/10 border border-error/50 rounded-lg p-4">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                                    <div className="text-left">
                                        <p className="text-sm text-error font-medium mb-1">
                                            Common causes:
                                        </p>
                                        <ul className="text-xs text-error/80 space-y-1">
                                            <li>• The reset link has expired (valid for 1 hour)</li>
                                            <li>• The link has already been used</li>
                                            <li>• The link is invalid or corrupted</li>
                                            <li>• No reset token was provided in the URL</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link
                                    href="/auth/forgot-password"
                                    className="group relative w-full overflow-hidden flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-accent-light text-background font-semibold rounded-xl shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:scale-[1.02]"
                                >
                                    <span className="relative z-10">Request New Reset Link</span>
                                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                                </Link>

                                <Link
                                    href="/auth/login"
                                    className="block text-sm text-accent hover:text-accent-light transition-colors duration-300"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </div>
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

    // Main Reset Password Form (Ready State)
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

                {/* Reset Password Card */}
                <div className="bg-secondary/80 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
                            <Lock className="w-8 h-8 text-accent" />
                        </div>
                        <h1 className="text-3xl font-bold text-text-primary mb-2">
                            Reset Your Password
                        </h1>
                        <p className="text-muted">
                            Enter your new password below
                        </p>
                    </div>

                    {/* Submit Error Alert */}
                    {errors.submit && (
                        <div className="mb-6 p-4 bg-error/10 border border-error/50 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-error">{errors.submit}</p>
                        </div>
                    )}

                    {/* Reset Password Form */}
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        {/* New Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-muted" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                    disabled={state === "submitting"}
                                    className={`
                                        block w-full pl-10 pr-12 py-3 rounded-lg
                                        bg-elevated border
                                        ${errors.password ? 'border-error' : 'border-border focus:border-accent'}
                                        text-text-primary placeholder-muted
                                        focus:outline-none focus:ring-2 focus:ring-accent/20
                                        transition-all duration-200
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                    `}
                                    placeholder="Enter your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-text-primary transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-error flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.password}
                                </p>
                            )}

                            {/* Password Strength Indicator */}
                            {password && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-muted">Password strength:</span>
                                        <span className={`text-xs font-medium ${passwordStrength <= 1 ? 'text-error' :
                                            passwordStrength <= 3 ? 'text-warning' : 'text-accent'
                                            }`}>
                                            {getPasswordStrengthText()}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${getPasswordStrengthColor()} transition-all duration-300 rounded-full`}
                                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-muted" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    required
                                    disabled={state === "submitting"}
                                    className={`
                                        block w-full pl-10 pr-12 py-3 rounded-lg
                                        bg-elevated border
                                        ${errors.confirmPassword ? 'border-error' : 'border-border focus:border-accent'}
                                        text-text-primary placeholder-muted
                                        focus:outline-none focus:ring-2 focus:ring-accent/20
                                        transition-all duration-200
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                    `}
                                    placeholder="Confirm your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-text-primary transition-colors"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-error flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-elevated/50 border border-border rounded-lg p-4">
                            <p className="text-xs text-muted mb-2 font-medium">Password requirements:</p>
                            <ul className="text-xs text-muted space-y-1">
                                <li className="flex items-center gap-2">
                                    <div className={`w-1 h-1 rounded-full ${password.length >= 8 ? 'bg-accent' : 'bg-muted'}`} />
                                    At least 8 characters long
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className={`w-1 h-1 rounded-full ${/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'bg-accent' : 'bg-muted'}`} />
                                    Contains uppercase and lowercase letters
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className={`w-1 h-1 rounded-full ${/\d/.test(password) ? 'bg-accent' : 'bg-muted'}`} />
                                    Contains at least one number
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className={`w-1 h-1 rounded-full ${/[^a-zA-Z0-9]/.test(password) ? 'bg-accent' : 'bg-muted'}`} />
                                    Contains at least one special character
                                </li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={state === "submitting"}
                            className="group relative w-full overflow-hidden flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-accent-light text-background font-semibold rounded-xl shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {state === "submitting" ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Resetting Password...</span>
                                </>
                            ) : (
                                <>
                                    <span className="relative z-10">Reset Password</span>
                                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent-light to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Back to Login */}
                <p className="text-center text-sm text-muted mt-8">
                    Remember your password?{" "}
                    <Link href="/auth/login" className="text-accent hover:text-accent-light transition-colors duration-300">
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

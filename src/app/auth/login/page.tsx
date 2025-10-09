"use client";

import { useEffect, useState, useTransition } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, AlertCircle, ArrowLeftIcon, GithubIcon, Chromium } from "lucide-react";

import { ResendConfirmation } from "@/components/Auth/ResendButton";
import PasswordInput from "@/components/Auth/PasswordInput";
import { loginAction } from "./actions";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showResend, setShowResend] = useState(false);
    const [redirectTo, setRedirectTo] = useState("/studio");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirectedFrom") || "/studio";
        if (redirect.trim() !== "/studio")
            toast.error("You must be logged in to access that page.");
        setRedirectTo(redirect);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.password) newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setErrors({});
        setShowResend(false);

        startTransition(async () => {
            const form = new FormData();
            form.append("email", formData.email);
            form.append("password", formData.password);

            const res = await loginAction(form);

            if (res?.error) {
                if (res.needsVerification) {
                    setShowResend(true);
                    toast.error("Your email isn’t verified. Please check your inbox.");
                } else {
                    toast.error(res.error ?? "Failed to login.");
                }
                return;
            }

            if (!res.session) {
                toast.error("No session returned from server");
                return;
            }

            await supabase.auth.setSession({
                access_token: res.session.access_token,
                refresh_token: res.session.refresh_token
            });

            toast.success("Login successful!");
            router.push(redirectTo);
        });
    };

    const handleResendConfirmation = async () => {
        setErrors({});
        startTransition(async () => {
            try {
                const { error } = await supabase.auth.resend({
                    type: "signup",
                    email: formData.email,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/verify-email`,
                    },
                });
                if (error) {
                    setErrors({ submit: error.message });
                    toast.error(error.message);
                } else {
                    toast.success("Confirmation email resent! Check your inbox.");
                }
            } catch (err) {
                setErrors({ submit: "Failed to resend confirmation email." });
                toast.error("Failed to resend confirmation email.");
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center px-4 py-12 relative overflow-hidden">
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-secondary/80 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome Back</h1>
                        <p className="text-muted">Sign in to continue to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.submit && (
                            <div className="flex items-center gap-2 p-4 bg-error/10 border border-error/50 rounded-lg text-error text-sm">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.submit}</span>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-3 rounded-lg bg-elevated border ${errors.email ? "border-error" : "border-border focus:border-accent"
                                        } text-text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-error flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col">
                            <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                                Password
                            </label>
                            <PasswordInput
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                            />
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm text-accent hover:text-accent-light transition-colors duration-200 mt-2 ml-auto"
                            >
                                Forgot password?
                            </Link>
                            {errors.password && (
                                <p className="mt-1 text-sm text-error flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="group relative w-full overflow-hidden flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-accent-light text-background font-semibold rounded-xl shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isPending ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Resend Confirmation */}
                    <ResendConfirmation
                        show={showResend}
                        onResend={handleResendConfirmation}
                        cooldown={60}
                        className="text-muted"
                        buttonText={{
                            idle: "Send again",
                            sending: "Resending...",
                            cooldown: (s) => `Wait ${s}s`,
                        }}
                        promptText="Need another email?"
                    />

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-secondary text-muted">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Login Options */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            disabled
                            aria-disabled="true"
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-elevated border border-border rounded-lg text-text-primary font-medium hover:bg-tertiary hover:border-accent/30 transition-all duration-200 opacity-50 cursor-not-allowed"
                        >
                            <Chromium />
                            Google
                        </button>
                        <button
                            type="button"
                            disabled
                            aria-disabled="true"
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-elevated border border-border rounded-lg text-text-primary font-medium hover:bg-tertiary hover:border-accent/30 transition-all duration-200 opacity-50 cursor-not-allowed"
                        >
                            <GithubIcon />
                            GitHub
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-muted">
                            Don't have an account?{" "}
                            <Link
                                href="/auth/signup"
                                className="text-accent font-semibold hover:text-accent-light transition-colors duration-200"
                            >
                                Sign up for free
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <Link href="/" className="text-sm text-muted hover:text-accent transition-colors inline-flex items-center gap-1">
                        <ArrowLeftIcon size={18} /> Back to homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}


"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowRight, ArrowLeftIcon, Mail, User, Phone, AlertCircle, Github, Chromium } from "lucide-react";

import { allCountries } from 'country-telephone-data';
import { ResendConfirmation } from "@/components/Auth/ResendButton";
import PasswordInput from "@/components/Auth/PasswordInput";
import { resendConfirmation, signupUser } from "./actions";

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryCode: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    agreeToTerms?: string;
    submit?: string;
}

export default function SignupPage() {
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        countryCode: "+1",
        password: "",
        confirmPassword: "",
        agreeToTerms: false
    });

    const [showResend, setShowResend] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const router = useRouter();

    // Common country codes
    const countryOptions = allCountries.map(el => ({
        code: `+${el.dialCode}`,
        country: el.name,
        iso2: el.iso2
    }));

    // Memoized password strength calculation
    const calculatePasswordStrength = useCallback((password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        return strength;
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name as keyof FormErrors];
                return newErrors;
            });
        }

        // Check password strength
        if (name === "password") {
            setPasswordStrength(calculatePasswordStrength(value));
        }
    }, [errors, calculatePasswordStrength]);

    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.phone) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{7,15}$/.test(formData.phone.replace(/\s/g, ""))) {
            newErrors.phone = "Phone number is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = "You must agree to the terms and conditions";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("🚀 Form submission started");

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            console.log("📝 Sending signup data to server...");
            const fullPhone = `${formData.countryCode}${formData.phone}`;

            const result = await signupUser({
                ...formData,
                phone: fullPhone,
            });

            if (!result.success) {
                console.error("❌ Signup error:", result.error);
                setErrors({ submit: result.error });
                toast.error(result.error);
                return;
            }

            console.log("✅ User signup success:", result.message);
            toast.success(result.message);
            setShowResend(true);

            setTimeout(() => {
                router.push("/auth/login");
            }, 2000);
        } catch (error) {
            console.error("❌ Unexpected error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendConfirmation = async () => {
        console.log("📧 Resending confirmation email to:", formData.email);

        try {
            const result = await resendConfirmation(formData.email);

            if (!result.success) {
                toast.error(result.error);
                return;
            }

            toast.success(result.message);
        } catch (error) {
            console.error("❌ Unexpected error during resend:", error);
            toast.error("Something went wrong. Please try again.");
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-2xl">
                {/* Logo/Brand */}
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

                {/* Signup Card */}
                <div className="bg-secondary/80 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-text-primary mb-2">
                            Create Your Account
                        </h1>
                        <p className="text-muted">
                            Join thousands of designers using DesignSpace Pro
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Global Error */}
                        {errors.submit && (
                            <div className="flex items-center gap-2 p-4 bg-error/10 border border-error/50 rounded-lg text-error text-sm">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{errors.submit}</span>
                            </div>
                        )}

                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* First Name */}
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-text-primary mb-2">
                                    First Name *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-muted" />
                                    </div>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`
                                            block w-full pl-10 pr-3 py-3 rounded-lg
                                            bg-elevated border
                                            ${errors.firstName ? 'border-error' : 'border-border focus:border-accent'}
                                            text-text-primary placeholder-muted
                                            focus:outline-none focus:ring-2 focus:ring-accent/20
                                            transition-all duration-200
                                        `}
                                        placeholder="John"
                                    />
                                </div>
                                {errors.firstName && (
                                    <p className="mt-1 text-sm text-error flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.firstName}
                                    </p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-text-primary mb-2">
                                    Last Name *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-muted" />
                                    </div>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={`
                                            block w-full pl-10 pr-3 py-3 rounded-lg
                                            bg-elevated border
                                            ${errors.lastName ? 'border-error' : 'border-border focus:border-accent'}
                                            text-text-primary placeholder-muted
                                            focus:outline-none focus:ring-2 focus:ring-accent/20
                                            transition-all duration-200
                                        `}
                                        placeholder="Doe"
                                    />
                                </div>
                                {errors.lastName && (
                                    <p className="mt-1 text-sm text-error flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.lastName}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                                Email Address *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-muted" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`
                                        block w-full pl-10 pr-3 py-3 rounded-lg
                                        bg-elevated border
                                        ${errors.email ? 'border-error' : 'border-border focus:border-accent'}
                                        text-text-primary placeholder-muted
                                        focus:outline-none focus:ring-2 focus:ring-accent/20
                                        transition-all duration-200
                                    `}
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

                        {/* Phone Number Field */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
                                Phone Number *
                            </label>
                            <div className="flex gap-2">
                                {/* Country Code Selector */}
                                <select
                                    name="countryCode"
                                    value={formData.countryCode}
                                    onChange={handleChange}
                                    className="w-24 px-3 py-3 rounded-lg bg-elevated border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200"
                                >
                                    {countryOptions.map(({ code, country }) => (
                                        <option key={country} value={code}>
                                            {code} {country}
                                        </option>
                                    ))}
                                </select>

                                {/* Phone Input */}
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-muted" />
                                    </div>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`
                                            block w-full pl-10 pr-3 py-3 rounded-lg
                                            bg-elevated border
                                            ${errors.phone ? 'border-error' : 'border-border focus:border-accent'}
                                            text-text-primary placeholder-muted
                                            focus:outline-none focus:ring-2 focus:ring-accent/20
                                            transition-all duration-200
                                        `}
                                        placeholder="123 456 7890"
                                    />
                                </div>
                            </div>
                            {errors.phone && (
                                <p className="mt-1 text-sm text-error flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        {/* Password Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                                    Password *
                                </label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min. 8 characters"
                                    error={errors.password}
                                />
                                {formData.password && (
                                    <div className="mt-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="flex-1 h-1 bg-elevated rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                                                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-muted">{getPasswordStrengthText()}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
                                    Confirm Password *
                                </label>
                                <PasswordInput
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`
                                        ${errors.confirmPassword ? 'border-error' : 'border-border focus:border-accent'}
                                    `}
                                    placeholder="Re-enter password"
                                    error={errors.confirmPassword}
                                />
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div>
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="agreeToTerms"
                                        name="agreeToTerms"
                                        type="checkbox"
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                        className={`h-4 w-4 rounded border-border bg-elevated text-accent focus:ring-2 focus:ring-accent/20 transition-colors duration-200 ${errors.agreeToTerms ? 'border-error' : ''}`}
                                    />
                                </div>
                                <div className="ml-3">
                                    <label htmlFor="agreeToTerms" className="text-sm text-text-primary">
                                        I agree to the{" "}
                                        <Link href="/terms" className="text-accent hover:text-accent-light font-medium">
                                            Terms of Service
                                        </Link>
                                        {" "}and{" "}
                                        <Link href="/privacy" className="text-accent hover:text-accent-light font-medium">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                    {errors.agreeToTerms && (
                                        <p className="mt-1 text-sm text-error flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.agreeToTerms}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full overflow-hidden flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-accent-light text-background font-semibold rounded-xl shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <>
                                    <span className="relative z-10">Create Account</span>
                                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent-light to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Resend Confirmation Component */}
                    <ResendConfirmation
                        show={showResend}
                        onResend={handleResendConfirmation}
                        cooldown={60}
                        className="text-muted"
                        buttonText={{
                            idle: "Send again",
                            sending: "Resending...",
                            cooldown: (s) => `Wait ${s}s`
                        }}
                        promptText="Need another email?"
                    />

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-secondary text-muted">Or sign up with</span>
                        </div>
                    </div>

                    {/* Social Signup Options */}
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
                            <Github />
                            GitHub
                        </button>
                    </div>

                    {/* Sign In Link */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-muted">
                            Already have an account?{" "}
                            <Link
                                href="/auth/login"
                                className="text-accent font-semibold hover:text-accent-light transition-colors duration-200"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link
                        href="/"
                        className="text-sm text-muted hover:text-accent transition-colors duration-200 inline-flex items-center gap-1"
                    >
                        <ArrowLeftIcon size={18} /> Back to homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}

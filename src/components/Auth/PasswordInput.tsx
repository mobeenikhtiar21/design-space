import { useState } from "react";
import clsx from "clsx";
import { Lock, EyeOff, Eye, AlertCircle } from 'lucide-react'

const PasswordInput = ({
    id,
    name = "password",
    value,
    onChange,
    placeholder,
    className,
    error,
    disabled
}: {
    id: string;
    name?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    className?: string;
    error?: string;
    disabled?: boolean;
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted" />
                </div>
                <input
                    id={id}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    name={name}
                    onChange={onChange}
                    disabled={disabled}
                    className={clsx(`
                        block w-full pl-10 pr-10 py-3 rounded-lg
                        bg-elevated border
                        ${error ? 'border-error' : 'border-border focus:border-accent'}
                        text-text-primary placeholder-muted
                        focus:outline-none focus:ring-2 focus:ring-accent/20
                        transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                    `,
                        className
                    )}
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={disabled}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-accent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5 text-muted hover:text-accent" />
                    ) : (
                        <Eye className="h-5 w-5 text-muted hover:text-accent" />
                    )}
                </button>
            </div>
            {error && (
                <p className="mt-1 text-sm text-error flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </p>
            )}
        </>
    );
};

export default PasswordInput;

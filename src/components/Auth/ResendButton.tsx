import * as React from "react";
import clsx from "clsx";

type ResendConfirmationProps = {
    show: boolean;
    onResend: () => Promise<void> | void;
    cooldown?: number; // seconds
    className?: string;
    showSpinner?: boolean;
    buttonText?: {
        idle?: string;
        sending?: string;
        cooldown?: (seconds: number) => string;
    };
    promptText?: string;
};

export function ResendConfirmation({
    show,
    onResend,
    cooldown = 60,
    className,
    showSpinner = true,
    buttonText = {},
    promptText = "Didn't receive the confirmation email?"
}: ResendConfirmationProps) {
    const [remaining, setRemaining] = React.useState(0);
    const [isSending, setIsSending] = React.useState(false);
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    // Cleanup timer on unmount
    React.useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    // Tick down the cooldown
    React.useEffect(() => {
        if (remaining <= 0) return;

        timerRef.current = setInterval(() => {
            setRemaining((r) => {
                const newRemaining = Math.max(0, r - 1);
                if (newRemaining === 0 && timerRef.current) {
                    clearInterval(timerRef.current);
                }
                return newRemaining;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [remaining]);

    const isCoolingDown = remaining > 0;
    const isDisabled = isSending || isCoolingDown;

    // Customizable button text
    const defaultButtonText = {
        idle: "Resend email",
        sending: "Sending...",
        cooldown: (seconds: number) => `Resend in ${seconds}s`
    };

    const labels = { ...defaultButtonText, ...buttonText };
    const label = isSending
        ? labels.sending
        : isCoolingDown
            ? labels.cooldown(remaining)
            : labels.idle;

    const srStatus = isSending
        ? "Sending confirmation email."
        : isCoolingDown
            ? `You can resend in ${remaining} seconds.`
            : "Resend is available.";

    const handleClick = React.useCallback(async () => {
        if (isDisabled) return;

        console.log("📧 Resend button clicked");

        try {
            setIsSending(true);
            await onResend();

            // Start cooldown only after successful send
            console.log(`✅ Resend successful, starting ${cooldown}s cooldown`);
            setRemaining(cooldown);
        } catch (err) {
            console.error("❌ Resend failed:", (err as Error)?.message || err);
            // No cooldown on failure; keep interactive so the user can retry
        } finally {
            setIsSending(false);
        }
    }, [isDisabled, onResend, cooldown]);

    if (!show) return null;

    return (
        <div
            className={clsx(
                "mx-auto mt-4 flex items-center justify-center gap-2 text-sm flex-wrap",
                className
            )}
        >
            <span className="text-muted">{promptText}</span>
            <button
                type="button"
                onClick={handleClick}
                disabled={isDisabled}
                aria-busy={isSending || undefined}
                aria-live="polite"
                title={
                    isCoolingDown
                        ? `Available in ${remaining}s`
                        : isSending
                            ? "Sending confirmation email..."
                            : "Resend confirmation email"
                }
                className={clsx(
                    "font-semibold transition-all duration-200 inline-flex items-center gap-1.5 px-2 py-1 rounded-lg",
                    // Enabled state
                    !isDisabled && "text-accent hover:text-accent-light hover:bg-accent/10 cursor-pointer",
                    // Disabled state (cooldown or sending)
                    isDisabled && "text-muted cursor-not-allowed opacity-60",
                    // Focus styles for accessibility
                    "focus:outline-none focus:ring-2 focus:ring-accent/50"
                )}
            >
                {/* Spinner shown when sending */}
                {isSending && showSpinner && (
                    <svg
                        className="h-4 w-4 animate-spin text-accent"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"
                        />
                    </svg>
                )}
                <span>{label}</span>
            </button>

            {/* Screen reader updates for state changes */}
            <span role="status" aria-live="polite" className="sr-only">
                {srStatus}
            </span>
        </div>
    );
}

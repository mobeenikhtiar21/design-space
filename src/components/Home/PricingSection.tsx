import { createClient } from "@/lib/supabase/server";
import { Check, Sparkles, Building2, Rocket } from "lucide-react";

export const revalidate = 3600;

export default async function PricingSection() {

    const supabase = await createClient()


    const { data: plans, error } = await supabase
        .from("plans")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

    if (error) {
        console.error("Error fetching plans:", error);
        return <div className="text-center text-red-500">Failed to load plans.</div>;
    }

    const icons: Record<string, any> = {
        free: Rocket,
        pro: Sparkles,
        professional: Sparkles,
        enterprise: Building2
    };

    return (
        <section id="pricing" className="relative py-24 bg-gradient-to-b from-primary via-secondary to-primary overflow-hidden">
            {/* Subtle Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center space-y-6 mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                        <span className="text-sm font-medium text-accent">Simple Pricing</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary">
                        Choose Your Plan
                    </h2>
                    <p className="text-lg text-muted max-w-2xl mx-auto">
                        Start free and upgrade as you grow. No hidden fees, cancel anytime.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid gap-8 grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto">
                    {plans.map((plan, index) => {
                        const isFeatured = plan.id === "pro" || plan.name.toLowerCase() === "professional";
                        const Icon = icons[plan.id] || Rocket;

                        return (
                            <div
                                key={plan.id}
                                className={`
                                    relative flex flex-col p-8 rounded-2xl border
                                    bg-tertiary/80 backdrop-blur-xl
                                    transition-all duration-500 ease-out
                                    hover:-translate-y-2
                                    ${isFeatured
                                        ? "md:-mt-4 md:mb-4 border-accent/50 shadow-[0_0_40px_rgba(16,185,129,0.15)] hover:shadow-[0_0_60px_rgba(16,185,129,0.25)]"
                                        : "border-border/50 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/10"}
                                `}
                                style={{
                                    animation: `fadeInUp 0.6s ease-out ${index * 150}ms both`
                                }}
                            >
                                {/* Popular Badge */}
                                {isFeatured && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-accent blur-md animate-pulse"></div>
                                            <div className="relative bg-accent text-background px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                                                Most Popular
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Icon */}
                                <div className="mb-6 flex items-center gap-3">
                                    <div
                                        className={`
                                        inline-flex p-3 rounded-xl
                                        ${isFeatured
                                                ? 'bg-accent/20 border-accent/30'
                                                : 'bg-elevated border-border/50'}
                                        border transition-all duration-300
                                    `}
                                    >
                                        <Icon className={`w-6 h-6 ${isFeatured ? 'text-accent' : 'text-accent-light'}`} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-3xl font-bold text-text-primary">
                                        {plan.name}
                                    </h3>
                                </div>

                                {/* Price */}
                                <div className="mb-1">
                                    <span className="text-5xl font-bold bg-gradient-to-br from-text-primary to-accent bg-clip-text text-transparent">
                                        ${plan.price_monthly}
                                    </span>
                                    <span className="text-text-secondary ml-2">/month</span>
                                </div>

                                {/* Subtitle */}
                                <p className="text-sm text-muted mb-8 pb-8 border-b border-border/50">
                                    {plan.description}
                                </p>

                                {/* Features */}
                                <ul className="flex-1 space-y-4 mb-8">
                                    {plan.features?.map((feature: string) => (
                                        <li key={feature} className="flex items-start group">
                                            <div className={`
                                                flex-shrink-0 w-5 h-5 rounded-full mr-3 mt-0.5
                                                flex items-center justify-center
                                                ${isFeatured ? 'bg-accent/20' : 'bg-elevated'}
                                                transition-all duration-300
                                                group-hover:scale-110
                                            `}>
                                                <Check className={`w-3 h-3 ${isFeatured ? 'text-accent' : 'text-accent-light'}`} strokeWidth={3} />
                                            </div>
                                            <span className="text-text-primary text-sm leading-relaxed">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <a
                                    href="#"
                                    className={`
                                        group relative block w-full py-4 rounded-xl font-semibold text-center
                                        overflow-hidden transition-all duration-300
                                        ${isFeatured
                                            ? "bg-accent text-background hover:bg-accent-light shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/40 hover:scale-[1.02]"
                                            : "bg-elevated text-text-primary border border-border/50 hover:border-accent/50 hover:bg-tertiary"}
                                    `}
                                >
                                    <span className="relative z-10">{isFeatured ? "Start 14-Day Trial" : "Start Free"}</span>
                                    {isFeatured && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                                    )}
                                </a>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Note */}
                <div className="text-center mt-16">
                    <p className="text-sm text-muted">
                        All plans include a 14-day money-back guarantee. No questions asked.
                    </p>
                </div>
            </div>
        </section>
    );
}


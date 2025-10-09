"use client";
import { ArrowRight, Play, CheckCircle2, Sparkles } from "lucide-react";

const badges = [
    "AI-assisted interior design",
    "Real-time Collaboration",
    "Unlimited Cloud Storage*",
    "Complete furniture library",
    "Print PDFs to scale",
    "Import and Export DWG/DXF"
];

function HeroSection() {
    return (
        <section
            id="hero"
            className="relative overflow-hidden min-h-screen bg-gradient-to-br from-primary via-secondary to-primary flex items-center px-4 py-20"
        >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Main floating gradient */}
                <div
                    className="absolute w-[150%] h-[150%] bg-[radial-gradient(circle_at_30%_40%,rgba(110,231,183,0.08)_0%,transparent_50%)] animate-float"
                    aria-hidden="true"
                />
                {/* Secondary glow */}
                <div
                    className="absolute w-[120%] h-[120%] bg-[radial-gradient(circle_at_70%_60%,rgba(16,185,129,0.06)_0%,transparent_50%)] animate-float"
                    style={{ animationDelay: '2s', animationDuration: '25s' }}
                    aria-hidden="true"
                />
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 bg-[linear-gradient(rgba(58,65,82,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(58,65,82,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"
                    aria-hidden="true"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Content */}
                    <div className="space-y-8 text-center lg:text-left">
                        {/* Label Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-sm">
                            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                            <span className="text-sm font-medium text-accent">AI-Powered CAD Platform</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                            <span className="text-text-primary">Professional CAD</span>
                            <br />
                            <span className="bg-gradient-to-r from-accent-light via-accent to-accent-dark bg-clip-text text-transparent">
                                Made Simple
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Create floor plans instantly, design with intelligent AI assistance.
                            The industry-leading cloud-based CAD solution.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <a
                                href="/auth/signup"
                                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent-light text-background font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/40 overflow-hidden"
                            >
                                <span className="relative z-10">Get Started for Free</span>
                                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                            </a>

                            <button
                                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-elevated hover:bg-tertiary text-text-primary font-semibold rounded-xl border border-border/50 hover:border-accent/50 transition-all duration-300 hover:scale-105"
                            >
                                <Play className="w-5 h-5 text-accent" />
                                <span>Watch Demo</span>
                            </button>
                        </div>

                        {/* Feature Badges */}
                        <div className="pt-4">
                            <p className="text-sm text-muted mb-4 font-medium">Everything you need:</p>
                            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                {badges.map((badge, index) => (
                                    <div
                                        key={badge}
                                        className="group inline-flex items-center gap-2 bg-tertiary/60 hover:bg-tertiary border border-border/50 hover:border-accent/30 text-text-primary px-4 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                                        style={{
                                            animation: `fadeInUp 0.5s ease-out ${index * 100}ms both`
                                        }}
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" strokeWidth={2.5} />
                                        <span>{badge}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social Proof */}
                        <div className="pt-8 flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start text-sm">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/40 border-2 border-primary flex items-center justify-center text-accent font-bold"
                                    >
                                        {i}
                                    </div>
                                ))}
                            </div>
                            <div className="text-left">
                                <div className="flex items-center gap-1 mb-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg key={star} className="w-4 h-4 text-accent fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-muted">
                                    <span className="text-text-primary font-semibold">5,000+</span> professionals trust us
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Visual/Preview */}
                    <div className="relative hidden lg:block">
                        <div className="relative">
                            {/* Main preview card */}
                            <div className="relative rounded-2xl bg-gradient-to-br from-tertiary/80 to-elevated/60 backdrop-blur-xl border border-accent/20 p-8 shadow-2xl shadow-accent/10">
                                {/* Placeholder for app preview */}
                                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-secondary to-primary border border-border/50 flex items-center justify-center overflow-hidden relative">
                                    {/* Grid pattern */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(110,231,183,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(110,231,183,0.03)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

                                    {/* Animated elements to represent CAD interface */}
                                    <div className="relative z-10 w-full h-full p-8">
                                        <div className="w-full h-full border-2 border-accent/30 rounded-lg border-dashed flex items-center justify-center">
                                            <div className="text-center space-y-4">
                                                <div className="w-16 h-16 mx-auto rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
                                                    <Sparkles className="w-8 h-8 text-accent animate-pulse" />
                                                </div>
                                                <p className="text-text-secondary font-medium">Interactive Preview</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating stats cards */}
                                <div className="absolute -right-4 -top-4 bg-tertiary/90 backdrop-blur-xl border border-accent/30 rounded-xl p-4 shadow-lg animate-float">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-accent" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted">AI Commands</div>
                                            <div className="text-lg font-bold text-text-primary">1000+</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -left-4 -bottom-4 bg-tertiary/90 backdrop-blur-xl border border-accent/30 rounded-xl p-4 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                                            <CheckCircle2 className="w-5 h-5 text-accent" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted">Projects Created</div>
                                            <div className="text-lg font-bold text-text-primary">50K+</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translate(0, 0) rotate(0deg);
                    }
                    33% {
                        transform: translate(30px, -30px) rotate(2deg);
                    }
                    66% {
                        transform: translate(-20px, 20px) rotate(-2deg);
                    }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-float {
                    animation: float 20s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}

export default HeroSection;

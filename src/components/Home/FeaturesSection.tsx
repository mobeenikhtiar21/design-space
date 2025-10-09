"use client";
import {
    Ruler,
    Cpu,
    Archive,
    Hammer,
    Package,
    Cloud,
    ArrowRight,
    Zap
} from "lucide-react";

const features = [
    {
        name: "Precision Drawing Tools",
        description:
            "Rapidly draw polygonal spaces to scale and insert openings with ease. Autocad-level features without the learning curve.",
        icon: Ruler
    },
    {
        name: "AI Assisted Designing",
        description:
            "Natural language commands make creating and editing simple and rapid. Work faster with intelligent assistance.",
        icon: Cpu,
        featured: true
    },
    {
        name: "Comprehensive Furniture Library",
        description:
            "Extensive library of commercial and residential furniture and fixtures with automatic labeling. Drag-and-drop placement with real-time property editing.",
        icon: Archive
    },
    {
        name: "Intelligent Object Creation",
        description:
            "Advanced wall creation. Add doors and windows with precise placement and dimensions. Custom furniture creation.",
        icon: Hammer
    },
    {
        name: "Professional Import & Export",
        description:
            "Import and Export your designs as DWG/DXF for seamless CAD integration or SVG for web and print.",
        icon: Package
    },
    {
        name: "Cloud Storage",
        description:
            "Save your projects securely in the cloud. Access your designs from anywhere and collaborate with your team.",
        icon: Cloud
    }
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-gradient-to-b from-primary via-secondary to-primary relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center space-y-6 mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                        <Zap className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-accent">Powerful Features</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary max-w-4xl mx-auto leading-tight">
                        Professional Grade CAD
                        <span className="block mt-2 bg-gradient-to-r from-accent-light via-accent to-accent-dark bg-clip-text text-transparent">
                            Meets Intuitive Design
                        </span>
                    </h2>

                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Intuitive, AI-assisted tools that take you to the next level without the complexity
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map(({ name, description, icon: Icon, featured }, index) => (
                        <div
                            key={name}
                            className={`
                                group relative
                                p-8 rounded-2xl
                                backdrop-blur-md
                                border 
                                transition-all duration-500 ease-out
                                hover:-translate-y-2
                                hover:shadow-2xl
                                ${featured
                                    ? 'bg-gradient-to-br from-accent/10 via-tertiary/90 to-accent/5 border-accent/40 hover:border-accent/60 shadow-xl shadow-accent/10 hover:shadow-accent/20'
                                    : 'bg-tertiary/60 border-border hover:border-accent/30 hover:bg-tertiary/80 hover:shadow-accent/10'
                                }
                            `}
                            style={{
                                animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`
                            }}
                        >
                            {/* Shine effect on hover */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            {/* Featured Badge */}
                            {featured && (
                                <div className="absolute -top-3 -right-3 z-20">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-accent/50 blur-md animate-pulse"></div>
                                        <div className="relative bg-accent text-background px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                                            <Cpu className="w-3 h-3" />
                                            AI Powered
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="relative z-10">
                                {/* Icon */}
                                <div className="mb-6">
                                    <div className={`
                                        inline-flex p-4 rounded-xl
                                        bg-gradient-to-br from-elevated to-tertiary
                                        border border-border
                                        group-hover:scale-110 group-hover:rotate-3
                                        group-hover:border-accent/30
                                        transition-all duration-500
                                        shadow-lg
                                        ${featured ? 'bg-accent/10 border-accent/30' : ''}
                                    `}>
                                        <Icon
                                            className={`h-7 w-7 transition-all duration-300 ${featured
                                                    ? 'text-accent'
                                                    : 'text-accent-light group-hover:text-accent'
                                                }`}
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-accent-light transition-colors duration-300">
                                    {name}
                                </h3>

                                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                                    {description}
                                </p>

                                {/* Learn More Link */}
                                <div className="flex items-center gap-2 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                    <span>Learn more</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                            </div>

                            {/* Bottom accent line */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl"></div>

                            {/* Glow effect */}
                            {featured && (
                                <div className="absolute inset-0 -z-10 bg-accent/5 rounded-2xl blur-xl group-hover:bg-accent/10 transition-colors duration-500"></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-20">
                    <div className="relative group max-w-4xl mx-auto p-8 md:p-10 rounded-2xl bg-gradient-to-br from-accent/10 via-tertiary/90 to-accent/5 border border-accent/30 overflow-hidden">
                        {/* Background glow */}
                        <div className="absolute inset-0 bg-accent/5 blur-2xl group-hover:bg-accent/10 transition-colors duration-500"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex-1 text-center md:text-left space-y-2">
                                <h3 className="text-2xl md:text-3xl font-bold text-text-primary">
                                    Ready to experience the future of CAD?
                                </h3>
                                <p className="text-text-secondary">
                                    Start your free trial today. No credit card required.
                                </p>
                            </div>

                            <a
                                href="#pricing"
                                className="group/btn relative overflow-hidden flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-light text-background font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/50 whitespace-nowrap"
                            >
                                <span className="relative z-10">Get Started Free</span>
                                <ArrowRight className="relative z-10 w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />

                                {/* Button shine effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </section>
    );
}

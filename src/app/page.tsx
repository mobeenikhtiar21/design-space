import Footer from "@/components/Footer";
import { SiteHeader } from "@/components/Header/SiteHeader";
import Features from "@/components/Home/FeaturesSection";
import HeroSection from "@/components/Home/HeroSection";
import PricingSection from "@/components/Home/PricingSection";

export default function Home() {
    return (
        <>
            <SiteHeader />
            <HeroSection />
            <Features />
            <PricingSection />
            <Footer />
        </>
    );
}

import Hero from "../components/Hero";
import ServicesSection from "../components/ServicesSection";

export default function HomePage() {
    return (
        <>
            <div className="px-10 pt-20 max-sm:px-5">
                <Hero />
                <ServicesSection />
            </div>
        </>
    );
}

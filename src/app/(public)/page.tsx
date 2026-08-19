import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Hero } from "@/components/public/home/Hero";
import { QuickQuoteForm } from "@/components/public/home/QuickQuoteForm";
import { WhyChooseUs } from "@/components/public/home/WhyChooseUs";
import { ServicesPreview } from "@/components/public/home/ServicesPreview";
import { FleetPreview } from "@/components/public/home/FleetPreview";
import { HowItWorks } from "@/components/public/home/HowItWorks";
import { TrackingCta } from "@/components/public/home/TrackingCta";
import { ServiceAreas } from "@/components/public/home/ServiceAreas";
import { Testimonials } from "@/components/public/home/Testimonials";
import { CtaSection } from "@/components/public/CtaSection";

export const metadata: Metadata = {
    title: "Reliable Freight & Logistics",
    description:
        "Full truckload, part load, warehousing, and express delivery across 50+ cities. Get an instant quote, track your shipment, and ship with a partner you can trust.",
    openGraph: {
        title: "Transport Co. | Reliable Freight & Logistics",
        description:
            "Full truckload, part load, warehousing, and express delivery across 50+ cities. Get an instant quote and ship with a partner you can trust.",
        type: "website",
    },
};

export default function HomePage() {
    return (
        <>
            <Hero />

            {/* Quick Quote widget — floats up over the hero's bottom edge */}
            <div className="relative bg-white pb-14 md:pb-20">
                <Container>
                    <QuickQuoteForm />
                </Container>
            </div>

            <WhyChooseUs />
            <ServicesPreview />
            <FleetPreview />
            <HowItWorks />
            <TrackingCta />
            <ServiceAreas />
            <Testimonials />

            <CtaSection
                title="Ready to move your freight?"
                description="Get an instant quote, or reach out directly — we typically respond within one business day."
                showCallAction={true}
                showWhatsAppAction={true}
            />
        </>
    );
}
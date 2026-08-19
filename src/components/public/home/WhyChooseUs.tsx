import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Card } from "@/components/ui/Card";
import { getIcon } from "@/components/public/home/icon-map";
import { whyChooseUs } from "@/lib/placeholder-data";

export function WhyChooseUs() {
  return (
    <Section background="white" spacing="lg">
      <SectionHeading
        eyebrow="Why Choose Us"
        title="Built for businesses that can't afford delays"
        description="Every shipment is handled with the same standard: on time, communicated clearly, and delivered safely."
      />

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {whyChooseUs.map((item) => {
          const Icon = getIcon(item.icon);
          return (
            <Card key={item.title} padding="md" className="text-left">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-h4 font-semibold text-neutral-900">{item.title}</h3>
              <p className="mt-1.5 text-body-sm text-neutral-500">{item.description}</p>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { getIcon } from "@/components/public/home/icon-map";
import { howItWorks } from "@/lib/placeholder-data";

export function HowItWorks() {
  return (
    <Section background="muted" spacing="lg">
      <SectionHeading
        eyebrow="How It Works"
        title="From quote to delivery in four steps"
        description="A straightforward process so you always know what happens next."
      />

      <div className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {/* Connector line — desktop only, sits behind the step circles */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-7 hidden border-t-2 border-dashed border-accent-300 lg:block"
        />

        {howItWorks.map((item) => {
          const Icon = getIcon(item.icon);
          return (
            <div key={item.step} className="relative text-center">
              <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-neutral-50 bg-brand-700 text-white shadow-card">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="mt-4 text-caption font-semibold uppercase tracking-wide text-accent-600">
                Step {item.step}
              </p>
              <h3 className="mt-1 text-h4 font-semibold text-neutral-900">{item.title}</h3>
              <p className="mt-1.5 text-body-sm text-neutral-500">{item.description}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
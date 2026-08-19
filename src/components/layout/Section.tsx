import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

type Background = "white" | "muted" | "brand";
type Spacing = "sm" | "md" | "lg";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  background?: Background;
  /** Vertical padding: sm ~ compact sections, lg ~ hero/major sections. */
  spacing?: Spacing;
  containerClassName?: string;
}

const backgroundClasses: Record<Background, string> = {
  white: "bg-white",
  muted: "bg-neutral-50",
  brand: "bg-brand-900 text-white",
};

const spacingClasses: Record<Spacing, string> = {
  sm: "py-10 md:py-14",
  md: "py-14 md:py-20",
  lg: "py-20 md:py-28",
};

/**
 * Wraps page sections with consistent vertical spacing + background.
 * Use instead of hand-writing py-* / bg-* on every <section>.
 */
export function Section({
  background = "white",
  spacing = "md",
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn(backgroundClasses[background], spacingClasses[spacing], className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
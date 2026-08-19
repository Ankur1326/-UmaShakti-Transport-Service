import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Consistent "eyebrow + heading + description" block used at the top of
 * most homepage sections (Why Choose Us, Services, Fleet, etc.) so the
 * rhythm stays identical without repeating markup on every section.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={cn(eyebrow ? "mt-3" : undefined)}>{title}</h2>
      {description && <p className="mt-3 text-lead text-neutral-600">{description}</p>}
    </div>
  );
}
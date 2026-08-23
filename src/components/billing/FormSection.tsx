import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  /** Small action rendered on the right of the header, e.g. a toggle switch. */
  headerAction?: React.ReactNode;
}

export function FormSection({ title, description, children, className, headerAction }: FormSectionProps) {
  return (
    <Card padding="xs" className={cn("scroll-mt-20 rounded-lg relative", className)}>
      <CardHeader className="mb-2 flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="text-[11.5px] font-bold uppercase tracking-[0.03em] text-brand-800">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="mt-0 text-[10px] leading-snug">{description}</CardDescription>
          )}
        </div>
        {headerAction}
      </CardHeader>
      {children}
    </Card>
  );
}
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
    <Card padding="sm" className={cn("scroll-mt-20 relative rounded-xl border-slate-200 shadow-sm", className)}>
      <CardHeader className="mb-3 flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="text-sm font-bold text-slate-900">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="mt-1 text-xs leading-snug">{description}</CardDescription>
          )}
        </div>
        {headerAction}
      </CardHeader>
      {children}
    </Card>
  );
}
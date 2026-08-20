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
    <Card className={cn("scroll-mt-20", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {headerAction}
      </CardHeader>
      {children}
    </Card>
  );
}
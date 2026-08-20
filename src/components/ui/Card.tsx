import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds hover elevation + border color shift — use for clickable cards */
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-6",
  lg: "p-8",
};

export function Card({ className, interactive = false, padding = "sm", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "border border-neutral-200 bg-white",
        paddingClasses[padding],
        interactive && "transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-card-hover",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-[15px] font-semibold text-neutral-900", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-[12px] text-neutral-500", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center gap-3", className)} {...props} />;
}
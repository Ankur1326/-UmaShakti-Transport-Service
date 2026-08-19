import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Centers content and applies consistent horizontal padding + max-width
 * across the site. Use this instead of repeating max-w/mx-auto everywhere.
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
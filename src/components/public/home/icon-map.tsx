import {
  ShieldCheck,
  Clock,
  UserCheck,
  Lock,
  MessageSquare,
  Truck,
  PackageSearch,
  Warehouse,
  Zap,
  Map,
  PackageCheck,
  FileText,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  ShieldCheck,
  Clock,
  UserCheck,
  Lock,
  MessageSquare,
  Truck,
  PackageSearch,
  Warehouse,
  Zap,
  Map,
  PackageCheck,
  FileText,
  CheckCircle2,
};

/** Resolves an icon name string (from data files) to its lucide component. */
export function getIcon(name: string): LucideIcon {
  return ICONS[name] ?? Truck;
}
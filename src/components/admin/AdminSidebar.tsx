import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  CalendarCheck,
  Users,
  Truck,
  UserRound,
  Package,
  Wallet,
  FileEdit,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/quote-requests", label: "Quote Requests", icon: FileText },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/vehicles", label: "Vehicles", icon: Truck },
  { href: "/admin/drivers", label: "Drivers", icon: UserRound },
  { href: "/admin/shipments", label: "Shipments", icon: Package },
  { href: "/admin/payments", label: "Payments", icon: Wallet },
  { href: "/admin/content", label: "Website Content", icon: FileEdit },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

/**
 * Static sidebar placeholder. Active-link highlighting, collapsing, and
 * role-based visibility will be added when the admin panel is built out.
 */
export function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-neutral-200 bg-white md:block">
      <div className="flex h-16 items-center px-6 font-semibold text-brand-800">
        Transport Co. Admin
      </div>
      <nav className="space-y-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
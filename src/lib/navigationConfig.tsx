import React from "react";
import {
  LuCalendarCheck,
  LuCircleUserRound,
  LuFilePlus2,
  LuLayoutDashboard,
  LuReceiptText,
  LuSend,
  LuUsersRound,
} from "react-icons/lu";

// A single sidebar menu item
export interface NavItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  route: string;
  childItems?: NavItem[];
}

// A group of related menu items
export interface NavigationSection {
  name: string;
  items: NavItem[];
}

// Navigation configuration
export interface NavigationConfig {
  sections: NavigationSection[];
}

// Admin sidebar navigation
export const NAVIGATION_CONFIG: Record<string, NavigationConfig> = {
  admin: {
    sections: [
      // ─────────────────────────────────────────
      // General
      // ─────────────────────────────────────────
      {
        name: "",
        items: [
          {
            id: "dashboard",
            title: "Dashboard",
            icon: <LuLayoutDashboard className="h-[18px] w-[18px]" />,
            route: "/admin/dashboard",
          },
        ],
      },

      // ─────────────────────────────────────────
      // Operations
      // ─────────────────────────────────────────
      {
        name: "Bookings",
        items: [
          {
            id: "new-consignment-entry",
            title: "New Consignment",
            icon: <LuFilePlus2 className="h-[18px] w-[18px]" />,
            route: "/admin/consignment/new",
          },
          {
            id: "all-consignments",
            title: "ALL CNS",
            icon: <LuCalendarCheck className="h-[18px] w-[18px]" />,
            route: "/admin/bookings",
          },
        ],
      },

      // ─────────────────────────────────────────
      // Billing
      // ─────────────────────────────────────────
      {
        name: "Billing",
        items: [
          {
            id: "create-bill",
            title: "Create Bill",
            icon: <LuFilePlus2 className="h-[18px] w-[18px]" />,
            route: "/admin/billing/new",
          },
          {
            id: "billings",
            title: "All Bills",
            icon: <LuReceiptText className="h-[18px] w-[18px]" />,
            route: "/admin/billings",
          },
        ],
      },

      // ─────────────────────────────────────────
      // Parties
      // ─────────────────────────────────────────
      {
        name: "Customers",
        items: [
          {
            id: "consigners",
            title: "Consigners",
            icon: <LuSend className="h-[18px] w-[18px]" />,
            route: "/admin/consigners",
          },
          {
            id: "consignees",
            title: "Consignees",
            icon: <LuUsersRound className="h-[18px] w-[18px]" />,
            route: "/admin/consignees",
          },
        ],
      },

      // ─────────────────────────────────────────
      // Account
      // ─────────────────────────────────────────
      {
        name: "Account",
        items: [
          {
            id: "profile",
            title: "My Profile",
            icon: <LuCircleUserRound className="h-[18px] w-[18px]" />,
            route: "/user/profile",
          },
        ],
      },
    ],
  },
};

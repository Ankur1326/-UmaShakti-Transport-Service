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
            icon: (
              <LuLayoutDashboard className="h-5 w-5 text-[#2E8B57]" />
            ),
            route: "/admin/dashboard",
          },
        ],
      },

      // ─────────────────────────────────────────
      // Operations
      // ─────────────────────────────────────────
      {
        name: "Operations",
        items: [
          {
            id: "bookings",
            title: "Bookings",
            icon: (
              <LuCalendarCheck className="h-5 w-5 text-[#3B82F6]" />
            ),
            route: "/admin/bookings",
          },
          {
            id: "new-consignment-entry",
            title: "New Consignment",
            icon: (
              <LuFilePlus2 className="h-5 w-5 text-[#0EA5A4]" />
            ),
            route: "/admin/consignment/new",
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
            id: "billings",
            title: "All Bills",
            icon: (
              <LuReceiptText className="h-5 w-5 text-[#F59E0B]" />
            ),
            route: "/admin/billings",
          },
          {
            id: "create-bill",
            title: "Create Bill",
            icon: (
              <LuFilePlus2 className="h-5 w-5 text-[#F97316]" />
            ),
            route: "/admin/billing/new",
          },
        ],
      },

      // ─────────────────────────────────────────
      // Parties
      // ─────────────────────────────────────────
      {
        name: "Parties",
        items: [
          {
            id: "consigners",
            title: "Consigners",
            icon: (
              <LuSend className="h-5 w-5 text-[#8B5CF6]" />
            ),
            route: "/admin/consigners",
          },
          {
            id: "consignees",
            title: "Consignees",
            icon: (
              <LuUsersRound className="h-5 w-5 text-[#A855F7]" />
            ),
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
            icon: (
              <LuCircleUserRound className="h-5 w-5 text-[#2E8B57]" />
            ),
            route: "/user/profile",
          },
        ],
      },
    ],
  },
};

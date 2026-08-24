// app/(authenticated)/layout.tsx
"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import 'react-loading-skeleton/dist/skeleton.css';
import 'nprogress/nprogress.css';
import '../globals.css';
import { useSession } from "next-auth/react";
import type { DefaultSession } from "next-auth";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
// import ToastContainer from "@/components/notifications/ToastContainer";
import Navbar from "@/components/Navbar";
// import { NotificationProvider } from "@/context/NotificationContext";
import { Shield, GraduationCap, BookOpen } from 'lucide-react';

type UserRole = 'admin' | 'superAdmin' | 'customer';

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role?: UserRole;
    };
  }
}

// Configure NProgress
interface RoleBadgeConfig {
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  className: string;
}


const ROLE_BADGE: Record<string, RoleBadgeConfig> = {
  admin: {
    label: 'Admin',
    Icon: Shield,
    className:
      'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700',
  },
  superAdmin: {
    label: 'SuperAdmin',
    Icon: BookOpen,
    className:
      'text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700',
  },
  customer: {
    label: 'SuperAdmin',
    Icon: GraduationCap,
    className:
      'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700',
  },
};

// ─── RoleBadge component ───────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
  const config = ROLE_BADGE[role];
  if (!config) return null;
  const { label, Icon, className } = config;
  return (
    <div
      className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold ${className}`}
    >
      <Icon size={13} aria-hidden="true" />
      {label}
    </div>
  );
}

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState("");
  const userRole: UserRole = session?.user?.role ?? 'admin';

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = (menu: string) => {
    if (dropdownOpen === menu) {
      setDropdownOpen("");
    } else {
      setDropdownOpen(menu);
    }
  };

  // console.log("session :::: ", session)
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen("");
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    // <NotificationProvider>
    <div className="min-h-screen flex bg-[#f8faf9] dark:bg-gray-900 print:block">
      {/* Sidebar - Show sidebar for authenticated users */}
      {session?.user ? (
        <div className="print:hidden">
          <Sidebar isSidebarOpen={isSidebarOpen} userRole={userRole} />
        </div>
      ) : (
        ""
      )}

      {/* Content Area */}
      <div className="flex-1 transition-all duration-300 md:pl-64 print:pl-0">
        <header className="fixed inset-x-0 top-0 z-10 flex h-16 items-center justify-between border-b border-gray-300 bg-white px-4 dark:border-gray-700 dark:bg-gray-800 md:pl-64 print:hidden">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              type="button"
              className="
                    text-[#66B788] hover:text-[#4a8f65] transition-colors
                    p-2 rounded-md md:hidden
                    outline-none focus-visible:ring-2 focus-visible:ring-[#66B788]
                  "
              onClick={toggleSidebar}
              aria-label="Toggle navigation menu"
              aria-expanded={isSidebarOpen}
              aria-controls="main-sidebar"
            >
              <HiOutlineMenuAlt2 className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* FIX: Role badge with icon — not colour-only (WCAG 1.4.1 compliant) */}
            {/* <RoleBadge role={userRole} /> */}
          </div>

          {/* Enhanced Navbar with notifications */}
          <div className="ml-auto flex items-center space-x-4">
            <Navbar />
          </div>
        </header>

        {/* Main content - Full width container */}
        <main className="min-h-screen bg-[#f8faf9] px-2 py-2 pt-20 transition-all duration-300 dark:bg-gray-900 print:pt-0">
          {children}
        </main>
      </div>

      {/* Overlay for small screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Toast Notifications */}
      {/* <ToastContainer /> */}
    </div>
    // {/* </NotificationProvider> */}
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayoutContent>{children}</RootLayoutContent>;
}
// app/(authenticated)/layout.tsx
"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import 'react-loading-skeleton/dist/skeleton.css';
import 'nprogress/nprogress.css';
import '../globals.css';
import { useSession } from "next-auth/react";
import type { DefaultSession } from "next-auth";

type UserRole = 'admin' | 'superAdmin' | 'customer';

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role?: UserRole;
    };
  }
}

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const userRole: UserRole = session?.user?.role ?? 'admin';

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-brand-950 print:block">
      {session?.user ? (
        <div className="print:hidden">
          <Sidebar isSidebarOpen={isSidebarOpen} userRole={userRole} />
        </div>
      ) : null}

      <div className="flex-1 transition-all duration-300 md:pl-64 print:pl-0">
        {session?.user && (
          <AdminHeader
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
            userRole={userRole}
          />
        )}

        <main className="min-h-screen px-3 py-3 pt-20 transition-all duration-300 print:pt-0">
          {children}
        </main>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-brand-950/40 backdrop-blur-[2px] transition-opacity duration-300 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayoutContent>{children}</RootLayoutContent>;
}

// components/UpdatedNavbar.tsx
"use client";
import React from "react";
import ProfileMenu from "@/components/ProfileMenu";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Loader2 } from "lucide-react";
import ThemeSelector from "@/components/ThemeSelector";
import FullScreenButton from "@/components/FullScreenButton";
import { useSession } from "next-auth/react";

// Enhanced Navbar component with notification system
function Navbar() {
    const isLoading = useSelector((state: RootState) => state.loading.isLoading);
    const { data: session } = useSession<any>();
    const userRole = session?.user?.role || "admin";

    return (
        <nav className="flex items-center gap-4">
            <div className="relative flex items-center">
                {isLoading && 
                    <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 text-[#66B788] animate-spin" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Loading...
                        </span>
                    </div>}
            </div>

            <div className="flex items-center space-x-3">
                <FullScreenButton />

                <div className="h-5 w-px bg-gray-200 dark:bg-gray-700"></div>
                <ThemeSelector />
                {/* <div className="h-5 w-px bg-gray-200 dark:bg-gray-700"></div> */}
                <div className="h-5 w-px bg-gray-200 dark:bg-gray-700"></div>
                <ProfileMenu />
            </div>
        </nav>
    )
}

export default Navbar;
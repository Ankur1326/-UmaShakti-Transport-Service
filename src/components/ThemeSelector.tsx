'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect, useRef, useCallback } from 'react';
import { HiOutlineSun, HiOutlineMoon, HiOutlineComputerDesktop } from "react-icons/hi2";
import { adminDropdownClass, adminToolbarButtonClass } from '@/components/admin/admin-toolbar-styles';
import { cn } from '@/lib/utils';

const ThemeSelector = () => {
    const { theme, setTheme } = useTheme();
    const menuRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDropdownToggle = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = useCallback(() => {
        setIsOpen(false);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                closeMenu();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [closeMenu]);

    if (!mounted) return null;

    const menuItemClass = (active: boolean) =>
        cn(
            'flex w-full items-center px-4 py-2.5 text-body-sm text-neutral-700 dark:text-neutral-200',
            'transition-colors hover:bg-neutral-100 dark:hover:bg-brand-800',
            active && 'bg-neutral-100 font-medium dark:bg-brand-800'
        );

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={handleDropdownToggle}
                className={adminToolbarButtonClass}
                aria-label="Change theme"
                aria-expanded={isOpen}
            >
                {theme === 'light' && <HiOutlineSun className="h-5 w-5" />}
                {theme === 'dark' && <HiOutlineMoon className="h-5 w-5" />}
                {theme === 'system' && <HiOutlineComputerDesktop className="h-5 w-5" />}
            </button>

            {isOpen && (
                <div
                    ref={menuRef}
                    className={cn(adminDropdownClass, 'w-40')}
                    style={{ zIndex: 1000 }}
                >
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        <button
                            className={menuItemClass(theme === 'light')}
                            onClick={() => {
                                setTheme('light');
                                setIsOpen(false);
                            }}
                        >
                            <HiOutlineSun className="h-5 w-5 text-amber-500" />
                            <span className="ml-3">Light</span>
                        </button>

                        <button
                            className={menuItemClass(theme === 'dark')}
                            onClick={() => {
                                setTheme('dark');
                                setIsOpen(false);
                            }}
                        >
                            <HiOutlineMoon className="h-5 w-5 text-indigo-400" />
                            <span className="ml-3">Dark</span>
                        </button>

                        <button
                            className={menuItemClass(theme === 'system')}
                            onClick={() => {
                                setTheme('system');
                                setIsOpen(false);
                            }}
                        >
                            <HiOutlineComputerDesktop className="h-5 w-5 text-accent-500" />
                            <span className="ml-3">System</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeSelector;

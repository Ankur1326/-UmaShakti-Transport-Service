'use client'
import { useTheme } from 'next-themes';
import { useState, useEffect, useRef, useCallback } from 'react';
import { HiOutlineSun, HiOutlineMoon, HiOutlineComputerDesktop } from "react-icons/hi2";

const ThemeSelector = () => {
    const { theme, setTheme } = useTheme();
    const menuRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Handle hydration issues
    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle click to toggle dropdown visibility
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

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    onClick={handleDropdownToggle}
                    className="flex items-center justify-center h-9 w-9 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Change theme"
                >
                    {theme === 'light' && <HiOutlineSun className="w-5 h-5 text-[#66B788]" />}
                    {theme === 'dark' && <HiOutlineMoon className="w-5 h-5 text-[#66B788]" />}
                    {theme === 'system' && <HiOutlineComputerDesktop className="w-5 h-5 text-[#66B788]" />}
                </button>
            </div>

            {isOpen && (
                <div 
                    ref={menuRef} 
                    className="absolute right-0 mt-2 w-36 rounded-xl shadow-lg bg-white dark:bg-gray-800 ring-1 ring-gray-100 dark:ring-gray-700 border border-gray-100 dark:border-gray-700 overflow-hidden"
                    style={{zIndex: 1000}}
                >
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <button
                            className={`flex items-center px-4 py-2.5 text-sm w-full text-gray-700 dark:text-gray-200 ${theme === 'light' ? 'bg-gray-100 dark:bg-gray-700' : ''} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                            onClick={() => {
                                setTheme('light');
                                setIsOpen(false);
                            }}
                        >
                            <HiOutlineSun className="w-5 h-5 text-amber-500" />
                            <span className="ml-3 font-medium">Light</span>
                        </button>

                        <button
                            className={`flex items-center px-4 py-2.5 text-sm w-full text-gray-700 dark:text-gray-200 ${theme === 'dark' ? 'bg-gray-100 dark:bg-gray-700' : ''} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                            onClick={() => {
                                setTheme('dark');
                                setIsOpen(false);
                            }}
                        >
                            <HiOutlineMoon className="w-5 h-5 text-indigo-500" />
                            <span className="ml-3 font-medium">Dark</span>
                        </button>

                        <button
                            className={`flex items-center px-4 py-2.5 text-sm w-full text-gray-700 dark:text-gray-200 ${theme === 'system' ? 'bg-gray-100 dark:bg-gray-700' : ''} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                            onClick={() => {
                                setTheme('system');
                                setIsOpen(false);
                            }}
                        >
                            <HiOutlineComputerDesktop className="w-5 h-5 text-[#66B788]" />
                            <span className="ml-3 font-medium">System</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeSelector;
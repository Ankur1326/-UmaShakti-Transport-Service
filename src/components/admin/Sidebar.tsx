'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { NAVIGATION_CONFIG, NavigationConfig } from '@/lib/navigationConfig';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type UserRole = 'admin' | 'superAdmin' | 'customer';

interface SidebarProps {
    isSidebarOpen: boolean;
    userRole: UserRole;
    onCollapsedChange?: (collapsed: boolean) => void;
}

export default function Sidebar({
    isSidebarOpen,
    userRole = 'admin',
}: SidebarProps) {
    const router = useRouter();
    const currentRoute = usePathname();

    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    const sidebarConfig: NavigationConfig =
        NAVIGATION_CONFIG[userRole] || NAVIGATION_CONFIG.admin;

    useEffect(() => {
        if (!sidebarConfig?.sections) return;
        const autoExpand: Record<string, boolean> = {};
        sidebarConfig.sections.forEach((section) => {
            section.items.forEach((item) => {
                if (item.childItems?.some((c) => c.route === currentRoute)) {
                    autoExpand[item.route] = true;
                }
            });
        });
        setExpandedSections((prev) => ({ ...prev, ...autoExpand }));
    }, [currentRoute, sidebarConfig]);

    const isRouteActive = (route: string) => currentRoute === route;

    const navigateTo = (path: string) => {
        router.push(path);
    };

    const toggleSection = (clickedId: string) => {
        setExpandedSections((prev) => {
            const next: Record<string, boolean> = {};
            Object.keys(prev).forEach((k) => {
                next[k] = false;
            });
            sidebarConfig.sections?.forEach((section) => {
                section.items.forEach((item) => {
                    if (
                        item.id !== clickedId &&
                        item.childItems?.some((c) => c.route === currentRoute)
                    ) {
                        next[item.route] = true;
                    }
                });
            });
            next[clickedId] = !prev[clickedId];
            return next;
        });
    };

    const renderSectionDivider = (name: string) => {
        if (!name) return null;
        return (
            <div className="flex items-center gap-2 px-4 pb-1 pt-5">
                <h3 className="whitespace-nowrap text-overline font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                    {name}
                </h3>
                <span className="h-px flex-1 bg-neutral-200 dark:bg-brand-800" aria-hidden="true" />
            </div>
        );
    };

    const renderNavItem = (item: (typeof sidebarConfig.sections)[0]['items'][0]) => {
        const hasChildren = item.childItems && item.childItems.length > 0;
        const isActive =
            isRouteActive(item.route) ||
            item.childItems?.some((child) => isRouteActive(child.route));
        const isExpanded = expandedSections[item.route];

        return (
            <div key={item.route} className="relative mb-0.5 px-2">
                <button
                    type="button"
                    onClick={() => (hasChildren ? toggleSection(item.route) : navigateTo(item.route))}
                    aria-current={isActive && !hasChildren ? 'page' : undefined}
                    aria-expanded={hasChildren ? isExpanded : undefined}
                    aria-controls={hasChildren ? `section-${item.route}` : undefined}
                    className={cn(
                        'group relative flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5',
                        'text-body-sm transition-all duration-150 outline-none',
                        'focus-visible:ring-2 focus-visible:ring-accent-500/40 focus-visible:ring-offset-2',
                        'dark:focus-visible:ring-offset-brand-950',
                        isActive
                            ? 'bg-brand-900/[0.06] font-semibold text-brand-900 dark:bg-accent-500/10 dark:text-accent-300'
                            : 'font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-brand-900/60'
                    )}
                >
                    {isActive && (
                        <span
                            aria-hidden="true"
                            className="absolute bottom-2 left-0 top-2 w-1 rounded-r-sm bg-accent-500"
                            style={{ clipPath: 'polygon(0 0, 100% 12%, 100% 88%, 0 100%)' }}
                        />
                    )}

                    <span
                        className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors',
                            isActive
                                ? 'bg-accent-500/15 text-accent-600 dark:bg-accent-500/20 dark:text-accent-400'
                                : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200/80 dark:bg-brand-900 dark:text-neutral-400 dark:group-hover:bg-brand-800'
                        )}
                        aria-hidden="true"
                    >
                        {item.icon}
                    </span>

                    <span className="min-w-0 flex-1 truncate text-left leading-none">
                        {item.title}
                    </span>

                    {hasChildren && (
                        <FaAngleDown
                            aria-hidden="true"
                            className={cn(
                                'shrink-0 text-neutral-400 transition-transform duration-200 dark:text-neutral-500',
                                isExpanded && 'rotate-180'
                            )}
                            size={12}
                        />
                    )}
                </button>

                {hasChildren && (
                    <div
                        id={`section-${item.route}`}
                        aria-hidden={!isExpanded}
                        className={cn(
                            'overflow-hidden transition-all duration-200 ease-in-out',
                            isExpanded ? 'mt-0.5 max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        )}
                    >
                        <div className="ml-6 space-y-0.5 border-l border-neutral-200 py-1 pl-3 dark:border-brand-800">
                            {item.childItems!.map((child) => {
                                const childActive = isRouteActive(child.route);

                                return (
                                    <button
                                        key={child.route}
                                        type="button"
                                        onClick={() => navigateTo(child.route)}
                                        aria-current={childActive ? 'page' : undefined}
                                        className={cn(
                                            'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-body-sm',
                                            'transition-all duration-150 outline-none',
                                            'focus-visible:ring-2 focus-visible:ring-accent-500/40',
                                            childActive
                                                ? 'bg-brand-900 font-medium text-white dark:bg-accent-600'
                                                : 'text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-brand-900/60'
                                        )}
                                    >
                                        <span className="shrink-0" aria-hidden="true">
                                            {child.icon}
                                        </span>
                                        <span>{child.title}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <aside
            id="main-sidebar"
            role="navigation"
            aria-label="Main navigation"
            className={cn(
                'fixed z-40 flex h-screen w-64 flex-col overflow-hidden',
                'border-r border-neutral-200/80 bg-white dark:border-brand-800 dark:bg-brand-950',
                'transition-transform duration-300 ease-out',
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            )}
        >
            {/* Brand header — matches transport company identity */}
            <div className="relative shrink-0 overflow-hidden bg-brand-950">
                <div
                    aria-hidden="true"
                    className="absolute right-0 top-0 h-full w-12 bg-accent-500"
                    style={{ clipPath: 'polygon(55% 0, 100% 0, 45% 100%, 0 100%)' }}
                />

                <div className="relative flex items-center gap-3 px-4 py-2.5">
                    <span className="flex shrink-0 items-center justify-center rounded-md bg-white p-1 shadow-sm">
                        <Image src="/media/UTS-logo.png" alt="UTS" width={36} height={36} priority />
                    </span>
                    <div className="min-w-0">
                        <div className="text-body-sm font-bold leading-tight tracking-tight text-white">
                            Umashakti
                        </div>
                        <div className="text-overline font-semibold uppercase tracking-[0.18em] text-accent-300">
                            Transport
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-0 overflow-y-auto overflow-x-hidden py-3">
                {sidebarConfig?.sections?.map((section, index) => (
                    <div key={index}>
                        {renderSectionDivider(section.name)}
                        {section.items.map((item) => renderNavItem(item))}
                    </div>
                ))}
            </nav>

            {/* Footer tagline */}
            <div className="shrink-0 border-t border-neutral-200 px-4 py-3 dark:border-brand-800">
                <p className="text-caption leading-snug text-neutral-400 dark:text-neutral-500">
                    Reliable freight & logistics
                </p>
            </div>
        </aside>
    );
}

'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaAngleDown } from 'react-icons/fa';
import { NAVIGATION_CONFIG, NavItem, NavigationConfig } from '@/lib/navigationConfig';
import Image from 'next/image';
import { Calendar, Shield, GraduationCap, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';

type UserRole = 'admin' | 'superAdmin' | 'customer';

interface SidebarProps {
    isSidebarOpen: boolean;
    userRole: UserRole;
    onCollapsedChange?: (collapsed: boolean) => void;
}

// ─── Role Themes ──────────────────────────────────────────────────────────────
// FIX: Each role now has a distinct visual identity instead of all sharing the
// same green. This gives users immediate spatial context on which role they are in.

interface RoleTheme {
    // Sidebar header accent band
    headerAccent: string;
    // Active nav item styles
    activeBg: string;
    activeText: string;
    activeBorder: string;
    // Hover styles
    hoverBg: string;
    // Child item active bg
    childActiveBg: string;
    // Section label colour
    sectionColor: string;
    // Role pill badge
    roleBadgeBg: string;
    roleBadgeText: string;
    roleBadgeBorder: string;
    // Role icon
    RoleIcon: React.ComponentType<{ size?: number; className?: string }>;
    roleLabel: string;
}

const ROLE_THEMES: Record<UserRole, RoleTheme> = {
    admin: {
        headerAccent: 'bg-[#FCC605] dark:bg-[#FCC605]',
        activeBg: 'bg-red-50 dark:bg-red-900/20',
        activeText: 'text-red-800 dark:text-red-300',
        activeBorder: 'border-l-red-600 dark:border-l-red-500',
        hoverBg: 'hover:bg-gray-100 dark:hover:bg-gray-800/60',
        childActiveBg: 'bg-red-[#ED7225]',
        sectionColor: 'text-gray-400 dark:text-gray-500',
        roleBadgeBg: 'bg-red-50 dark:bg-red-900/30',
        roleBadgeText: 'text-red-700 dark:text-red-300',
        roleBadgeBorder: 'border-red-200 dark:border-red-700',
        RoleIcon: Shield,
        roleLabel: 'Admin',
    },
    superAdmin: {
        headerAccent: 'bg-indigo-600 dark:bg-indigo-700',
        activeBg: 'bg-indigo-50 dark:bg-indigo-900/20',
        activeText: 'text-indigo-800 dark:text-indigo-300',
        activeBorder: 'border-l-indigo-600 dark:border-l-indigo-500',
        hoverBg: 'hover:bg-gray-100 dark:hover:bg-gray-800/60',
        childActiveBg: 'bg-indigo-600',
        sectionColor: 'text-gray-400 dark:text-gray-500',
        roleBadgeBg: 'bg-indigo-50 dark:bg-indigo-900/30',
        roleBadgeText: 'text-indigo-700 dark:text-indigo-300',
        roleBadgeBorder: 'border-indigo-200 dark:border-indigo-700',
        RoleIcon: BookOpen,
        roleLabel: 'Instructor',
    },
    customer: {
        headerAccent: 'bg-[#66B788] dark:bg-[#4a8f65]',
        activeBg: 'bg-green-50 dark:bg-green-900/20',
        activeText: 'text-green-800 dark:text-green-300',
        activeBorder: 'border-l-[#66B788] dark:border-l-[#4a8f65]',
        hoverBg: 'hover:bg-gray-100 dark:hover:bg-gray-800/60',
        childActiveBg: 'bg-[#66B788]',
        sectionColor: 'text-gray-400 dark:text-gray-500',
        roleBadgeBg: 'bg-green-50 dark:bg-green-900/30',
        roleBadgeText: 'text-green-700 dark:text-green-300',
        roleBadgeBorder: 'border-green-200 dark:border-green-700',
        RoleIcon: GraduationCap,
        roleLabel: 'Student',
    },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Sidebar({
    isSidebarOpen,
    userRole = 'admin',
    onCollapsedChange,
}: SidebarProps) {
    const { data: session } = useSession();
    const router = useRouter();

    // FIX: Use usePathname() for reactive active state — replaces the broken
    // window.location.pathname + useState approach that went stale after navigation.
    const currentRoute = usePathname();

    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    // FIX: Collapsible sidebar for desktop — collapses to a 56px icon rail.
    const [isCollapsed, setIsCollapsed] = useState(false);

    const sidebarConfig: NavigationConfig =
        NAVIGATION_CONFIG[userRole] || NAVIGATION_CONFIG.default;
    const theme = ROLE_THEMES[userRole] || ROLE_THEMES.admin;
    const { RoleIcon } = theme;

    // Auto-expand the section whose child route is currently active.
    useEffect(() => {
        if (!sidebarConfig?.sections) return;
        const autoExpand: Record<string, boolean> = {};
        sidebarConfig.sections.forEach((section: any) => {
            section.items.forEach((item: any) => {
                if (item.childItems?.some((c: any) => c.route === currentRoute)) {
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
            // Collapse all other open sections (accordion behaviour).
            Object.keys(prev).forEach((k) => {
                next[k] = false;
            });
            // But never collapse a section whose child is currently active.
            sidebarConfig.sections?.forEach((section: any) => {
                section.items.forEach((item: any) => {
                    if (
                        item.id !== clickedId &&
                        item.childItems?.some((c: any) => c.route === currentRoute)
                    ) {
                        next[item.route] = true;
                    }
                });
            });
            next[clickedId] = !prev[clickedId];
            return next;
        });
    };

    const handleCollapseToggle = () => {
        const next = !isCollapsed;
        setIsCollapsed(next);
        onCollapsedChange?.(next);
    };

    // ─── Sub-renderers ─────────────────────────────────────────────────────────

    const renderSectionDivider = (name: string) => {
        if (isCollapsed) {
            // In collapsed state just show a thin rule with no text.
            return (
                <div className="my-3 mx-3 h-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
            );
        }
        return (
            <div className="flex items-center gap-2 px-3 mt-5 mb-1">
                {name && (
                    <h3
                        className={`text-[10px] font-semibold tracking-widest uppercase whitespace-nowrap ${theme.sectionColor}`}
                    >
                        {name}
                    </h3>
                )}
                {name && (
                    <span className="flex-1 h-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                )}
            </div>
        );
    };

    const renderNavItem = (item: any) => {
        const hasChildren = item.childItems && item.childItems.length > 0;
        const isActive =
            isRouteActive(item.route) ||
            item.childItems?.some((child: any) => isRouteActive(child.route));
        const isExpanded = expandedSections[item.route];

        return (
            <div key={item.route} className="mb-0.5">
                {/* Main item — FIX: uses <button> for keyboard + screen-reader accessibility */}
                <button
                    type="button"
                    onClick={() => (hasChildren ? toggleSection(item.route) : navigateTo(item.route))}
                    // FIX: aria-current for screen readers, aria-expanded for accordions
                    aria-current={isActive && !hasChildren ? 'page' : undefined}
                    aria-expanded={hasChildren ? isExpanded : undefined}
                    aria-controls={hasChildren ? `section-${item.route}` : undefined}
                    title={isCollapsed ? item.title : undefined}
                    className={`
            w-full flex items-center gap-3 cursor-pointer
            transition-all duration-150 outline-none focus-visible:ring-2
            focus-visible:ring-offset-1 focus-visible:ring-[#66B788]
            ${isCollapsed ? 'px-3 py-2.5 justify-center' : 'px-3 py-2.5 justify-between'}
            ${isActive
                            ? `${theme.activeBg} ${theme.activeText} border-l-[3px] ${theme.activeBorder} pl-[9px]`
                            : `text-gray-600 dark:text-gray-400 border-l-[3px] border-l-transparent ${theme.hoverBg}`
                        }
          `}
                >
                    <span className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                        <span className="text-[20px] shrink-0" aria-hidden="true">
                            {item.icon}
                        </span>
                        {!isCollapsed && (
                            <span className="text-[13.5px] font-medium leading-none">{item.title}</span>
                        )}
                    </span>

                    {hasChildren && !isCollapsed && (
                        <FaAngleDown
                            aria-hidden="true"
                            className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-180' : ''
                                }`}
                            size={12}
                        />
                    )}
                </button>

                {/* Child items */}
                {hasChildren && !isCollapsed && (
                    <div
                        id={`section-${item.route}`}
                        // FIX: aria-hidden on collapsed content for screen readers
                        aria-hidden={!isExpanded}
                        className={`overflow-hidden transition-all duration-200 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mt-0.5' : 'max-h-0 opacity-0'
                            }`}
                    >
                        <div className="ml-7 pl-3 border-l border-gray-200 dark:border-gray-700 space-y-0.5 py-1">
                            {item.childItems.map((child: any) => {
                                const titleLower = child.title?.toLowerCase();
                                const isLive = titleLower === 'live';
                                const isUpcoming = titleLower === 'upcoming';
                                const childActive = isRouteActive(child.route);

                                return (
                                    <button
                                        key={child.route}
                                        type="button"
                                        onClick={() => navigateTo(child.route)}
                                        aria-current={childActive ? 'page' : undefined}
                                        className={`
                      w-full flex items-center gap-2.5 px-3 py-2 rounded-md
                      text-[13px] transition-all duration-150 text-left
                      outline-none focus-visible:ring-2 focus-visible:ring-[#66B788]
                      ${childActive
                                                ? `${theme.childActiveBg} text-white`
                                                : `text-gray-500 dark:text-gray-400 ${theme.hoverBg}`
                                            }
                    `}
                                    >
                                        {isLive && (
                                            // FIX: motion-safe so ping stops for users with prefers-reduced-motion
                                            <span className="relative flex items-center shrink-0" aria-hidden="true">
                                                <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-red-400 opacity-75 motion-safe:animate-ping" />
                                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                                            </span>
                                        )}
                                        {isUpcoming && (
                                            <Calendar size={13} className="text-blue-500 shrink-0" aria-hidden="true" />
                                        )}
                                        {!isLive && !isUpcoming && (
                                            <span className="shrink-0" aria-hidden="true">
                                                {child.icon}
                                            </span>
                                        )}
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

    // ─── Render ────────────────────────────────────────────────────────────────

    const sidebarWidth = isCollapsed ? 'w-14' : 'w-64';

    return (
        <aside
            // FIX: Proper semantic <aside> + role="navigation" for screen readers
            role="navigation"
            aria-label="Main navigation"
            className={`
        h-screen bg-white dark:bg-gray-900
        border-r border-gray-300 dark:border-gray-700
        fixed z-50 flex flex-col
        transition-all duration-300 ease-out
        ${sidebarWidth}
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        overflow-hidden
      `}
        >
            {/* ── Role-coloured accent strip at top ─────────────────────────────── */}
            {/* FIX: Each role gets a visually distinct header band */}
            <div className={`h-1 w-full shrink-0 ${theme.headerAccent}`} aria-hidden="true" />

            {/* ── Logo + Role badge ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-center px-3 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0 dark:bg-gray-800">
                {!isCollapsed ? (
                    <div className="flex items-center gap-2.5 w-full">
                        <span className="flex items-center justify-center rounded-lg">
                            <Image
                                src="/media/UTS-logo.png"
                                alt="Mastery Hub"
                                width={60}
                                height={60}
                                priority
                            />
                        </span>
                        <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-bold text-gray-900 dark:text-white truncate">
                                Umashakti
                            </div>
                            <div className="text-[10px] text-gray-600 dark:text-gray-400 truncate">
                                Transport
                            </div>
                        </div>
                    </div>
                ) : (
                    // Collapsed: show only the role icon centred
                    <div className="mx-auto">
                        <RoleIcon size={20} className={theme.roleBadgeText} aria-label={theme.roleLabel} />
                    </div>
                )}
            </div>

            {/* ── Navigation ────────────────────────────────────────────────────── */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-0">
                {sidebarConfig?.sections?.map((section: any, index: number) => (
                    <div key={index}>
                        {renderSectionDivider(section.name)}
                        {section.items.map((item: any) => renderNavItem(item))}
                    </div>
                ))}
            </nav>

            {/* ── Collapse toggle (desktop only) ────────────────────────────────── */}
            {/* FIX: Collapsible sidebar — saves space during exams, standard SaaS pattern */}
            {/* <div className="hidden md:flex shrink-0 border-t border-gray-100 dark:border-gray-800 p-2">
        <button
          type="button"
          onClick={handleCollapseToggle}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`
            flex items-center justify-center w-full py-2 rounded-lg text-gray-400
            hover:text-gray-600 dark:hover:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-800
            transition-all duration-150
            outline-none focus-visible:ring-2 focus-visible:ring-[#66B788]
          `}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!isCollapsed && (
            <span className="ml-2 text-[12px] font-medium">Collapse</span>
          )}
        </button>
      </div> */}
        </aside>
    );
}


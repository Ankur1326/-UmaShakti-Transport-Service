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

// ─── Brand tokens ───────────────────────────────────────────────────────────
// Pulled straight from the UTS mark: deep navy hull + a single hot-orange
// accent, both built from sharp angled cuts rather than soft/rounded shapes.
// Every role shares this brand system — roles are told apart by a small
// badge, not by giving each one an unrelated hue (red/indigo/green, as before).

const BRAND = {
    navy: '#0F2A47',
    navyDeep: '#0A1E33',
    orange: '#F2680E',
    orangeLight: '#FF8A3D',
};

// ─── Role Themes ──────────────────────────────────────────────────────────────
// Roles stay within the two brand colours: orange marks the "operate" role,
// navy tints mark the two supervisory/learning roles. This keeps every screen
// legibly on-brand while still giving each role a distinct, memorable chip.

interface RoleTheme {
    activeText: string;
    activeIndicator: string; // the little angled flag on the active row
    childActiveBg: string;
    roleBadgeBg: string;
    roleBadgeText: string;
    RoleIcon: React.ComponentType<{ size?: number; className?: string }>;
    roleLabel: string;
}

const ROLE_THEMES: Record<UserRole, RoleTheme> = {
    admin: {
        activeText: 'text-[#F2680E] dark:text-[#FF8A3D]',
        activeIndicator: 'bg-[#F2680E]',
        childActiveBg: 'bg-[#F2680E]',
        roleBadgeBg: 'bg-[#F2680E]',
        roleBadgeText: 'text-white',
        RoleIcon: Shield,
        roleLabel: 'Admin',
    },
    superAdmin: {
        activeText: 'text-[#0F2A47] dark:text-[#8FB4DA]',
        activeIndicator: 'bg-[#0F2A47] dark:bg-[#8FB4DA]',
        childActiveBg: 'bg-[#0F2A47] dark:bg-[#1E4A73]',
        roleBadgeBg: 'bg-[#0F2A47] dark:bg-[#1E4A73]',
        roleBadgeText: 'text-white',
        RoleIcon: BookOpen,
        roleLabel: 'Instructor',
    },
    customer: {
        activeText: 'text-[#1E4A73] dark:text-[#8FB4DA]',
        activeIndicator: 'bg-[#1E4A73] dark:bg-[#8FB4DA]',
        childActiveBg: 'bg-[#1E4A73]',
        roleBadgeBg: 'bg-[#1E4A73]/10 dark:bg-[#1E4A73]/30',
        roleBadgeText: 'text-[#1E4A73] dark:text-[#8FB4DA]',
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

    const currentRoute = usePathname();

    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
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
            Object.keys(prev).forEach((k) => {
                next[k] = false;
            });
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
            return (
                <div className="my-3 mx-3 h-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
            );
        }
        return (
            <div className="flex items-center gap-2 px-3 mt-5 mb-1">
                {name && (
                    <h3 className="text-[10px] font-bold tracking-wide text-gray-400 dark:text-gray-500 whitespace-nowrap">
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
            <div key={item.route} className="mb-0.5 relative">
                <button
                    type="button"
                    onClick={() => (hasChildren ? toggleSection(item.route) : navigateTo(item.route))}
                    aria-current={isActive && !hasChildren ? 'page' : undefined}
                    aria-expanded={hasChildren ? isExpanded : undefined}
                    aria-controls={hasChildren ? `section-${item.route}` : undefined}
                    title={isCollapsed ? item.title : undefined}
                    className={`
            w-full flex items-center gap-3 cursor-pointer relative
            transition-all duration-150 outline-none focus-visible:ring-2
            focus-visible:ring-offset-1 focus-visible:ring-[#F2680E]
            ${isCollapsed ? 'px-3 py-2.5 justify-center' : 'pl-4 pr-3 py-2.5 justify-between'}
            ${isActive
                            ? `bg-gray-100 dark:bg-gray-800/60 ${theme.activeText}`
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                        }
          `}
                >
                    {/* FIX: active indicator is a small angled flag (clip-path), echoing
              the sharp diagonal cuts in the UTS mark, instead of a plain vertical bar */}
                    {isActive && (
                        <span
                            aria-hidden="true"
                            className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[5px] ${theme.activeIndicator}`}
                            style={{ clipPath: 'polygon(0 0, 100% 15%, 100% 85%, 0 100%)' }}
                        />
                    )}

                    <span className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                        <span className="text-[20px] shrink-0" aria-hidden="true">
                            {item.icon}
                        </span>
                        {!isCollapsed && (
                            <span className={`text-[13.5px] leading-none ${isActive ? 'font-semibold' : 'font-medium'}`}>
                                {item.title}
                            </span>
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
                      outline-none focus-visible:ring-2 focus-visible:ring-[#F2680E]
                      ${childActive
                                                ? `${theme.childActiveBg} text-white`
                                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                                            }
                    `}
                                    >
                                        {isLive && (
                                            <span className="relative flex items-center shrink-0" aria-hidden="true">
                                                <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-red-400 opacity-75 motion-safe:animate-ping" />
                                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                                            </span>
                                        )}
                                        {isUpcoming && (
                                            <Calendar
                                                size={13}
                                                className={`shrink-0 ${childActive ? 'text-white' : 'text-[#F2680E]'}`}
                                                aria-hidden="true"
                                            />
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
            role="navigation"
            aria-label="Main navigation"
            className={`
        h-screen bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-800
        fixed z-50 flex flex-col
        transition-all duration-300 ease-out
        ${sidebarWidth}
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        overflow-hidden
      `}
        >
            {/* ── Header: navy hull with a single angled orange cut ─────────────── */}
            {/* FIX: replaces the flat white header + thin rainbow strip with a
          navy block carrying one deliberate diagonal orange edge, the one
          shape borrowed directly from the UTS mark. */}
            <div
                className="relative shrink-0 overflow-hidden"
                style={{ backgroundColor: BRAND.navyDeep }}
            >
                <div
                    aria-hidden="true"
                    className="absolute right-0 top-0 h-full w-10"
                    style={{
                        backgroundColor: BRAND.orange,
                        clipPath: 'polygon(60% 0, 100% 0, 40% 100%, 0 100%)',
                    }}
                />

                {!isCollapsed ? (
                    <div className="relative flex items-center gap-3 px-4 py-3">
                        <span className="flex items-center justify-center shrink-0 rounded bg-white/95 p-1">
                            <Image src="/media/UTS-logo.png" alt="UTS" width={34} height={34} priority />
                        </span>
                        <div className="min-w-0">
                            <div className="text-[15px] font-bold tracking-tight text-white leading-tight">
                                Umashakti
                            </div>
                            <div className="text-[10px] font-medium uppercase tracking-widest text-[#FF8A3D]">
                                Transport
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative flex items-center justify-center py-4">
                        <span className="flex items-center justify-center shrink-0 rounded bg-white/95 p-1">
                            <Image src="/media/UTS-logo.png" alt="UTS" width={22} height={22} priority />
                        </span>
                    </div>
                )}
            </div>

            {/* ── Role badge ────────────────────────────────────────────────────── */}
            {/* {!isCollapsed ? (
                <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 shrink-0">
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded ${theme.roleBadgeBg} ${theme.roleBadgeText}`}
                    >
                        <RoleIcon size={12} />
                        <span className="text-[11px] font-semibold">{theme.roleLabel}</span>
                    </span>
                </div>
            ) : (
                <div className="flex items-center justify-center py-2.5 border-b border-gray-100 dark:border-gray-800 shrink-0">
                    <RoleIcon size={16} className={theme.roleBadgeText === 'text-white' ? theme.activeText : theme.roleBadgeText} aria-label={theme.roleLabel} />
                </div>
            )} */}

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
            {/* FIX: re-enabled — the state already existed but had no control */}
            {/* <div className="hidden md:flex shrink-0 border-t border-gray-100 dark:border-gray-800 p-2">
                <button
                    type="button"
                    onClick={handleCollapseToggle}
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    className="
            flex items-center justify-center w-full py-2 rounded-md text-gray-400
            hover:text-[#F2680E] hover:bg-gray-100 dark:hover:bg-gray-800
            transition-all duration-150
            outline-none focus-visible:ring-2 focus-visible:ring-[#F2680E]
          "
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    {!isCollapsed && <span className="ml-2 text-[12px] font-medium">Collapse</span>}
                </button>
            </div> */}
        </aside>
    );
}
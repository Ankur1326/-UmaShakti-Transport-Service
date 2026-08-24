import React from 'react';

import {
    HiOutlineHome,
    HiOutlineUser,
    HiOutlineUserGroup,
    HiOutlineBell,
    HiOutlineDocumentText,
    HiOutlineClipboardList,
    HiOutlineDocumentAdd
} from 'react-icons/hi';
import { FiCircle } from 'react-icons/fi';
import { MdOutlineFeedback } from 'react-icons/md';

export interface NavItem {
    id: string;
    title: string;
    icon: React.JSX.Element;
    route: string;
    childItems?: NavItem[];
}

export interface SidebarConfig {
    [role: string]: {
        sections: {
            name: string;
            items: NavItem[];
        }[];
    };
}

export interface NavigationSection {
    name: string;
    items: NavItem[];
}

export interface NavigationConfig {
    sections: NavigationSection[];
}

export const NAVIGATION_CONFIG: Record<string, NavigationConfig> = {
    admin: {
        sections: [
            {
                name: '',
                items: [
                    {
                        id: 'dashboard',
                        title: 'Dashboard',
                        icon: <HiOutlineHome className="text-[#66B788] w-5 h-5" />,
                        route: '/admin/dashboard',
                    },
                    {
                        id: 'profile',
                        title: 'My Profile',
                        icon: <HiOutlineUser className="text-[#66B788] w-5 h-5" />,
                        route: '/user/profile',
                    },
                ]
            },
            {
                name: 'Billing',
                items: [
                    {
                        id: 'bookings',
                        title: 'Booking lists',
                        icon: <HiOutlineClipboardList className="text-blue-500 w-5 h-5" />,
                        route: '/admin/bookings',
                    },
                    {
                        id: 'billing-new',
                        title: 'New Consignment Note',
                        icon: <HiOutlineDocumentAdd className="text-emerald-500 w-5 h-5" />,
                        route: '/admin/billing/new',
                    },
                ]
            },
            // {
            //     name: 'Configuration',
            //     items: [
            //         {
            //             id: 'user-management',
            //             title: 'User Management',
            //             icon: <HiOutlineUserGroup className="text-[#66B788] w-5 h-5" />,
            //             route: '/admin/users',
            //             childItems: [
            //                 {
            //                     id: 'users-main',
            //                     title: 'Users',
            //                     icon: <FiCircle className="w-3 h-3" />,
            //                     route: '/admin/users'
            //                 },
            //             ]
            //         }
            //     ]
            // },
            // {
            //     name: '',
            //     items: [
            //         {
            //             id: 'feedbacks',
            //             title: 'Feedback',
            //             icon: <MdOutlineFeedback className="text-[#66B788] w-5 h-5" />,
            //             route: '/admin/feedbacks',
            //         },
            //         {
            //             id: 'notifications',
            //             title: 'Notifications',
            //             icon: <HiOutlineBell className="text-[#66B788] w-5 h-5" />, // import HiOutlineBell from react-icons/hi
            //             route: '/admin/notifications',
            //         },
            //     ]
            // },

        ]
    },
};
import React from 'react';

import {
    HiOutlineClipboardList,
    HiOutlineDocumentAdd,
    HiOutlineHome,
    HiOutlineOfficeBuilding,
    HiOutlineUser,
    HiOutlineUserGroup,
} from 'react-icons/hi';

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
    title: 'Bookings',
    icon: <HiOutlineClipboardList className="text-blue-500 w-5 h-5" />,
    route: '/admin/bookings',
},
{
    id: 'billing-new',
    title: 'New Consignment Entry',
    icon: <HiOutlineDocumentAdd className="text-emerald-500 w-5 h-5" />,
    route: '/admin/consignment/new',
},
{
    id: 'consigners',
    title: 'Consigner Management',
    icon: <HiOutlineOfficeBuilding className="text-purple-500 w-5 h-5" />,
    route: '/admin/consigners',
},
{
    id: 'consignees',
    title: 'Consignee Management',
    icon: <HiOutlineUserGroup className="text-orange-500 w-5 h-5" />,
    route: '/admin/consignees',
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
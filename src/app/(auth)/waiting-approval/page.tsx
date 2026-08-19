'use client'
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { signOut } from 'next-auth/react';

interface WaitingApprovalPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const WaitingApprovalPage = async (props: WaitingApprovalPageProps) => {
    const searchParams = await props.searchParams;
    // Get userData from query param if it exists
    const userDataParam = searchParams.userData as string;
    let userData = null;

    if (userDataParam) {
        try {
            userData = JSON.parse(decodeURIComponent(userDataParam));
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    } else {
        // If no user data in query, check for session
        const session: any = await getServerSession(authOptions);

        // If user is already approved, redirect to appropriate dashboard
        if (session?.user?.isApproved) {
            const role = session.user.role;
            if (role === 'admin') {
                redirect('/admin/dashboard');
            } else if (role === 'superAdmin') {
                redirect('/superAdmin/dashboard');
            } else {
                redirect('/customer/dashboard');
            }
        }

        // If user is in session, use that data
        if (session?.user) {
            userData = {
                name: session.user.name,
                email: session.user.email,
                role: session.user.role,
                profilePicture: session.user.image
            };
        }
    }

    if (!userData) {
        // If we don't have user data at all, redirect to sign-in
        redirect('/sign-in');
    }

    const SignOutButton = () => {
        const handleSignOut = async () => {
            // This is a client-side action that will clear cookies before redirecting
            await signOut({ callbackUrl: '/sign-in' });
        };

        return (
            <button
                onClick={handleSignOut}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                Return to Sign In
            </button>
        );
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    {userData.profilePicture ? (
                        <div className="mx-auto flex justify-center">
                            <img
                                className="h-24 w-24 rounded-full"
                                src={userData.profilePicture}
                                alt="Profile"
                            />
                        </div>
                    ) : (
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
                            <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    )}
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Account Pending Approval
                    </h2>
                </div>

                <div className="bg-white p-6 shadow sm:rounded-lg">
                    <div className="space-y-4">
                        <div>
                            <p className="text-lg font-medium text-gray-900">Account Details</p>
                            <dl className="mt-2 divide-y divide-gray-200">
                                <div className="flex justify-between py-2">
                                    <dt className="text-gray-500">Name</dt>
                                    <dd className="text-gray-900">{userData.name}</dd>
                                </div>
                                <div className="flex justify-between py-2">
                                    <dt className="text-gray-500">Email</dt>
                                    <dd className="text-gray-900">{userData.email}</dd>
                                </div>
                                <div className="flex justify-between py-2">
                                    <dt className="text-gray-500">Role</dt>
                                    <dd className="text-gray-900 capitalize">{userData.role}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="rounded-md bg-yellow-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">Waiting for approval</h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p>
                                            Thank you for registering via Google! Your account has been created successfully but requires admin approval before you can log in.
                                        </p>
                                        <p className="mt-2">
                                            You will receive an email notification once your account has been approved.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <SignOutButton />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaitingApprovalPage;
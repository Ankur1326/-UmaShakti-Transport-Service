import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { authOptions } from '../[...nextauth]/options';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        // Get the session
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({
                success: false,
                message: 'Not authenticated'
            }, { status: 401 });
        }

        // Get the role from the request body
        const { role } = await req.json();
        if (!role || !['superAdmin', 'customer', 'admin'].includes(role)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid role'
            }, { status: 400 });
        }

        // Check if user already exists
        const { email, image } = session.user;
        const existingUser: any = await User.findOne({ email });

        if (existingUser) {
            // CRITICAL FIX: Check if user is approved
            const isApproved = existingUser.isApproved;

            // User exists, return success with redirect and approval status
            return NextResponse.json({
                success: true,
                message: 'User already exists',
                userData: {
                    email: existingUser.email,
                    role: existingUser.role,
                    profilePicture: existingUser.profilePicture,
                    isApproved
                }
            });
        }

        const name = `${email?.split('@')[0]}${Math.floor(Math.random() * 100000)}`;

        // Generate random verify code and expiry (required by your User model)
        const verifyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const verifyCodeExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const newUser: any = new User({
            email,
            profilePicture: image || '',
            role,
            isVerified: true, // Google accounts are pre-verified
            isApproved: false, // CRITICAL FIX: Always set new users to not approved
            googleAuth: true,
            verifyCode,
            verifyCodeExpiry,
            password: Math.random().toString(36).slice(-16) // Random password
        });

        await newUser.save();

        // CRITICAL FIX: Remove redirectTo - always redirect to waiting-approval in the callback
        return NextResponse.json({
            success: true,
            message: 'User created successfully',
            userData: {
                email: newUser.email,
                role: newUser.role,
                profilePicture: newUser.profilePicture,
                isApproved: false
            }
        });

    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({
            success: false,
            message: 'Error creating user'
        }, { status: 500 });
    }
}
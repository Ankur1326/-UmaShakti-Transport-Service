import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { authOptions } from '../[...nextauth]/options';

export async function GET(req: Request) {
    await dbConnect();
    const session: any = await getServerSession(authOptions);

    try {

        if (!session?.user?.email) {
            return NextResponse.redirect(new URL('/sign-in?error=No+session+found', req.url));
        }

        const email = session.user.email;
        const existingUser = await User.findOne({ email });

        // An unapproved Google account must not continue into the app.
        if (session.limitedAccess || (existingUser && !existingUser.isApproved)) {
            return NextResponse.redirect(
                new URL('/sign-in?error=AccountNotApproved', req.url)
            );
        }

        if (existingUser && existingUser.isApproved) {
            return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        }

        // Return a special HTML page that will execute JavaScript to create the user
        return new NextResponse(
            `<!DOCTYPE html>
            <html>
            <head>
                <title>Processing Sign-up</title>
                <script>
                    window.onload = async function() {
                        try {
                            // Get the role from localStorage
                            const role = localStorage.getItem('googleSignUpRole') || 'student';
                            
                            // Make an API call to create the user
                            const response = await fetch('/api/auth/google-create-user', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ role }),
                            });
                            
                            const data = await response.json();
                            
                            if (data.success) {
                                // Clear the role and signup flow flags from storage
                                localStorage.removeItem('googleSignUpRole');
                                sessionStorage.removeItem('googleSignUpFlow');

                                window.location.href = '/sign-in?error=AccountNotApproved';
                            } else {
                                window.location.href = '/sign-up?error=' + encodeURIComponent(data.message || 'Error creating user');
                            }
                        } catch (error) {
                            console.error('Error processing sign-up:', error);
                            window.location.href = '/sign-up?error=Failed+to+process+sign-up';
                        }
                    };
                </script>
            </head>
            <body>
                <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
                    <div style="text-align: center;">
                        <h1>Processing your sign-up</h1>
                        <p>Please wait, we're setting up your account...</p>
                    </div>
                </div>
            </body>
            </html>`,
            {
                headers: {
                    'Content-Type': 'text/html',
                },
            }
        );
    } catch (error) {
        console.error('Error handling Google callback:', error);
        return NextResponse.redirect(new URL('/sign-up?error=Error+processing+callback', req.url));
    }
}
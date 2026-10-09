import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import axios from "axios";

async function verifyCaptcha(token: string): Promise<boolean> {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY || "";

    try {
        const verificationResponse = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            null,
            {
                params: {
                    secret: secretKey,
                    response: token
                }
            }
        );

        return verificationResponse.data.success === true;
    } catch (error) {
        console.error('Captcha verification error:', error);
        throw new Error('Captcha verification failed');
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email@company.com" },
                password: { label: "Password", type: "password" },
                captchaToken: { label: "Captcha Token", type: "text" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                // console.log(" credentials -> ", credentials);
                // console.log("credentials.identi -> ", credentials.identifier);

                // if (!credentials.captchaToken) {
                //     throw new Error("Captcha verification failed")
                // }

                try {
                    // Check if captchaToken is provided
                    if (credentials?.captchaToken) {
                        // Verify captcha only if token is provided
                        const captchaResponse = await verifyCaptcha(credentials.captchaToken);

                        if (!captchaResponse) {
                            throw new Error("Captcha verification failed");
                        }
                    }

                    // console.log("credentials.captchaToken : ", credentials.captchaToken);

                    // const captchaResponse: any = await verifyCaptcha(credentials.captchaToken);

                    // if (!captchaResponse.success) {
                    //     throw new Error("Captcha verification failed");
                    // }

                    const email = (credentials?.email ?? credentials?.identifier ?? '').trim().toLowerCase();
                    const password = credentials?.password;
                    if (!email || !password) {
                        throw new Error("Email and password are required");
                    }

                    const user = await User.findOne({ email });

                    if (!user) {
                        throw new Error("User Not found");
                    }

                    if (!user.isVerified) {
                        throw new Error('Please verified your account first before login')
                    }

                    if (!user.isApproved) {
                        throw new Error("AccountNotApproved");
                    }

                    const isPasswordCorrect = await user.comparePassword(password);

                    if (isPasswordCorrect) {
                        return {
                            id: user._id.toString(),
                            _id: user._id.toString(),
                            email: user.email,
                            name: user.fullName,
                            role: "transporter",
                            isVerified: user.isVerified,
                            isApproved: user.isApproved,
                        };
                    } else {
                        throw new Error('Incorrect Password')
                    }

                } catch (err: any) {
                    const message = err instanceof Error ? err.message : 'Authentication failed';
                    throw new Error(message);
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            httpOptions: {
                timeout: 10000, // 10 seconds timeout
            },
            authorization: {
                params: {
                    prompt: "select_account"
                }
            }

            // async profile(profile: any): Promise<any> {
            //     await dbConnect();
            //     // Find or create the user in your database
            //     try {
            //         let user = await User.findOne({ email: profile.email });

            //         if (!user) {
            //             throw new Error("User not found");
            //         }
            //         if (!user.isVerified) {
            //             throw new Error('Please verify your account first before login');
            //         }

            //         if (!user.isApproved) {
            //             throw new Error("You can't logged-in without the approval of admin")
            //         }

            //         // const accessToken = generateAccessToken(user);

            //         return {
            //             id: user?._id,
            //             email: user.email,
            //             username: user.username,
            //             isVerified: user.isVerified,
            //             role: user.role,
            //         };
            //     } catch (err: any) {
            //         throw new Error(err.message)
            //     }
            // }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }: any) {
            if (account?.provider === 'google') {
                try {
                    await dbConnect();
                    console.log("Google sign-in attempt for:", user.email);

                    // Check if this is potentially a new user (no pre-existing account)
                    const existingUser = await User.findOne({ email: user.email });

                    if (!existingUser) {
                        console.log("New Google user - needs registration:", user.email);
                        // Set a flag in user object to identify the user needs registration
                        user.pendingGoogleSignup = true;
                        user.needsRegistration = true;
                        user.role = "transporter";
                        return true; // Allow sign-in to continue to callbacks
                    }

                    // For existing users, check approval status
                    if (!existingUser.isApproved) {
                        return "/sign-in?error=AccountNotApproved";
                    }

                    // If this is an approved existing user, allow the sign-in
                    return true;
                } catch (error) {
                    console.error("Error in Google sign-in callback:", error);
                    return false;
                }
            }
            return true;
        },

        async jwt({ token, user, account }: any) {
            // Initial sign in
            if (account && user) {
                try {
                    await dbConnect();

                    // If Google sign-in
                    if (account.provider === 'google') {
                        // Find the user in database based on email
                        const dbUser: any = await User.findOne({ email: user.email });

                        if (dbUser) {
                            // User exists, add details to token
                            token._id = dbUser._id.toString();
                            token.role = "transporter";
                            token.isVerified = dbUser.isVerified || false;
                            token.isApproved = dbUser.isApproved || false;
                            token.googleAuth = true;

                            if (!dbUser.isApproved) {
                                token.needsApproval = true;
                                token.limitedAccess = true;
                            }
                        } else {
                            token.pendingGoogleSignup = true;
                            token.googleAuth = true;
                            token.role = "transporter";
                            token.isApproved = false;
                            token.redirectToCompleteRegistration = true;
                        }
                    } else {
                        // For credentials login
                        token._id = user._id?.toString();
                        token.isVerified = user.isVerified;
                        token.isApproved = user.isApproved;
                        token.role = "transporter";

                        if (!user.isApproved) {
                            token.needsApproval = true;
                            token.limitedAccess = true;
                        }
                    }
                } catch (error) {
                    console.error("Error in JWT callback:", error);
                    throw error; // Re-throw to prevent login
                }
            }

            token.expires = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours
            return token;
        },

        async session({ session, token }: any) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isApproved = token.isApproved;
                session.user.role = token.role;
                session.user.pendingGoogleSignup = token.pendingGoogleSignup;
                session.user.needsRegistration = token.needsRegistration || false;
                session.user.googleAuth = token.googleAuth;
                session.user.needsApproval = token.needsApproval;
                session.user.limitedAccess = token.limitedAccess;
                session.expires = new Date(token.expires * 1000).toISOString();

                // console.log("Session user role:", session.user.role);
                // console.log("Session user registration status:", session.user.needsRegistration);

                if (token.limitedAccess) {
                    session.limitedAccess = true;
                }

                // Double-check against database for extra security
                if (session.user.email && !token.needsRegistration) {
                    try {
                        await dbConnect();
                        const currentUser = await User.findOne({ email: session.user.email });

                        if (currentUser && !currentUser.isApproved) {
                            session.user.isApproved = false;
                            session.needsApproval = true;
                            session.limitedAccess = true;
                        }

                    } catch (error) {
                        console.error("Error validating session:", error);
                    }
                }
            }

            return session;
        },

    },
    pages: {
        signIn: '/sign-in',
        error: '/sign-in',
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hour
    },
    secret: process.env.NEXTAUTH_SECRET
}
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequestWithAuth } from 'next-auth/middleware';

const publicPaths = [
  '/',
  '/about',
  '/contact',
  '/fleet',
  '/payment',
  '/quote',
  '/services',
  '/track',
  '/sign-in',
  '/sign-up',
  '/verify',
  '/waiting-approval',
  '/complete-registration',
];

function isPublicRoute(pathname: string) {
  return publicPaths.some((route) => pathname === route || pathname.startsWith(`${route}/`)) ||
    pathname.startsWith('/api/auth/') ||
    pathname === '/api/health';
}

export async function proxy(request: NextRequest & NextRequestWithAuth) {
  const token: any = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  const url = request.nextUrl;

  if (url.pathname === '/sign-out') {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    // Clear auth cookies
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('__Secure-next-auth.session-token');
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('__Secure-next-auth.csrf-token');
    response.cookies.delete('next-auth.callback-url');
    response.cookies.delete('__Secure-next-auth.callback-url');
    return response;
  }

  // Always allow access to the waiting-approval page
  if (url.pathname === '/waiting-approval') {
    return NextResponse.next();
  }

  // Special case: if trying to access the waiting-approval -> sign-in flow, clear cookies first
  if (url.searchParams.has('from') && url.searchParams.get('from') === 'waiting-approval' &&
    url.pathname === '/sign-in') {
    const response = NextResponse.next();
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('__Secure-next-auth.session-token');
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('__Secure-next-auth.csrf-token');
    return response;
  }

  // Handle pending/dashboard route - clear token and redirect to sign-in
  if (url.pathname === '/pending/dashboard') {
    // Create response that will redirect to sign-in
    const response = NextResponse.redirect(new URL("/sign-in", request.url));

    // Clear the auth cookie to remove the token
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('__Secure-next-auth.session-token'); // Secure version used in HTTPS
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('__Secure-next-auth.csrf-token');

    return response;
  }

  if (url.pathname === '/api/auth/google-callback' ||
    url.pathname === '/api/auth/google-create-user') {
    return NextResponse.next();
  }

  console.log("token : ", token)

  // Public pages should be accessible without authentication.
  if (!token && isPublicRoute(url.pathname)) {
    return NextResponse.next();
  }

  // Check token expiration
  if (token) {
    // Allow public pages for signed-in users too, unless they're auth pages that should redirect.
    if (isPublicRoute(url.pathname) && !['/sign-in', '/sign-up', '/verify'].includes(url.pathname)) {
      return NextResponse.next();
    }

    // Check if token represents an unapproved user
    if (!token.isApproved || token.needsApproval || token.limitedAccess) {
      console.log("Unapproved user detected in middleware");

      // Don't redirect if already on approved pages
      if (!url.pathname.startsWith('/waiting-approval') &&
        !url.pathname.startsWith('/sign-in') &&
        !url.pathname.startsWith('/sign-out') &&
        !url.pathname.startsWith('/api/auth/signout')) {

        return NextResponse.redirect(new URL("/waiting-approval", request.url));
      }

      return NextResponse.next();
    }

    // Check token expiration
    const tokenExpiry = new Date(token.exp * 1000); // Convert Unix timestamp to Date
    const currentTime = new Date();

    if (currentTime > tokenExpiry) {
      // Token has expired
      if (url.pathname.startsWith('/api/')) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: 'Token expired'
          }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
        );
      }
      // For non-API routes, redirect to sign-in
      const response = NextResponse.redirect(new URL("/sign-in", request.url));
      response.cookies.delete('next-auth.session-token');
      response.cookies.delete('__Secure-next-auth.session-token');
      return response;
    }

    // Redirect authenticated users away from public pages
    if (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify")) {
      return NextResponse.redirect(new URL(`/${token.role}/dashboard`, request.url));
    }
  }

  // API authentication check
  if (!token && url.pathname.startsWith('/api/admin')) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: 'Unauthorized request, Please Login'
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Redirect unauthenticated users to sign-in
  if (!token && (
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/superAdmin') ||
    url.pathname.startsWith('/customer')
  )) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Role-based authorization
  if (token) {
    const userRole = token.role;

    // If no role or invalid role, restrict access
    if (!userRole || !['admin', 'superAdmin', 'customer'].includes(userRole)) {
      console.error("Invalid or missing role:", userRole);
      return NextResponse.redirect(new URL("/403", request.url));
    }

    if (url.pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL("/403", request.url));
    }

    if (url.pathname.startsWith('/superAdmin') && userRole !== 'superAdmin') {
      return NextResponse.redirect(new URL("/403", request.url));
    }

    if (url.pathname.startsWith('/customer') && userRole !== 'customer') {
      return NextResponse.redirect(new URL("/403", request.url));
    }

    // 🚫 block just the notifications route for students
    if (userRole === 'customer' && url.pathname === '/customer/notifications') {
      return NextResponse.redirect(new URL("/403", request.url));
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/",
    "/about",
    "/about/:path*",
    "/contact",
    "/contact/:path*",
    "/fleet",
    "/fleet/:path*",
    "/payment",
    "/payment/:path*",
    "/quote",
    "/quote/:path*",
    "/services",
    "/services/:path*",
    "/track",
    "/track/:path*",
    "/sign-in",
    "/sign-up",
    "/verify",
    "/waiting-approval",
    "/complete-registration",
    "/admin/:path*",
    "/superAdmin/:path*",
    "/customer/:path*",
    "/api/:path*",
  ],
};
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
  '/complete-registration',
];

function clearSessionCookies(response: NextResponse) {
  response.cookies.delete('next-auth.session-token');
  response.cookies.delete('__Secure-next-auth.session-token');
  response.cookies.delete('next-auth.csrf-token');
  response.cookies.delete('__Secure-next-auth.csrf-token');
}

function getDashboardPath(role: unknown): string | null {
  return role === 'transporter' ? '/admin/dashboard' : null;
}

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
    clearSessionCookies(response);
    response.cookies.delete('next-auth.callback-url');
    response.cookies.delete('__Secure-next-auth.callback-url');
    return response;
  }

  // Handle pending/dashboard route - clear token and redirect to sign-in
  if (url.pathname === '/pending/dashboard') {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    clearSessionCookies(response);
    return response;
  }

  if (url.pathname === '/api/auth/google-callback' ||
    url.pathname === '/api/auth/google-create-user') {
    return NextResponse.next();
  }

  if (token && (
    token.isApproved === false ||
    token.needsApproval ||
    token.limitedAccess
  )) {
    if (isPublicRoute(url.pathname)) {
      const response = NextResponse.next();
      clearSessionCookies(response);
      return response;
    }

    if (url.pathname.startsWith('/api/')) {
      const response = NextResponse.json(
        { success: false, message: 'Account approval is required' },
        { status: 403 }
      );
      clearSessionCookies(response);
      return response;
    }

    const response = NextResponse.redirect(
      new URL('/sign-in?error=AccountNotApproved', request.url)
    );
    clearSessionCookies(response);
    return response;
  }

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
      const dashboard = getDashboardPath(token.role);
      if (dashboard) {
        return NextResponse.redirect(new URL(dashboard, request.url));
      }
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
  if (!token && url.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Role-based authorization
  if (token) {
    const userRole = token.role;

    if (userRole !== 'transporter') {
      const response = NextResponse.redirect(new URL("/sign-in", request.url));
      clearSessionCookies(response);
      return response;
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
    "/complete-registration",
    "/admin/:path*",
    "/api/:path*",
  ],
};
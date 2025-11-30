/**
 * NextAuth.js Middleware
 *
 * Protects routes that require authentication.
 * Public routes are accessible without authentication.
 */

export { auth as middleware } from '@/lib/auth';

/**
 * Matcher configuration for protected routes
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth (authentication endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/auth).*)',
  ],
};

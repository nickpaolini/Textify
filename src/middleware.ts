/**
 * NextAuth.js Middleware
 *
 * Protects routes that require authentication.
 * Public routes are accessible without authentication.
 *
 * Note: Middleware is currently disabled to allow testing without auth setup.
 * Enable by uncommenting the export below and setting up auth environment variables.
 */

// Uncomment to enable auth protection:
// export { auth as middleware } from '@/lib/auth';

/**
 * Matcher configuration for protected routes
 * Only protect specific routes that require authentication
 */
export const config = {
  matcher: [
    // Protect these specific routes (currently empty - all routes are public)
    // '/dashboard/:path*',
    // '/workspace/:path*',
    // '/settings/:path*',
  ],
};

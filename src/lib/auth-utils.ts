/**
 * Authentication Utility Functions
 *
 * Helper functions for authentication-related operations
 */

import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';

/**
 * Get the current authenticated user session (server-side)
 *
 * @returns The session object or null if not authenticated
 */
export async function getSession() {
  return await auth();
}

/**
 * Get the current authenticated user (server-side)
 *
 * @returns The user object or null if not authenticated
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Require authentication for a page (server-side)
 *
 * Redirects to sign-in page if not authenticated
 *
 * @param redirectTo - The URL to redirect back to after sign-in
 */
export async function requireAuth(redirectTo?: string) {
  const session = await auth();

  if (!session?.user) {
    const callbackUrl = redirectTo || '/';
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return session;
}

/**
 * Check if user is authenticated (server-side)
 *
 * @returns True if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return !!session?.user;
}

/**
 * Get user ID (server-side)
 *
 * @returns The user ID or null if not authenticated
 */
export async function getUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

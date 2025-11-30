/**
 * Authentication Error Page
 *
 * Displays authentication errors
 */

import Link from 'next/link';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Authentication Error | Textify',
  description: 'An error occurred during authentication',
};

/**
 * Error descriptions
 */
const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: 'Server Configuration Error',
    description:
      'There is a problem with the server configuration. Please contact support.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to sign in.',
  },
  Verification: {
    title: 'Verification Error',
    description: 'The verification token has expired or has already been used.',
  },
  Default: {
    title: 'Authentication Error',
    description: 'An error occurred during authentication. Please try again.',
  },
};

/**
 * Error Page Component
 */
function ErrorPage({ searchParams }: { searchParams: Record<string, string> }) {
  const error = searchParams.error || 'Default';
  const errorInfo = errorMessages[error] || errorMessages.Default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg
              className="h-8 w-8 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {errorInfo.title}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {errorInfo.description}
          </p>
        </div>

        <div className="space-y-4">
          <Button variant="default" className="w-full" asChild>
            <Link href="/auth/signin">Try Again</Link>
          </Button>

          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>

        {error !== 'Default' && (
          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            Error code: {error}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Auth Error Page
 */
export default async function AuthErrorPage(props: {
  searchParams: Promise<Record<string, string>>;
}) {
  const searchParams = await props.searchParams;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorPage searchParams={searchParams} />
    </Suspense>
  );
}

/**
 * Sign Out Page
 *
 * Confirms sign-out action
 */

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { auth, signOut } from '@/lib/auth';

export const metadata = {
  title: 'Sign Out | Textify',
  description: 'Sign out of your Textify account',
};

/**
 * Sign Out Page
 */
export default async function SignOutPage() {
  const session = await auth();

  // Redirect if not signed in
  if (!session?.user) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sign Out
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to sign out?
          </p>
        </div>

        <div className="space-y-4">
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <Button type="submit" className="w-full" variant="secondary">
              Sign Out
            </Button>
          </form>

          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Cancel</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

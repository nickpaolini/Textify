/**
 * User Button Component
 *
 * Shows user avatar and dropdown menu with sign out option
 */

import { auth } from '@/lib/auth';

import { SignInButton } from './SignInButton';
import { SignOutButton } from './SignOutButton';

export async function UserButton() {
  const session = await auth();

  if (!session?.user) {
    return <SignInButton />;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        {session.user.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt={session.user.name || 'User'}
            className="h-8 w-8 rounded-full"
          />
        )}
        <div className="text-sm">
          <p className="font-medium">{session.user.name}</p>
          <p className="text-gray-500 dark:text-gray-400">
            {session.user.email}
          </p>
        </div>
      </div>
      <SignOutButton variant="outline" />
    </div>
  );
}

/**
 * Sign Out Button Component
 *
 * Server action button for signing out
 */

import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth';

interface SignOutButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  className?: string;
  children?: React.ReactNode;
}

export function SignOutButton({
  variant = 'outline',
  className,
  children = 'Sign Out',
}: SignOutButtonProps) {
  return (
    <form
      action={async () => {
        'use server';
        await signOut({ redirectTo: '/' });
      }}
    >
      <Button type="submit" variant={variant} className={className}>
        {children}
      </Button>
    </form>
  );
}

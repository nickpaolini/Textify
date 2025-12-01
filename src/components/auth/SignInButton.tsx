/**
 * Sign In Button Component
 *
 * Client component that redirects to sign-in page
 */

'use client';

import { Button } from '@/components/ui/button';

interface SignInButtonProps {
  callbackUrl?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  className?: string;
  children?: React.ReactNode;
}

export function SignInButton({
  callbackUrl = '/',
  variant = 'default',
  className,
  children = 'Sign In',
}: SignInButtonProps) {
  const handleClick = () => {
    const url = `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    window.location.href = url;
  };

  return (
    <Button variant={variant} className={className} onClick={handleClick}>
      {children}
    </Button>
  );
}

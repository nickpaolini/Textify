/**
 * NextAuth.js Type Extensions
 *
 * Extends the built-in session and user types to include custom properties
 */

import 'next-auth';

declare module 'next-auth' {
  /**
   * Extended Session type to include user ID
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  /**
   * Extended User type
   */
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    emailVerified?: Date | null;
  }
}

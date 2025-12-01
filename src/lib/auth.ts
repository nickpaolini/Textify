/**
 * NextAuth.js v5 Configuration
 *
 * This module configures authentication with OAuth providers and Prisma adapter.
 * Supports Google and GitHub OAuth with database session management.
 *
 * @see https://authjs.dev/getting-started/installation
 */

import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import { prisma } from '@/lib/db/prisma';

/**
 * NextAuth.js Configuration
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  // Prisma adapter for database session management
  adapter: PrismaAdapter(prisma),

  // OAuth Providers
  providers: [
    GoogleProvider({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientId: process.env.GOOGLE_CLIENT_ID!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    GitHubProvider({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientId: process.env.GITHUB_ID!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  // Session configuration
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  // Pages configuration
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },

  // Callbacks
  callbacks: {
    async session({ session, user }) {
      // Add user id to session
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Allow OAuth sign-in
      if (account?.provider === 'google' || account?.provider === 'github') {
        return true;
      }

      // For email sign-in, verify email is present
      if (user.email) {
        return true;
      }

      return false;
    },
  },

  // Events
  events: {
    async createUser({ user }) {
      // eslint-disable-next-line no-console
      console.log('New user created:', user.id);
      // Initialize user preferences
      try {
        await prisma.userPreferences.create({
          data: {
            userId: user.id,
          },
        });
      } catch (error) {
        console.error('Failed to create user preferences:', error);
      }
    },
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === 'development',
});

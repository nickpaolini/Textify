/**
 * NextAuth.js API Route Handler
 *
 * This catches all authentication-related requests:
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/callback/*
 * - /api/auth/session
 * - etc.
 */

import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;

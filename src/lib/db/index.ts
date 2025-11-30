/**
 * Database Utilities - Central Export
 *
 * This module provides a centralized export for all database operations
 */

// Prisma Client
export { prisma, checkDatabaseConnection, getDatabaseStats } from './prisma';

// User operations
export * from './users';

// Document operations
export * from './documents';

// Workspace operations
export * from './workspaces';

// Re-export Prisma types for convenience
// Note: Uncomment these after running `npm run db:generate`
// export type {
//   User,
//   Account,
//   Session,
//   UserPreferences,
//   Workspace,
//   WorkspaceMember,
//   Document,
//   DocumentVersion,
//   Template,
//   TransformationHistory,
//   ApiKey,
//   UsageStats,
//   Feedback,
// } from '@prisma/client';

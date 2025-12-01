/**
 * User Database Operations
 *
 * Helper functions for user-related database operations
 */

import { prisma } from './prisma';
// Types will be available after running `npm run db:generate`
// import type { User, UserPreferences } from '@prisma/client';

/**
 * Find user by email
 */
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      preferences: true,
    },
  });
}

/**
 * Find user by ID
 */
export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      preferences: true,
    },
  });
}

/**
 * Create a new user
 */
export async function createUser(data: {
  email: string;
  name?: string;
  password?: string;
  image?: string;
}) {
  return prisma.user.create({
    data: {
      ...data,
      preferences: {
        create: {}, // Create default preferences
      },
    },
    include: {
      preferences: true,
    },
  });
}

/**
 * Update user information
 */
export async function updateUser(
  userId: string,
  data: Partial<{
    name: string;
    email: string;
    image: string;
  }>
) {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  userId: string,
  preferences: any // UserPreferences type available after db:generate
) {
  return prisma.userPreferences.upsert({
    where: { userId },
    create: {
      userId,
      ...preferences,
    },
    update: preferences,
  });
}

/**
 * Get user preferences
 */
export async function getUserPreferences(userId: string) {
  return prisma.userPreferences.findUnique({
    where: { userId },
  });
}

/**
 * Delete user and all related data
 */
export async function deleteUser(userId: string) {
  return prisma.user.delete({
    where: { id: userId },
  });
}

/**
 * Get user statistics
 */
export async function getUserStats(userId: string) {
  const [documentCount, workspaceCount, templateCount, historyCount] =
    await Promise.all([
      prisma.document.count({ where: { userId } }),
      prisma.workspace.count({ where: { ownerId: userId } }),
      prisma.template.count({ where: { userId } }),
      prisma.transformationHistory.count({ where: { userId } }),
    ]);

  return {
    documents: documentCount,
    workspaces: workspaceCount,
    templates: templateCount,
    transformations: historyCount,
  };
}

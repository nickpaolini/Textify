/**
 * Workspace Database Operations
 *
 * Helper functions for workspace-related database operations
 */

import { prisma } from './prisma';

/**
 * Create a new workspace
 */
export async function createWorkspace(data: {
  name: string;
  ownerId: string;
  description?: string;
  icon?: string;
  color?: string;
  isDefault?: boolean;
}) {
  // If marking as default, unmark other workspaces
  if (data.isDefault) {
    await prisma.workspace.updateMany({
      where: {
        ownerId: data.ownerId,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });
  }

  return prisma.workspace.create({
    data,
  });
}

/**
 * Get workspace by ID
 */
export async function getWorkspaceById(workspaceId: string, userId: string) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      members: true,
      _count: {
        select: {
          documents: true,
          templates: true,
        },
      },
    },
  });

  if (!workspace) {
    return null;
  }

  // Check if user has access
  const isOwner = workspace.ownerId === userId;
  const isMember = workspace.members.some((m: any) => m.userEmail === userId);

  if (!isOwner && !isMember) {
    return null;
  }

  return workspace;
}

/**
 * Get user workspaces
 */
export async function getUserWorkspaces(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user) {
    return [];
  }

  // Get owned workspaces
  const ownedWorkspaces = await prisma.workspace.findMany({
    where: { ownerId: userId },
    include: {
      _count: {
        select: {
          documents: true,
          templates: true,
          members: true,
        },
      },
    },
    orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
  });

  // Get workspaces where user is a member
  const memberWorkspaces = await prisma.workspace.findMany({
    where: {
      members: {
        some: {
          userEmail: user.email,
        },
      },
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      _count: {
        select: {
          documents: true,
          templates: true,
          members: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return {
    owned: ownedWorkspaces,
    member: memberWorkspaces,
    all: [...ownedWorkspaces, ...memberWorkspaces],
  };
}

/**
 * Update workspace
 */
export async function updateWorkspace(
  workspaceId: string,
  userId: string,
  data: {
    name?: string;
    description?: string;
    icon?: string;
    color?: string;
    isDefault?: boolean;
  }
) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace || workspace.ownerId !== userId) {
    throw new Error('Workspace not found or access denied');
  }

  // If marking as default, unmark other workspaces
  if (data.isDefault) {
    await prisma.workspace.updateMany({
      where: {
        ownerId: userId,
        isDefault: true,
        NOT: {
          id: workspaceId,
        },
      },
      data: {
        isDefault: false,
      },
    });
  }

  return prisma.workspace.update({
    where: { id: workspaceId },
    data,
  });
}

/**
 * Delete workspace
 */
export async function deleteWorkspace(workspaceId: string, userId: string) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace || workspace.ownerId !== userId) {
    throw new Error('Workspace not found or access denied');
  }

  if (workspace.isDefault) {
    throw new Error('Cannot delete default workspace');
  }

  return prisma.workspace.delete({
    where: { id: workspaceId },
  });
}

/**
 * Add member to workspace
 */
export async function addWorkspaceMember(
  workspaceId: string,
  ownerId: string,
  data: {
    userEmail: string;
    role?: 'owner' | 'editor' | 'viewer';
  }
) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace || workspace.ownerId !== ownerId) {
    throw new Error('Workspace not found or access denied');
  }

  return prisma.workspaceMember.create({
    data: {
      workspaceId,
      userEmail: data.userEmail,
      role: data.role || 'viewer',
    },
  });
}

/**
 * Remove member from workspace
 */
export async function removeWorkspaceMember(
  workspaceId: string,
  ownerId: string,
  memberId: string
) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace || workspace.ownerId !== ownerId) {
    throw new Error('Workspace not found or access denied');
  }

  return prisma.workspaceMember.delete({
    where: { id: memberId },
  });
}

/**
 * Update member role
 */
export async function updateWorkspaceMemberRole(
  workspaceId: string,
  ownerId: string,
  memberId: string,
  role: 'owner' | 'editor' | 'viewer'
) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace || workspace.ownerId !== ownerId) {
    throw new Error('Workspace not found or access denied');
  }

  return prisma.workspaceMember.update({
    where: { id: memberId },
    data: { role },
  });
}

/**
 * Get workspace members
 */
export async function getWorkspaceMembers(workspaceId: string, userId: string) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      members: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  if (!workspace) {
    return null;
  }

  // Check if user has access
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  const isOwner = workspace.ownerId === userId;
  const isMember = workspace.members.some(
    (m: any) => m.userEmail === user?.email
  );

  if (!isOwner && !isMember) {
    return null;
  }

  return {
    owner: workspace.owner,
    members: workspace.members,
  };
}

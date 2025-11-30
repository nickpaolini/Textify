/**
 * Document Database Operations
 *
 * Helper functions for document-related database operations
 */

import { prisma } from './prisma';
// Types will be available after running `npm run db:generate`
// import type { Document } from '@prisma/client';

/**
 * Create a new document
 */
export async function createDocument(data: {
  title: string;
  content: string;
  userId: string;
  workspaceId?: string;
  description?: string;
  tags?: string[];
  language?: string;
}) {
  const wordCount = data.content.split(/\s+/).filter(Boolean).length;
  const charCount = data.content.length;

  return prisma.document.create({
    data: {
      ...data,
      wordCount,
      charCount,
      versions: {
        create: {
          content: data.content,
          version: 1,
          changeDescription: 'Initial version',
        },
      },
    },
    include: {
      workspace: true,
      versions: {
        orderBy: { version: 'desc' },
        take: 1,
      },
    },
  });
}

/**
 * Get document by ID
 */
export async function getDocumentById(documentId: string, userId?: string) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: {
      workspace: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  // Check permissions
  if (document && userId && document.userId !== userId && !document.isPublic) {
    return null;
  }

  return document;
}

/**
 * Get document by share token
 */
export async function getDocumentByShareToken(shareToken: string) {
  const document = await prisma.document.findUnique({
    where: { shareToken },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  // Check if share link has expired
  if (document?.expiresAt && document.expiresAt < new Date()) {
    return null;
  }

  return document;
}

/**
 * Update document
 */
export async function updateDocument(
  documentId: string,
  userId: string,
  data: {
    title?: string;
    content?: string;
    description?: string;
    tags?: string[];
    language?: string;
  },
  changeDescription?: string
) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document || document.userId !== userId) {
    throw new Error('Document not found or access denied');
  }

  const updateData: any = { ...data };

  // Update word/char counts if content changed
  if (data.content) {
    updateData.wordCount = data.content.split(/\s+/).filter(Boolean).length;
    updateData.charCount = data.content.length;
    updateData.version = document.version + 1;
  }

  return prisma.document.update({
    where: { id: documentId },
    data: {
      ...updateData,
      ...(data.content && {
        versions: {
          create: {
            content: data.content,
            version: document.version + 1,
            changeDescription,
          },
        },
      }),
    },
    include: {
      versions: {
        orderBy: { version: 'desc' },
        take: 5,
      },
    },
  });
}

/**
 * Delete document
 */
export async function deleteDocument(documentId: string, userId: string) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document || document.userId !== userId) {
    throw new Error('Document not found or access denied');
  }

  return prisma.document.delete({
    where: { id: documentId },
  });
}

/**
 * Get user documents
 */
export async function getUserDocuments(
  userId: string,
  options: {
    workspaceId?: string;
    limit?: number;
    offset?: number;
    orderBy?: 'createdAt' | 'updatedAt' | 'lastViewedAt' | 'title';
    order?: 'asc' | 'desc';
    search?: string;
    tags?: string[];
  } = {}
) {
  const {
    workspaceId,
    limit = 20,
    offset = 0,
    orderBy = 'updatedAt',
    order = 'desc',
    search,
    tags,
  } = options;

  const where: any = { userId };

  if (workspaceId) {
    where.workspaceId = workspaceId;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (tags && tags.length > 0) {
    where.tags = { hasSome: tags };
  }

  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      where,
      orderBy: { [orderBy]: order },
      take: limit,
      skip: offset,
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    }),
    prisma.document.count({ where }),
  ]);

  return {
    documents,
    total,
    hasMore: offset + limit < total,
  };
}

/**
 * Share document
 */
export async function shareDocument(
  documentId: string,
  userId: string,
  options: {
    expiresInDays?: number;
  } = {}
) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document || document.userId !== userId) {
    throw new Error('Document not found or access denied');
  }

  const shareToken = `share_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

  const expiresAt = options.expiresInDays
    ? new Date(Date.now() + options.expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  return prisma.document.update({
    where: { id: documentId },
    data: {
      isPublic: true,
      shareToken,
      sharedAt: new Date(),
      expiresAt,
    },
  });
}

/**
 * Unshare document
 */
export async function unshareDocument(documentId: string, userId: string) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document || document.userId !== userId) {
    throw new Error('Document not found or access denied');
  }

  return prisma.document.update({
    where: { id: documentId },
    data: {
      isPublic: false,
      shareToken: null,
      sharedAt: null,
      expiresAt: null,
    },
  });
}

/**
 * Get document versions
 */
export async function getDocumentVersions(documentId: string, userId: string) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document || document.userId !== userId) {
    throw new Error('Document not found or access denied');
  }

  return prisma.documentVersion.findMany({
    where: { documentId },
    orderBy: { version: 'desc' },
  });
}

/**
 * Restore document to a specific version
 */
export async function restoreDocumentVersion(
  documentId: string,
  userId: string,
  version: number
) {
  const [document, versionData] = await Promise.all([
    prisma.document.findUnique({ where: { id: documentId } }),
    prisma.documentVersion.findUnique({
      where: {
        documentId_version: {
          documentId,
          version,
        },
      },
    }),
  ]);

  if (!document || document.userId !== userId) {
    throw new Error('Document not found or access denied');
  }

  if (!versionData) {
    throw new Error('Version not found');
  }

  return updateDocument(
    documentId,
    userId,
    { content: versionData.content },
    `Restored to version ${version}`
  );
}

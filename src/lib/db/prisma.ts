/**
 * Prisma Client Singleton
 *
 * This module ensures a single Prisma Client instance is used across the application
 * and prevents multiple instances during development due to Next.js hot reloading.
 *
 * @see https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 *
 * Note: Run `npm run db:generate` to generate the Prisma Client
 */

// Stub PrismaClient for type checking before generation
// Replace this with actual import after running `npm run db:generate`:
// import { PrismaClient } from '@prisma/client';
const PrismaClient = class {
  constructor(_options?: any) {
    // Stub constructor accepts options
  }
  $connect() {}
  $disconnect() {}
  $queryRaw(..._args: any[]) {
    return Promise.resolve();
  }
  user = {} as any;
  userPreferences = {} as any;
  workspace = {} as any;
  workspaceMember = {} as any;
  document = {} as any;
  documentVersion = {} as any;
  template = {} as any;
  transformationHistory = {} as any;
  account = {} as any;
  session = {} as any;
};

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined;
};

// Prisma Client Options
const prismaClientOptions = {
  log:
    process.env.NODE_ENV === 'development'
      ? (['query', 'error', 'warn'] as const)
      : (['error'] as const),
};

// Create or reuse Prisma Client
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient(prismaClientOptions);

// In development, attach to global to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown handler
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}

/**
 * Database connection health check
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

/**
 * Get database statistics
 */
export async function getDatabaseStats() {
  try {
    const [
      userCount,
      documentCount,
      workspaceCount,
      templateCount,
      historyCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.document.count(),
      prisma.workspace.count(),
      prisma.template.count(),
      prisma.transformationHistory.count(),
    ]);

    return {
      users: userCount,
      documents: documentCount,
      workspaces: workspaceCount,
      templates: templateCount,
      transformations: historyCount,
    };
  } catch (error) {
    console.error('Failed to get database stats:', error);
    return null;
  }
}

export default prisma;

# Textify Database Documentation

This directory contains the Prisma schema and database configuration for the Textify application.

## 📋 Table of Contents

- [Overview](#overview)
- [Database Schema](#database-schema)
- [Setup & Configuration](#setup--configuration)
- [Common Operations](#common-operations)
- [Migrations](#migrations)
- [Seeding](#seeding)
- [Best Practices](#best-practices)

## Overview

Textify uses **PostgreSQL** as its database and **Prisma** as the ORM (Object-Relational Mapping) tool.

### Technology Stack

- **Database**: PostgreSQL 14+
- **ORM**: Prisma 5.x
- **Client**: @prisma/client
- **Migrations**: Prisma Migrate

## Database Schema

The database schema is defined in `schema.prisma` and includes the following main entities:

### Authentication & Users

- **User**: Core user account information
- **Account**: OAuth provider accounts (Google, GitHub, etc.)
- **Session**: Active user sessions
- **VerificationToken**: Email verification tokens
- **UserPreferences**: User settings and preferences

### Workspaces & Documents

- **Workspace**: Container for organizing documents and templates
- **WorkspaceMember**: Workspace collaboration and permissions
- **Document**: Text documents with version history
- **DocumentVersion**: Version control for documents
- **Template**: Reusable text templates with variables

### History & Analytics

- **TransformationHistory**: Records of AI text transformations
- **UsageStats**: Application usage analytics
- **ApiKey**: API keys for programmatic access
- **Feedback**: User feedback and support tickets

## Setup & Configuration

### 1. Environment Variables

Copy `.env.example` to `.env.local` and configure your database:

```bash
cp .env.example .env.local
```

Update the `DATABASE_URL`:

```env
# Local PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/textify"

# Or use a hosted provider:
# Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres"

# Railway
DATABASE_URL="postgresql://postgres:[PASSWORD]@containers-us-west-xxx.railway.app:5432/railway"

# Neon
DATABASE_URL="postgresql://[USER]:[PASSWORD]@ep-xxx.us-east-2.aws.neon.tech/neondb"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Create Database and Run Migrations

```bash
npm run db:push
```

For production, use migrations:

```bash
npm run db:migrate
```

## Common Operations

### Generate Prisma Client

Generates TypeScript types and client from schema:

```bash
npm run db:generate
```

### Push Schema Changes (Development)

Syncs schema to database without migrations:

```bash
npm run db:push
```

⚠️ **Warning**: This can cause data loss. Use migrations in production.

### Create a Migration

Create a new migration from schema changes:

```bash
npm run db:migrate:dev
# or with a name
npm run db:migrate:dev -- --name add_user_preferences
```

### Apply Migrations (Production)

```bash
npm run db:migrate:deploy
```

### View Database in Studio

Open Prisma Studio to browse and edit data:

```bash
npm run db:studio
```

### Reset Database

**⚠️ DANGER**: This will delete all data!

```bash
npm run db:reset
```

### Seed Database

Populate database with sample data:

```bash
npm run db:seed
```

## Migrations

### Creating Migrations

1. Modify `schema.prisma`
2. Run `npm run db:migrate:dev`
3. Review generated SQL in `prisma/migrations/`
4. Commit migration files to version control

### Migration Best Practices

✅ **DO**:

- Always create migrations for schema changes
- Review generated SQL before applying
- Test migrations on staging before production
- Keep migrations small and focused
- Include descriptive migration names

❌ **DON'T**:

- Use `db:push` in production
- Modify existing migration files
- Skip migrations in version control
- Make breaking schema changes without data migration

### Migration Workflow

```bash
# 1. Make schema changes
# Edit prisma/schema.prisma

# 2. Create migration
npm run db:migrate:dev --name your_migration_name

# 3. Review generated SQL
# Check prisma/migrations/[timestamp]_your_migration_name/

# 4. Test migration
# Verify changes in development

# 5. Commit to git
git add prisma/migrations prisma/schema.prisma
git commit -m "feat: add user preferences table"

# 6. Deploy to production
# In production environment:
npm run db:migrate:deploy
```

## Seeding

Seed the database with initial or test data.

### Create Seed File

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const user = await prisma.user.upsert({
    where: { email: 'test@textify.app' },
    update: {},
    create: {
      email: 'test@textify.app',
      name: 'Test User',
      preferences: {
        create: {},
      },
    },
  });

  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Run Seed

```bash
npm run db:seed
```

## Database Helper Utilities

Textify provides helper functions for common database operations:

### Using Database Helpers

```typescript
import { findUserByEmail, createDocument, getUserWorkspaces } from '@/lib/db';

// Find a user
const user = await findUserByEmail('user@example.com');

// Create a document
const doc = await createDocument({
  title: 'My Document',
  content: 'Document content...',
  userId: user.id,
});

// Get workspaces
const { owned, member } = await getUserWorkspaces(user.id);
```

### Available Helpers

Located in `src/lib/db/`:

- **users.ts**: User CRUD and preferences
- **documents.ts**: Document management and versioning
- **workspaces.ts**: Workspace and collaboration
- **prisma.ts**: Prisma client and utilities

## Best Practices

### 1. Always Use Transactions for Related Operations

```typescript
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: userData });
  await tx.userPreferences.create({
    data: { userId: user.id },
  });
});
```

### 2. Use Select/Include to Optimize Queries

```typescript
// ❌ Bad: Fetches all fields
const user = await prisma.user.findUnique({ where: { id } });

// ✅ Good: Only fetch needed fields
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, name: true, email: true },
});
```

### 3. Implement Soft Deletes for Important Data

```typescript
// Add to schema
model Document {
  deletedAt DateTime?
}

// Soft delete
await prisma.document.update({
  where: { id },
  data: { deletedAt: new Date() },
});

// Filter deleted records
await prisma.document.findMany({
  where: { deletedAt: null },
});
```

### 4. Use Indexes for Frequent Queries

```prisma
model User {
  email String @unique
  name  String

  @@index([email]) // Add index for email lookups
  @@index([createdAt]) // Add index for sorting
}
```

### 5. Validate Data Before Database Operations

```typescript
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
});

// Validate before creating
const data = createUserSchema.parse(input);
await prisma.user.create({ data });
```

## Troubleshooting

### Connection Issues

```bash
# Test database connection
npm run db:test

# View connection URL (sanitized)
npx prisma db pull --print
```

### Migration Issues

```bash
# Check migration status
npx prisma migrate status

# Resolve migration issues
npx prisma migrate resolve --applied [migration_name]
# or
npx prisma migrate resolve --rolled-back [migration_name]
```

### Reset Everything

```bash
# ⚠️ Deletes all data!
npm run db:reset
```

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/best-practices)
- [Database Schema Design](https://www.prisma.io/dataguide/datamodeling)

## Support

For database-related issues:

1. Check this documentation
2. Review Prisma logs: `npm run db:generate -- --help`
3. Check database connection: Test DATABASE_URL
4. Review migration history: `npx prisma migrate status`
5. Open an issue on GitHub

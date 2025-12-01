# Textify Setup Guide

This guide will help you set up Textify locally for development.

## Prerequisites

- Node.js 20.19+ or 22.12+ or 24.0+
- PostgreSQL 14+ database
- npm or yarn package manager

## 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd Textify

# Install dependencies
npm install
```

## 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values
```

### Required Environment Variables

#### Database

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/textify"
```

#### Authentication

Generate a secret key:

```bash
openssl rand -base64 32
```

Then set it in `.env.local`:

```env
AUTH_SECRET=<your-generated-secret>
NEXTAUTH_SECRET=<your-generated-secret>
NEXTAUTH_URL=http://localhost:3000
```

#### OAuth Providers

**Google OAuth**:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new OAuth 2.0 Client ID
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Add credentials to `.env.local`:

```env
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
```

**GitHub OAuth**:

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Add credentials to `.env.local`:

```env
GITHUB_ID=<your-client-id>
GITHUB_SECRET=<your-client-secret>
```

## 3. Database Setup

### Using Local PostgreSQL

```bash
# Start PostgreSQL (macOS with Homebrew)
brew services start postgresql@14

# Create database
createdb textify

# Run Prisma migrations
npm run db:migrate

# (Optional) Seed database with sample data
npm run db:seed
```

### Using Docker

```bash
# Start PostgreSQL container
docker run --name textify-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=textify \
  -p 5432:5432 \
  -d postgres:14

# Run migrations
npm run db:migrate
```

### Using Managed Services

**Supabase**:

1. Create a new project at [Supabase](https://supabase.com)
2. Copy the connection string from Settings > Database
3. Update `DATABASE_URL` in `.env.local`

**Railway**:

1. Create a new PostgreSQL database at [Railway](https://railway.app)
2. Copy the connection string
3. Update `DATABASE_URL` in `.env.local`

**Neon**:

1. Create a new project at [Neon](https://neon.tech)
2. Copy the connection string
3. Update `DATABASE_URL` in `.env.local`

## 4. Prisma Client Generation

```bash
# Generate Prisma Client
npm run db:generate

# This creates TypeScript types for your database
```

## 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 6. Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests (requires dev server running)
npm run test:e2e
```

## 7. Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check

# Format code
npm run format
```

## Database Management

### View Database (Prisma Studio)

```bash
npm run db:studio
```

This opens Prisma Studio at http://localhost:5555 where you can view and edit your database.

### Create Migrations

After modifying `prisma/schema.prisma`:

```bash
# Create a new migration
npm run db:migrate:dev

# Name your migration when prompted
```

### Reset Database

```bash
# ⚠️ WARNING: This will delete all data
npm run db:reset
```

## Troubleshooting

### Prisma Client Not Found

If you get errors about `@prisma/client` not being found:

```bash
npm run db:generate
```

### Database Connection Issues

1. Check that PostgreSQL is running
2. Verify `DATABASE_URL` in `.env.local`
3. Ensure database exists: `createdb textify`
4. Check firewall/network settings

### Authentication Not Working

1. Verify OAuth credentials are correct
2. Check redirect URIs match exactly
3. Ensure `AUTH_SECRET` is set
4. Clear browser cookies and try again

### Tests Failing

```bash
# Clear test cache
npm run test:clear

# Rebuild
npm run build
```

## Additional Configuration

### AI Features (Optional)

For AI-powered features, add API keys:

```env
OPENAI_API_KEY=sk-proj-your-key
ANTHROPIC_API_KEY=sk-ant-your-key
```

### Rate Limiting (Optional)

For production rate limiting with Redis:

```env
UPSTASH_REDIS_URL=https://xxx.upstash.io
UPSTASH_REDIS_TOKEN=your-token
```

### Monitoring (Optional)

```env
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.

## Next Steps

1. ✅ Complete environment setup
2. ✅ Run database migrations
3. ✅ Configure OAuth providers
4. ✅ Start development server
5. ✅ Run tests to verify setup
6. 🚀 Start building features!

## Getting Help

- Check [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
- Review [API Documentation](./docs/API.md)
- See [Prisma README](./prisma/README.md)

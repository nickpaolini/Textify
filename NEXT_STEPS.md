# Next Steps - Auth Setup

This file contains the remaining steps to complete authentication setup for Textify.

## Current Status ✅

- ✅ Phase 2.4 complete (Monaco Editor integration)
- ✅ `.env.local` file created with auth secrets
- ✅ Google OAuth configured (credentials in `.env.local`)
- ✅ GitHub OAuth configured (credentials in `.env.local`)

## Remaining Steps

### 1. Start PostgreSQL Database (Docker)

Run this command in your terminal:

```bash
docker run --name textify-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=textify \
  -p 5432:5432 \
  -d postgres:14
```

**Verify it's running:**

```bash
docker ps | grep textify-postgres
```

You should see the container running on port 5432.

**To stop the database later:**

```bash
docker stop textify-postgres
```

**To start it again:**

```bash
docker start textify-postgres
```

**To remove it completely:**

```bash
docker stop textify-postgres
docker rm textify-postgres
```

---

### 2. Generate Prisma Client

This creates TypeScript types for the database:

```bash
npm run db:generate
```

You should see output like:

```
✔ Generated Prisma Client (v7.0.1)
```

---

### 3. Run Database Migrations

This creates all the database tables (User, Account, Session, etc.):

```bash
npm run db:migrate:dev
```

When prompted for a migration name, enter something like:

```
initial_setup
```

You should see output showing all tables being created.

---

### 4. Enable Authentication Middleware

Currently auth middleware is disabled to allow testing without auth. To enable it:

**Option A: Keep auth optional (recommended for development)**

- Leave middleware disabled
- Auth pages (`/auth/signin`) will still work
- All other routes remain public

**Option B: Enable auth protection**

Open `src/middleware.ts` and uncomment line 3:

```typescript
// Change from:
// export { auth as middleware } from '@/lib/auth';

// To:
export { auth as middleware } from '@/lib/auth';
```

Then configure which routes to protect by updating the `matcher` array:

```typescript
export const config = {
  matcher: [
    '/dashboard/:path*', // Protect all dashboard routes
    '/api/user/:path*', // Protect user API routes
    // Add more routes as needed
  ],
};
```

---

### 5. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

### 6. Test Authentication

1. Navigate to http://localhost:3000/auth/signin
2. Click "Sign in with Google" or "Sign in with GitHub"
3. Complete OAuth flow
4. You should be redirected back and signed in
5. Check http://localhost:3000 - you should see your user info

---

### 7. Verify Database

**View data in Prisma Studio:**

```bash
npm run db:studio
```

This opens http://localhost:5555 where you can see:

- User table (your account should be there)
- Account table (OAuth provider info)
- Session table (active sessions)

---

## Troubleshooting

### Database Connection Failed

**Check Docker is running:**

```bash
docker ps
```

**Check PostgreSQL logs:**

```bash
docker logs textify-postgres
```

**Restart the container:**

```bash
docker restart textify-postgres
```

### Prisma Client Not Found

```bash
npm run db:generate
```

### Migration Failed

**Reset the database (⚠️ deletes all data):**

```bash
npm run db:migrate:reset
```

### OAuth Not Working

1. Verify redirect URIs in Google/GitHub match exactly:
   - Google: `http://localhost:3000/api/auth/callback/google`
   - GitHub: `http://localhost:3000/api/auth/callback/github`

2. Check `.env.local` has correct credentials

3. Restart dev server after changing `.env.local`

4. Clear browser cookies and try again

### Port 5432 Already in Use

Another PostgreSQL instance is running. Either:

- Stop the other instance
- Or change the port in both:
  - Docker command: `-p 5433:5432`
  - `.env.local`: `DATABASE_URL="postgresql://postgres:postgres@localhost:5433/textify"`

---

## After Auth Setup is Complete

Once authentication is working, you can continue with:

### Phase 2 - Remaining Features

- **Phase 2.2:** Advanced Find & Replace with RegEx
- **Phase 2.3:** Format Conversions (JSON/YAML/CSV/etc.)
- **Phase 2.5:** Document & Workspace Management
- **Phase 2.6:** Templates & Snippets

### Phase 3 - Advanced Features

- AI-powered text transformations (requires OpenAI API key)
- Real-time collaboration
- Sharing & permissions
- Analytics & usage tracking

### Phase 4 - Production Readiness

- Rate limiting with Redis
- Error monitoring (Sentry)
- CI/CD pipeline
- Deploy to Vercel

---

## Quick Reference

**Start everything:**

```bash
docker start textify-postgres  # Start database
npm run dev                    # Start Next.js dev server
```

**Database commands:**

```bash
npm run db:studio              # View database in browser
npm run db:migrate:dev         # Create new migration
npm run db:push                # Push schema changes (dev only)
npm run db:generate            # Regenerate Prisma Client
```

**Useful development commands:**

```bash
npm test                       # Run tests
npm run lint                   # Check code quality
npm run type-check             # Check TypeScript
npm run build                  # Test production build
```

---

## Environment Variables Quick Reference

Your `.env.local` should have:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/textify"

# Auth
AUTH_SECRET=<generated-secret>
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=http://localhost:3000

# OAuth
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-secret>
GITHUB_ID=<your-client-id>
GITHUB_SECRET=<your-secret>
```

---

## Need Help?

- **Documentation:** See `SETUP.md` for full setup guide
- **Prisma Docs:** https://www.prisma.io/docs
- **NextAuth Docs:** https://authjs.dev
- **Docker Docs:** https://docs.docker.com

---

**Last Updated:** 2025-12-02
**Current Branch:** `claude/modernize-textify-01PHHtV2FMGfCG1sbUrENWC5`
**Latest Commit:** Phase 2.4 - Monaco Editor Integration

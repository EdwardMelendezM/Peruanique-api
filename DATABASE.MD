# Database documentation (Prisma + PostgreSQL)

This document describes the database schema used by the Peruanique backend (Prisma schema in `prisma/schema.prisma`), the main models, enums, constraints, indexes, and a short set of recommended Prisma client snippets and operational notes (migrations, client generation, seeding, performance). Keep this file updated whenever you change `prisma/schema.prisma`.

---

## Overview

- ORM: Prisma (schema at `prisma/schema.prisma`). The Prisma client is generated to `app/generated/prisma`.
- Database engine: PostgreSQL (configured via `DATABASE_URL` in env).
- Auth: `better-auth` uses Prisma adapters and the `User`, `Session`, `Account` models.
- Main domain models: `Course`, `RoadmapNode`, `Question`, `Answer`, `UserProfile`, `UserProgress`, `DailySchedule`.

Assumption: this repository uses Prisma client with `prisma` CLI (dev dep). Commands below assume `pnpm`/`npm` available.

---

## How to generate / update Prisma client

1. After editing `prisma/schema.prisma` run:

```bash
# If you use pnpm
pnpm prisma generate
# or with npm
npx prisma generate
```

2. To create and apply a migration:

```bash
npx prisma migrate dev --name add_some_feature
```

3. Prisma client is generated into `app/generated/prisma` (see `generator` block in `schema.prisma`). Import it via:

```ts
import { prisma } from '@/libs/prisma';
// or the generated client directly if needed
import { PrismaClient } from '@/app/generated/prisma/client';
```

---

## Enums

Defined in `prisma/schema.prisma`:

- `Difficulty`: BEGINNER | INTERMEDIATE | ADVANCED | PROFESSIONAL
- `QuestionType`: MULTIPLE_CHOICE | DRAG_AND_DROP
- `ProgressStatus`: LOCKED | IN_PROGRESS | COMPLETED

Enums are stored as SQL enums in PostgreSQL by Prisma. When updating enums, prefer creating new enum values (removal/rename requires more care and possibly migrations).

---

## Models (summary)

Below is a concise description of each model, important fields, relations, defaults and constraints.

### User
- Primary key: `id` (uuid)
- Unique: `email`
- Important fields: `password` (nullable for OAuth-only accounts), `full_name`, `emailVerified`, `total_xp` (default 0), `streak_days` (default 0), `current_energy` (default 5), `daily_goal_minutes` (default 15)
- Relations:
  - `sessions: Session[]`
  - `accounts: Account[]`
  - `profile: UserProfile?` (one-to-one)
  - `progress: UserProgress[]`
  - `schedules: DailySchedule[]`
- Indexes:
  - `@@index([total_xp(sort: Desc)])` — used for leaderboard queries (fast ordering by total_xp)

Behavior notes:
- Deleting a User cascades to Session and Account (see relation `onDelete: Cascade` in other models).

### Session
- Primary key: `id` (uuid)
- `token` is unique (used for session lookup)
- Stores `expiresAt`, `ipAddress`, `userAgent`
- Relation to User with `onDelete: Cascade`.

### Account
- Used by `better-auth` for external/social accounts.
- Has `password` (text) for local credential storage (depending on adapter/plugins)
- Relation to User with `onDelete: Cascade`.

### Verification
- Generic table for verification tokens (identifier/value/expiresAt)

### UserProfile
- One-to-one with User (userId unique)
- Fields: `target_university`, `target_major`, `current_level_tag` (default: "novato")
- Created automatically when a new user registers (recommended behavior in auth flows).

### Course
- Primary key: `id` (uuid)
- Fields: `name`, `color_theme?`, `icon_url?`
- Relation: `nodes: RoadmapNode[]`
- Timestamps: `createdAt`, `updatedAt`

### RoadmapNode
- Primary key: `id` (uuid)
- Relation to `Course` via `courseId` (uuid)
- Fields: `title`, `order_index` (int), `difficulty_level` (enum), `is_boss_level` (boolean)
- Relations:
  - `questions: Question[]`
  - `user_progress: UserProgress[]`
- Constraint: `@@unique([courseId, order_index])` to avoid duplicate order indices per course
- Deleting a Course cascades to its nodes? (Prisma relation defined on the node side; when deleting Course ensure intended cascade or manual cleanup)

### Question
- Primary key: `id` (uuid)
- Relation to `RoadmapNode` via `nodeId`
- Fields: `question_text` (text), `explanation_text` (text?), `difficulty`, `question_type`
- Relation: `answers: Answer[]`

### Answer
- Primary key: `id` (uuid)
- Relation to `Question` via `questionId` (onDelete: Cascade)
- Fields: `answer_text` (text), `is_correct` (boolean)
- Deleting a Question cascades to its Answers

### UserProgress
- Primary key: `id` (uuid)
- Composite unique: `@@unique([userId, nodeId])` — only one progress row per user per node
- Fields: `status` (ProgressStatus enum, default LOCKED), `score_obtained` (int)
- Relation to User and RoadmapNode
- Typical use: track node completion, progress status and score

### DailySchedule
- Primary key: `id` (uuid)
- Fields: `preferred_hour` (SQL TIME), `days_of_week` (Int[]) representing 0-6 (Sun-Sat)
- Relation to User

---

## Constraints, Cascades and Uniqueness

- Unique constraints: `User.email`, `UserProfile.userId` (unique), `Account.token` / `Session.token` unique, `@@unique([courseId, order_index])` and `@@unique([userId, nodeId])`.
- Cascade deletes are used for relations where child entities must be removed when the parent is deleted (e.g., `Session`, `Account`, `Answer`). Check `schema.prisma` to confirm `onDelete` behavior for each relation.

---

## Indexes & Performance

- Leaderboard: `User` has an index on `total_xp` descending. Use this index when listing top users: orderBy: { total_xp: 'desc' } with limit/offset or cursor pagination.
- Use pagination for large lists (Courses list, RoadmapNodes list per course, Questions per node). Prefer cursor-based pagination for very large datasets.
- Avoid N+1 queries: when fetching RoadmapNodes and their first N Questions, use Prisma `include` to fetch related rows in a single query.

Example: fetch nodes and first question count (pseudo):

```ts
const nodes = await prisma.roadmapNode.findMany({
  where: { courseId },
  orderBy: { order_index: 'asc' },
  include: { questions: { take: 5 } },
});
```

For leaderboard with pagination:

```ts
const top = await prisma.user.findMany({
  orderBy: { total_xp: 'desc' },
  take: 20,
  skip: (page - 1) * 20,
  select: { id: true, full_name: true, total_xp: true }
});
```

---

## Common Prisma operations (snippets)

- Create a user and profile in a transaction:

```ts
await prisma.$transaction(async (prismaTx) => {
  const user = await prismaTx.user.create({
    data: {
      email: 'alice@example.com',
      password: 'hashed_password',
      full_name: 'Alice',
    },
  });

  await prismaTx.userProfile.create({
    data: {
      userId: user.id,
      target_university: 'UNMSM',
      target_major: 'Ingeniería',
      current_level_tag: 'novato',
    },
  });
});
```

- Core game operation (complete-node) should run in a transaction to update `UserProgress`, increment `User.total_xp`, adjust `streak_days`, and decrement `current_energy`. Example outline:

```ts
await prisma.$transaction(async (tx) => {
  // 1) upsert UserProgress for user/node
  // 2) update user.total_xp += earnedXp
  // 3) update streak_days logic (based on last completion date)
  // 4) decrement current_energy
  // 5) create audit/log entry if needed
});
```

Important: Ensure proper locks or serializable behavior if concurrent completions for the same user are possible. Prisma transactions are a good start; for high contention you may need SELECT ... FOR UPDATE at the DB level.

---

## Migrations & Seeds

- Use `npx prisma migrate dev` during development to create migrations and apply them.
- For CI and production, use `npx prisma migrate deploy` to run pending migrations.
- Keep a small `prisma/seed.ts` (or `seed.js`) to populate initial data (courses, sample roadmap nodes) and wire it to `package.json` script if desired.

Suggested seed content:
- Create core `Course` rows (Ciencias, Letras, etc.)
- Populate a few `RoadmapNode` per course with sensible `order_index`
- Add sample Questions and Answers for testing

---

## Security & Secrets

- Connection string: `DATABASE_URL` should be stored in environment securely (do not commit to repo).
- `better-auth` secret: `BETTER_AUTH_SECRET` is required and used by `libs/auth-server.ts`.
- Avoid storing plaintext passwords. Use `better-auth` or a secure hashing algorithm (bcrypt/argon2) and never log passwords.

---

## Backup & Restore

- Use PostgreSQL tools (pg_dump/pg_restore) or managed provider snapshots. Keep a documented backup schedule.

---

## Notes / Gotchas

- `@@unique([courseId, order_index])` prevents inserting two nodes with same `order_index` for a course; when reordering nodes handle conflicts by shifting indexes in a transaction.
- `UserProfile.userId` is unique: creating a profile twice for a user will fail. Ensure user registration flow creates profile only once (e.g., upsert pattern).
- When changing enum values, Prisma may need careful migration planning (Postgres enum ALTER TYPE or use string-backed enums as a workaround).

---

## Where to find the schema

- Prisma schema: `prisma/schema.prisma`
- Generated client: `app/generated/prisma`
- Prisma client helper wrapper: `libs/prisma.ts`

---

If you want, I can also:
- Produce an ER diagram (SVG/PNG) exported from the schema.
- Add a `prisma/seed.ts` starter file and a `package.json` script for seeding.
- Add sample SQL index suggestions for high-read tables.

If you want any of these, tell me which and I'll add them next.

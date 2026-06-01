# ToggleTiny

A minimalist, self-hosted feature flag management dashboard designed for indie developers and small teams who need to toggle features in production without paying for heavy enterprise tools.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Admin Dashboard** — Create, edit, delete, and toggle feature flags with a clean, responsive UI
- **Environment Splitting** — Maintain separate flag states for `development` and `production`
- **Consumption API** — Fast GET endpoint for external apps to fetch flag states
- **API Key Authentication** — Secure your endpoints with generated API keys
- **Search & Filter** — Quickly find flags by name or key
- **Response Caching** — ETag support and Cache-Control headers for optimal performance
- **SQLite Database** — Portable, zero-config database via Prisma ORM

## Screenshots

### Dashboard

The admin dashboard displays all your feature flags in a sortable, searchable table with instant toggle switches.

```
┌─────────────────────────────────────────────────────────────────┐
│  ToggleTiny                    [Development ▼] [Production]     │
├─────────────────────────────────────────────────────────────────┤
│  Feature Flags                                    [+ Add Flag]  │
│  Manage your feature flags across environments.                 │
│                                                                 │
│  🔍 Search flags by name or key...                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Name              │ Key              │ Status  │ Toggle │   │
│  ├───────────────────┼──────────────────┼─────────┼────────┤   │
│  │ New Checkout Btn  │ new-checkout-btn │ Enabled │  [●]   │   │
│  │ Beta Dashboard    │ beta-dashboard   │ Disabled│  [○]   │   │
│  │ Dark Mode         │ dark-mode        │ Enabled │  [●]   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### API Response

```json
{
  "new-checkout-btn": true,
  "beta-dashboard": false,
  "dark-mode": true
}
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/toggletiny.git
cd toggletiny
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```bash
# Database
DATABASE_URL="file:./prisma/dev.db"

# Admin dashboard password
ADMIN_PASSWORD="your-secure-password"

# API key for consumption endpoint (will be generated in step 5)
# API_KEY="tt_..."
```

### 4. Set up the database

```bash
# Generate Prisma client and run migrations
npx prisma migrate dev --name init

# Seed with sample data
npx prisma db seed
```

### 5. Generate an API key

```bash
npm run generate-api-key
```

This creates a secure `API_KEY` in your `.env` file for authenticating API requests.

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the dashboard.

Login with the password you set in `ADMIN_PASSWORD`.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | `file:./prisma/dev.db` | SQLite database file path |
| `ADMIN_PASSWORD` | Yes | — | Password for admin dashboard authentication |
| `API_KEY` | No | — | API key for consumption endpoint. If not set, the API is open (not recommended for production) |

## API Usage

### Authentication

All requests to `/api/flags` require authentication via API key:

**Option 1: Authorization Header**
```bash
curl -H "Authorization: Bearer tt_your_api_key" \
  http://localhost:3000/api/flags
```

**Option 2: X-API-Key Header**
```bash
curl -H "x-api-key: tt_your_api_key" \
  http://localhost:3000/api/flags
```

### Endpoints

#### GET /api/flags

Fetch all feature flags for a specific environment.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `env` | `string` | `production` | Environment to fetch (`development` or `production`) |

**Example Request:**
```bash
# Fetch production flags (default)
curl -H "Authorization: Bearer $API_KEY" \
  "http://localhost:3000/api/flags"

# Fetch development flags
curl -H "Authorization: Bearer $API_KEY" \
  "http://localhost:3000/api/flags?env=development"
```

**Example Response:**
```json
{
  "new-checkout-btn": true,
  "beta-dashboard": false,
  "dark-mode": true
}
```

**Response Codes:**

| Status | Description |
|--------|-------------|
| `200` | Success — returns flags JSON |
| `304` | Not Modified — use cached response (ETag matched) |
| `400` | Bad Request — invalid environment parameter |
| `401` | Unauthorized — missing or invalid API key |

### Using in Your Application

#### React / Next.js

```typescript
type FlagResponse = Record<string, boolean>;

async function fetchFlags(): Promise<FlagResponse> {
  const response = await fetch('https://your-toggletiny.com/api/flags', {
    headers: {
      'Authorization': `Bearer ${process.env.TOGGLETINY_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch flags');
  }

  return response.json();
}

// Usage
const flags = await fetchFlags();

if (flags['new-checkout-btn']) {
  // Render new checkout button
}
```

#### React Hook

```typescript
import { useState, useEffect } from 'react';

type FlagResponse = Record<string, boolean>;

export function useFeatureFlags() {
  const [flags, setFlags] = useState<FlagResponse>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/flags', {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOGGLETINY_API_KEY}`,
      },
    })
      .then(res => res.json())
      .then(setFlags)
      .finally(() => setLoading(false));
  }, []);

  return { flags, loading };
}

// In your component
function MyComponent() {
  const { flags, loading } = useFeatureFlags();

  if (loading) return <Spinner />;

  return (
    <>
      {flags['beta-feature'] && <BetaFeature />}
    </>
  );
}
```

#### Node.js / Backend

```typescript
const API_KEY = process.env.TOGGLETINY_API_KEY;
const TOGGLETINY_URL = process.env.TOGGLETINY_URL;

async function getFlags(env: 'development' | 'production' = 'production') {
  const response = await fetch(`${TOGGLETINY_URL}/api/flags?env=${env}`, {
    headers: { 'x-api-key': API_KEY },
  });
  return response.json();
}

// Cache flags at startup
let cachedFlags = {};
getFlags().then(flags => { cachedFlags = flags; });

// Check flags
if (cachedFlags['premium-feature']) {
  enablePremiumFeature();
}
```

## Caching & Performance

The API includes built-in caching headers for optimal performance:

```
Cache-Control: public, max-age=10, s-maxage=60, stale-while-revalidate=300
ETag: "abc123..."
```

| Directive | Value | Description |
|-----------|-------|-------------|
| `max-age` | 10s | Browser cache duration |
| `s-maxage` | 60s | CDN/proxy cache duration |
| `stale-while-revalidate` | 300s | Serve stale while refreshing |

**Conditional Requests:**

Use the `ETag` header for bandwidth-efficient polling:

```bash
# Store ETag from initial response
ETAG=$(curl -sI -H "Authorization: Bearer $API_KEY" \
  http://localhost:3000/api/flags | grep -i etag | cut -d' ' -f2)

# Use ETag for conditional requests
curl -H "Authorization: Bearer $API_KEY" \
  -H "If-None-Match: $ETAG" \
  http://localhost:3000/api/flags
# Returns 304 if unchanged, 200 with new data otherwise
```

## TypeScript Types

```typescript
type Environment = 'development' | 'production';

interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  isEnabled: boolean;
  environment: Environment;
  createdAt: Date;
  updatedAt: Date;
}

type FlagResponse = Record<string, boolean>;
```

## Project Structure

```
toggletiny/
├── app/
│   ├── admin/           # Dashboard pages and server actions
│   ├── api/flags/       # Consumption API endpoint
│   ├── docs/            # API documentation page
│   └── login/           # Authentication page
├── components/          # Reusable UI components
├── lib/                 # Database client and utilities
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data script
├── scripts/             # CLI utilities
├── types/               # TypeScript type definitions
└── middleware.ts        # Auth middleware
```

## Development

```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

## Deployment

ToggleTiny can be deployed to any platform that supports Next.js:

- **Vercel** — Zero-config deployment
- **Railway** — Simple container deployment
- **Docker** — Self-hosted option
- **Any Node.js host** — Standard Next.js deployment

For production, remember to:
1. Set a strong `ADMIN_PASSWORD`
2. Generate a unique `API_KEY`
3. Consider using a persistent database (PostgreSQL, MySQL) for production workloads

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Database:** [SQLite](https://sqlite.org/) via [Prisma ORM](https://www.prisma.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Auth:** Cookie-based session with password authentication

## License

MIT

---

Built for indie developers who value simplicity over complexity.

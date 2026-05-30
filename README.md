# ToggleTiny

A minimalist, self-hosted feature flag management dashboard for indie developers and small teams.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

```bash
npx prisma migrate dev
npm run seed
```

### 3. Generate an API key

```bash
npm run generate-api-key
```

This creates an `API_KEY` in your `.env` file for securing the consumption API.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the admin dashboard.

## API Authentication

The `/api/flags` endpoint requires API key authentication. Pass your key using one of these methods:

### Option 1: Authorization Header (Bearer Token)

```bash
curl -H "Authorization: Bearer tt_your_api_key_here" \
  http://localhost:3000/api/flags
```

### Option 2: x-api-key Header

```bash
curl -H "x-api-key: tt_your_api_key_here" \
  http://localhost:3000/api/flags
```

### Response Codes

- `200 OK` - Success with flags JSON
- `401 Unauthorized` - Missing or invalid API key
- `400 Bad Request` - Invalid environment parameter

### Example Usage in React

```typescript
const response = await fetch('https://your-toggletiny.com/api/flags', {
  headers: {
    'Authorization': `Bearer ${process.env.TOGGLETINY_API_KEY}`
  }
});
const flags = await response.json();
// { "new-checkout-btn": true, "beta-dashboard": false }
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite database path |
| `ADMIN_PASSWORD` | Password for admin dashboard login |
| `API_KEY` | API key for consumption endpoint authentication |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

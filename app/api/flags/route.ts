import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Environment, FlagResponse } from '@/types';

const validEnvironments: Environment[] = ['development', 'production'];

function validateApiKey(request: NextRequest): boolean {
  const expectedKey = process.env.API_KEY;
  if (!expectedKey) return true;

  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    return token === expectedKey;
  }

  const xApiKey = request.headers.get('x-api-key');
  if (xApiKey) {
    return xApiKey === expectedKey;
  }

  return false;
}

function generateETag(data: FlagResponse): string {
  const hash = createHash('md5').update(JSON.stringify(data)).digest('hex');
  return `"${hash}"`;
}

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json(
      { error: 'Unauthorized. Provide a valid API key via Authorization: Bearer <key> or x-api-key header.' },
      { status: 401 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const env = searchParams.get('env');

  const environment: Environment = env ? (env as Environment) : 'production';

  if (env && !validEnvironments.includes(env as Environment)) {
    return NextResponse.json(
      { error: `Invalid environment: ${env}. Must be 'development' or 'production'.` },
      { status: 400 }
    );
  }

  const flags = await prisma.featureFlag.findMany({
    where: { environment },
    select: { key: true, isEnabled: true },
  });

  const response: FlagResponse = {};
  for (const flag of flags) {
    response[flag.key] = flag.isEnabled;
  }

  const etag = generateETag(response);
  const ifNoneMatch = request.headers.get('if-none-match');

  if (ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        'ETag': etag,
        'Cache-Control': 'public, max-age=10, s-maxage=60, stale-while-revalidate=300',
      },
    });
  }

  return NextResponse.json(response, {
    headers: {
      'ETag': etag,
      'Cache-Control': 'public, max-age=10, s-maxage=60, stale-while-revalidate=300',
      'Vary': 'Accept-Encoding',
    },
  });
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { FlagResponse } from '@/types';

export async function GET() {
  const flags = await prisma.featureFlag.findMany({
    where: { environment: 'production' },
    select: { key: true, isEnabled: true },
  });

  const response: FlagResponse = {};
  for (const flag of flags) {
    response[flag.key] = flag.isEnabled;
  }

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    },
  });
}

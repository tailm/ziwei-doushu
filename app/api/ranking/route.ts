import { NextResponse } from 'next/server';
import { getFeatureRanking } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  const ranking = getFeatureRanking();
  return NextResponse.json({ ranking });
}
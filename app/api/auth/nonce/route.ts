import { NextResponse } from 'next/server';
import { createNonce, cleanExpiredSessions } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  cleanExpiredSessions();
  const nonce = createNonce();
  return NextResponse.json({ nonce });
}
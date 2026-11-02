import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get('ziwei_session')?.value;

  if (sessionId) {
    deleteSession(sessionId);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete('ziwei_session');
  return response;
}
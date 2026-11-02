import { NextRequest, NextResponse } from 'next/server';
import { getSession, getRechargeHistory } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get('ziwei_session')?.value;

  if (!sessionId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Session expired' }, { status: 401 });
  }

  const records = getRechargeHistory(session.user_id);
  return NextResponse.json({ records });
}
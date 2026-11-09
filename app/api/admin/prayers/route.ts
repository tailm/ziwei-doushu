import { NextRequest, NextResponse } from 'next/server';
import { getSession, getUserById, isAdmin, getDb } from '@/lib/db';

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

  const user = getUserById(session.user_id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!isAdmin(user.wallet_address)) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const db = getDb();

  const prayerRecords = db.prepare(`
    SELECT p.id, p.user_id, p.type, p.content, p.target, p.deity, p.category, p.created_at,
           u.wallet_address, u.nickname
    FROM prayer_records p
    LEFT JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
    LIMIT 500
  `).all() as Array<{
    id: number; user_id: number; type: string; content: string; target: string | null;
    deity: string | null; category: string | null; created_at: string;
    wallet_address: string; nickname: string | null;
  }>;

  return NextResponse.json({ records: prayerRecords });
}
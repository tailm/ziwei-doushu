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

  const wellnessRecords = db.prepare(`
    SELECT w.id, w.user_id, w.practice_type, w.sub_type, w.duration_minutes, w.note, w.created_at,
           u.wallet_address, u.nickname
    FROM wellness_records w
    LEFT JOIN users u ON w.user_id = u.id
    ORDER BY w.created_at DESC
    LIMIT 500
  `).all() as Array<{
    id: number; user_id: number; practice_type: string; sub_type: string | null;
    duration_minutes: number; note: string | null; created_at: string;
    wallet_address: string; nickname: string | null;
  }>;

  const recitationRecords = db.prepare(`
    SELECT r.id, r.user_id, r.session_type, r.sutra_key, r.sutra_name, r.duration_minutes, r.created_at,
           u.wallet_address, u.nickname
    FROM recitation_records r
    LEFT JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
    LIMIT 500
  `).all() as Array<{
    id: number; user_id: number; session_type: string; sutra_key: string; sutra_name: string;
    duration_minutes: number; created_at: string;
    wallet_address: string; nickname: string | null;
  }>;

  return NextResponse.json({ wellness: wellnessRecords, recitation: recitationRecords });
}
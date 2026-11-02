import { NextRequest, NextResponse } from 'next/server';
import { getSession, getUserById, getAllUsers, isAdmin } from '@/lib/db';

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

  const users = getAllUsers();
  return NextResponse.json({ users });
}
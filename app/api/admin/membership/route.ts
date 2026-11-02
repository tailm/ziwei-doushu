import { NextRequest, NextResponse } from 'next/server';
import { getSession, getUserById, setUserMembership, isAdmin } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get('ziwei_session')?.value;
  if (!sessionId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Session expired' }, { status: 401 });
  }

  const adminUser = getUserById(session.user_id);
  if (!adminUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!isAdmin(adminUser.wallet_address)) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const { user_id, tier, expires_at } = await req.json();

  if (!user_id || !tier) {
    return NextResponse.json({ error: 'Missing user_id or tier' }, { status: 400 });
  }

  if (tier !== 'free' && tier !== 'premium') {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
  }

  const updated = setUserMembership(user_id, tier, expires_at ?? null);
  if (!updated) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user: updated });
}
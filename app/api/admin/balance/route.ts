import { NextRequest, NextResponse } from 'next/server';
import { getSession, getUserById, adjustUserBalance, adjustUserCredits, isAdmin } from '@/lib/db';

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

  const { user_id, balance, credits } = await req.json();

  if (!user_id) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }

  let updated = null;
  if (balance !== undefined && balance >= 0) {
    updated = adjustUserBalance(user_id, balance);
  }
  if (credits !== undefined && credits >= 0) {
    updated = adjustUserCredits(user_id, credits);
  }

  if (!updated) {
    return NextResponse.json({ error: 'User not found or no valid fields' }, { status: 404 });
  }

  return NextResponse.json({ user: updated });
}
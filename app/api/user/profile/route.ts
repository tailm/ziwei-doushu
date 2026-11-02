import { NextRequest, NextResponse } from 'next/server';
import { getSession, updateUser } from '@/lib/db';

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

  const { nickname } = await req.json();
  if (typeof nickname !== 'string' || nickname.length > 20) {
    return NextResponse.json({ error: 'Invalid nickname' }, { status: 400 });
  }

  const updated = updateUser(session.user_id, { nickname: nickname.trim() || null });
  if (!updated) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: updated.id,
      wallet_address: updated.wallet_address,
      nickname: updated.nickname,
      membership_tier: updated.membership_tier,
    },
  });
}
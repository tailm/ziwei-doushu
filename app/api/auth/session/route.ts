import { NextRequest, NextResponse } from 'next/server';
import { getSession, getUserById } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get('ziwei_session')?.value;

  if (!sessionId) {
    return NextResponse.json({ user: null });
  }

  const session = getSession(sessionId);
  if (!session) {
    const response = NextResponse.json({ user: null });
    response.cookies.delete('ziwei_session');
    return response;
  }

  const user = getUserById(session.user_id);
  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      wallet_address: user.wallet_address,
      nickname: user.nickname,
      avatar: user.avatar,
      gender: user.gender,
      birth_date: user.birth_date,
      birth_city: user.birth_city,
      current_city: user.current_city,
      membership_tier: user.membership_tier,
      membership_expires_at: user.membership_expires_at,
      balance: user.balance,
      credits: user.credits,
      created_at: user.created_at,
    },
  });
}
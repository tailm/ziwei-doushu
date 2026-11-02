import { NextRequest, NextResponse } from 'next/server';
import { getSession, getUserById, deductCredits, logCredits, isAdmin, isMembershipActive, CREDITS_CHART, CREDITS_TIP } from '@/lib/db';

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

  const user = getUserById(session.user_id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { feature } = await req.json();

  const costMap: Record<string, number> = {
    chart: CREDITS_CHART,
    tip: CREDITS_TIP,
  };

  const featureLabels: Record<string, string> = {
    chart: '起盘',
    tip: '打赏',
  };

  const cost = costMap[feature];
  if (cost === undefined) {
    return NextResponse.json({ error: 'Invalid feature' }, { status: 400 });
  }

  const isPremium = isMembershipActive(user) || isAdmin(user.wallet_address);
  if (isPremium) {
    return NextResponse.json({ success: true, credits: user.credits, cost: 0 });
  }

  if (user.credits < cost) {
    return NextResponse.json({
      error: 'insufficient_credits',
      message: `积分不足，${featureLabels[feature] || feature}每次需要 ${cost} 积分`,
      credits: user.credits,
      cost,
    }, { status: 402 });
  }

  const ok = deductCredits(user.id, cost);
  if (!ok) {
    return NextResponse.json({ error: 'Deduction failed' }, { status: 500 });
  }

  logCredits(user.id, feature, -cost);

  const updatedUser = getUserById(user.id);
  return NextResponse.json({ success: true, credits: updatedUser?.credits ?? 0, cost });
}
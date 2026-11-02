import { NextRequest, NextResponse } from 'next/server';
import { getSession, getUserById, getOrCreateUsageLimit, isAdmin, isMembershipActive, AI_INTERPRET_COST } from '@/lib/db';

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

  const admin = isAdmin(user.wallet_address);
  const premium = isMembershipActive(user);
  const hasBalance = user.balance > 0;

  const chartLimit = getOrCreateUsageLimit(session.user_id, 'chart');

  const usage = [
    {
      feature: 'chart',
      used_count: chartLimit.used_count,
      max_count: admin || premium || hasBalance ? -1 : chartLimit.max_count,
      label: '起盘',
      available: admin || premium || hasBalance || chartLimit.used_count < chartLimit.max_count,
    },
    {
      feature: 'heming',
      used_count: 0,
      max_count: admin || premium || hasBalance ? -1 : 0,
      label: '合盘',
      available: admin || premium || hasBalance,
    },
    {
      feature: 'ai_interpret',
      used_count: 0,
      max_count: admin || premium ? -1 : Math.floor(user.balance),
      label: 'AI解盘',
      available: admin || premium || user.balance >= AI_INTERPRET_COST,
      cost_per_use: AI_INTERPRET_COST,
    },
  ];

  return NextResponse.json({
    usage,
    balance: user.balance,
    membership_tier: admin ? 'admin' : user.membership_tier,
  });
}
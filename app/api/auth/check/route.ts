import { NextRequest, NextResponse } from 'next/server';
import { getSession, getUserById, getOrCreateUsageLimit, isAdmin, isMembershipActive, CREDITS_CHART, CREDITS_HEMING, CREDITS_AI_INTERPRET, CREDITS_AI_QA } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get('ziwei_session')?.value;

  if (!sessionId) {
    return NextResponse.json({
      authenticated: false,
      can_use_chart: true,
      can_use_heming: false,
      can_use_ai: false,
      can_use_ai_qa: false,
      chart_remaining: 3,
      balance: 0,
      credits: 0,
      membership_tier: 'free',
    });
  }

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({
      authenticated: false,
      can_use_chart: true,
      can_use_heming: false,
      can_use_ai: false,
      can_use_ai_qa: false,
      chart_remaining: 3,
      balance: 0,
      credits: 0,
      membership_tier: 'free',
    });
  }

  const user = getUserById(session.user_id);
  if (!user) {
    return NextResponse.json({
      authenticated: false,
      can_use_chart: true,
      can_use_heming: false,
      can_use_ai: false,
      can_use_ai_qa: false,
      chart_remaining: 3,
      balance: 0,
      credits: 0,
      membership_tier: 'free',
    });
  }

  const admin = isAdmin(user.wallet_address);
  const premium = isMembershipActive(user);
  const chartLimit = getOrCreateUsageLimit(user.id, 'chart');
  const chartRemaining = Math.max(0, chartLimit.max_count - chartLimit.used_count);

  return NextResponse.json({
    authenticated: true,
    can_use_chart: admin || premium || user.credits >= CREDITS_CHART,
    can_use_heming: admin || premium || user.credits >= CREDITS_HEMING,
    can_use_ai: admin || premium || user.credits >= CREDITS_AI_INTERPRET,
    can_use_ai_qa: admin || premium || user.credits >= CREDITS_AI_QA,
    chart_remaining: admin || premium ? -1 : chartRemaining,
    chart_used: chartLimit.used_count,
    chart_total: admin || premium ? -1 : chartLimit.max_count,
    balance: user.balance,
    credits: user.credits,
    membership_tier: admin ? 'admin' : user.membership_tier,
    wallet_address: user.wallet_address,
    nickname: user.nickname,
  });
}
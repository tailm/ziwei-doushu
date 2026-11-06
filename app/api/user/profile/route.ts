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

  const body = await req.json();
  const updates: Record<string, string | null> = {};

  if (body.nickname !== undefined) {
    if (typeof body.nickname !== 'string' || body.nickname.length > 20) {
      return NextResponse.json({ error: 'Invalid nickname' }, { status: 400 });
    }
    updates.nickname = body.nickname.trim() || null;
  }

  if (body.gender !== undefined) {
    const validGenders = ['male', 'female', ''];
    if (!validGenders.includes(body.gender)) {
      return NextResponse.json({ error: 'Invalid gender' }, { status: 400 });
    }
    updates.gender = body.gender || null;
  }

  if (body.birth_date !== undefined) {
    if (typeof body.birth_date !== 'string' || body.birth_date.length > 20) {
      return NextResponse.json({ error: 'Invalid birth_date' }, { status: 400 });
    }
    updates.birth_date = body.birth_date.trim() || null;
  }

  if (body.birth_city !== undefined) {
    if (typeof body.birth_city !== 'string' || body.birth_city.length > 50) {
      return NextResponse.json({ error: 'Invalid birth_city' }, { status: 400 });
    }
    updates.birth_city = body.birth_city.trim() || null;
  }

  if (body.current_city !== undefined) {
    if (typeof body.current_city !== 'string' || body.current_city.length > 50) {
      return NextResponse.json({ error: 'Invalid current_city' }, { status: 400 });
    }
    updates.current_city = body.current_city.trim() || null;
  }

  const updated = updateUser(session.user_id, updates);
  if (!updated) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: updated.id,
      wallet_address: updated.wallet_address,
      nickname: updated.nickname,
      gender: updated.gender,
      birth_date: updated.birth_date,
      birth_city: updated.birth_city,
      current_city: updated.current_city,
      membership_tier: updated.membership_tier,
    },
  });
}
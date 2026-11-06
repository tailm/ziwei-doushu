import { NextRequest, NextResponse } from 'next/server';
import { getSession, getUserById, createRecitationRecord, getRecitationRecords, getRecitationStreak, addCredits, logCredits } from '@/lib/db';

export const runtime = 'nodejs';

const CREDITS_PER_CHECKIN = 2;

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get('ziwei_session')?.value;
  if (!sessionId) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'session_expired' }, { status: 401 });
  }

  const user = getUserById(session.user_id);
  if (!user) {
    return NextResponse.json({ error: 'user_not_found' }, { status: 404 });
  }

  const body = await req.json();
  const { session_type, sutra_key, sutra_name, duration_minutes } = body;

  if (!session_type || !sutra_key || !sutra_name) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  if (session_type !== 'morning' && session_type !== 'evening') {
    return NextResponse.json({ error: 'invalid_session_type' }, { status: 400 });
  }

  if (sutra_key.length > 50 || sutra_name.length > 100) {
    return NextResponse.json({ error: 'field_too_long' }, { status: 400 });
  }



  const streakInfo = getRecitationStreak(user.id);
  const isFirstCheckinToday = !(streakInfo.today_checked.morning || streakInfo.today_checked.evening);

  const record = createRecitationRecord(user.id, session_type, sutra_key, sutra_name, duration_minutes);

  const creditsAwarded = isFirstCheckinToday ? CREDITS_PER_CHECKIN : 0;
  if (creditsAwarded > 0) {
    addCredits(user.id, creditsAwarded);
    logCredits(user.id, `recitation_${session_type}`, creditsAwarded);
  }

  const newStreak = getRecitationStreak(user.id);
  return NextResponse.json({
    success: true,
    record,
    streak: newStreak,
    credits_awarded: creditsAwarded,
  });
}

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get('ziwei_session')?.value;
  if (!sessionId) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'session_expired' }, { status: 401 });
  }

  const user = getUserById(session.user_id);
  if (!user) {
    return NextResponse.json({ error: 'user_not_found' }, { status: 404 });
  }

  const url = new URL(req.url);
  const sessionType = url.searchParams.get('session_type') ?? undefined;
  const action = url.searchParams.get('action');

  if (action === 'streak') {
    const streak = getRecitationStreak(user.id);
    return NextResponse.json({ streak });
  }

  const records = getRecitationRecords(user.id, sessionType);
  return NextResponse.json({ records });
}
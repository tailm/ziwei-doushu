import { NextRequest, NextResponse } from 'next/server';
import {
  getSession,
  getUserById,
  createWellnessRecord,
  getWellnessRecords,
  getWellnessStreak,
  addCredits,
  logCredits,
} from '@/lib/db';

export const runtime = 'nodejs';

const VALID_PRACTICE_TYPES = ['vegetarian', 'meditation', 'reflection', 'taichi', 'charity'];
const CREDITS_MAP: Record<string, number> = {
  vegetarian: 2,
  meditation: 2,
  reflection: 2,
  taichi: 2,
  charity: 2,
};

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
  const { practice_type, sub_type, duration_minutes, note } = body;

  if (!practice_type || !VALID_PRACTICE_TYPES.includes(practice_type)) {
    return NextResponse.json({ error: 'invalid_practice_type' }, { status: 400 });
  }

  if (sub_type && sub_type.length > 50) {
    return NextResponse.json({ error: 'sub_type_too_long' }, { status: 400 });
  }

  if (note && note.length > 200) {
    return NextResponse.json({ error: 'note_too_long' }, { status: 400 });
  }


  const streakInfo = getWellnessStreak(user.id, practice_type);
  const isFirstCheckinToday = !streakInfo.today_checked;

  const record = createWellnessRecord(user.id, practice_type, sub_type, duration_minutes, note);

  const credits = isFirstCheckinToday ? (CREDITS_MAP[practice_type] || 1) : 0;
  if (credits > 0) {
    addCredits(user.id, credits);
    logCredits(user.id, `wellness_${practice_type}`, credits);
  }

  const newStreak = getWellnessStreak(user.id, practice_type);
  return NextResponse.json({
    success: true,
    record,
    streak: newStreak,
    credits_awarded: credits,
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
  const practiceType = url.searchParams.get('practice_type') ?? undefined;
  const action = url.searchParams.get('action');

  if (action === 'streak' && practiceType) {
    const streak = getWellnessStreak(user.id, practiceType);
    return NextResponse.json({ streak });
  }

  const records = getWellnessRecords(user.id, practiceType);
  return NextResponse.json({ records });
}
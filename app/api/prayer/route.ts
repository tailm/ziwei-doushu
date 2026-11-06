import { NextRequest, NextResponse } from 'next/server';
import { getSession, getUserById, createPrayerRecord, getPrayerRecords } from '@/lib/db';

export const runtime = 'nodejs';

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
  const { type, content, target, deity, category } = body;

  if (!type || !content) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  const record = createPrayerRecord(user.id, type, content, target, deity, category);
  return NextResponse.json({ success: true, record });
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
  const type = url.searchParams.get('type') ?? undefined;

  const records = getPrayerRecords(user.id, type);
  return NextResponse.json({ records });
}
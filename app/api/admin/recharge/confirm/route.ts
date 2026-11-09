import { NextRequest, NextResponse } from 'next/server';
import { getSession, getUserById, isAdmin, confirmRecharge, addBalance, getRechargeByTxHash, getDb } from '@/lib/db';

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

  if (!isAdmin(user.wallet_address)) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const body = await req.json();
  const { record_id, action } = body;

  if (!record_id || !action) {
    return NextResponse.json({ error: 'Missing record_id or action' }, { status: 400 });
  }

  const db = getDb();

  if (action === 'confirm') {
    const record = db.prepare('SELECT * FROM recharge_records WHERE id = ?').get(record_id) as {
      id: number; user_id: number; amount: number; status: string;
    } | undefined;

    if (!record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    if (record.status === 'confirmed') {
      return NextResponse.json({ error: 'Already confirmed' }, { status: 400 });
    }

    confirmRecharge(record_id);
    addBalance(record.user_id, record.amount);

    return NextResponse.json({ success: true, message: '充值已确认，余额已更新' });
  }

  if (action === 'reject') {
    db.prepare('UPDATE recharge_records SET status = ? WHERE id = ?').run('rejected', record_id);
    return NextResponse.json({ success: true, message: '充值已拒绝' });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
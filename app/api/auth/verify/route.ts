import { NextRequest, NextResponse } from 'next/server';
import { SiweMessage } from 'siwe';
import { consumeNonce, createUser, createSession, logCredits, CREDITS_NEW_USER, isAdmin } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { message, signature } = await req.json();

    if (!message || !signature) {
      return NextResponse.json({ error: 'Missing message or signature' }, { status: 400 });
    }

    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.verify({ signature });

    if (!fields.success) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    if (!consumeNonce(siweMessage.nonce)) {
      return NextResponse.json({ error: 'Invalid or expired nonce' }, { status: 401 });
    }

    const user = createUser(siweMessage.address);
    if (user.credits === CREDITS_NEW_USER) {
      logCredits(user.id, 'new_user_bonus', CREDITS_NEW_USER);
    }
    const session = createSession(user.id, siweMessage.address);

    const response = NextResponse.json({
      user: {
        id: user.id,
        wallet_address: user.wallet_address,
        nickname: user.nickname,
        membership_tier: isAdmin(user.wallet_address) ? 'admin' : user.membership_tier,
        balance: user.balance,
        credits: user.credits,
      },
      session: session.id,
    });

    response.cookies.set('ziwei_session', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Verification failed';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
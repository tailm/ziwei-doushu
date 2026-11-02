import { NextRequest, NextResponse } from 'next/server';
import { getSession, getUserById } from '@/lib/db';
import { CHAIN_CONFIGS, getReceivingAddress, getSupportedChains, getSupportedTokens, getTokenDecimals } from '@/lib/blockchain/config';

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

  const chains = getSupportedChains();
  const tokens = getSupportedTokens();
  const receivingAddress = getReceivingAddress();

  const chainInfo = chains.map(c => {
    const config = CHAIN_CONFIGS[c.id];
    const tokenContracts: Record<string, string> = {};
    const tokenDecimals: Record<string, number> = {};
    for (const t of tokens) {
      tokenContracts[t] = config.tokens[t];
      tokenDecimals[t] = getTokenDecimals(c.id, t);
    }
    return {
      id: c.id,
      name: config.name,
      name_cn: c.name_cn,
      chain_id: c.chain_id,
      receiving_address: receivingAddress,
      token_contracts: tokenContracts,
      token_decimals: tokenDecimals,
    };
  });

  return NextResponse.json({
    balance: user.balance,
    membership_tier: user.membership_tier,
    supported_chains: chainInfo,
    supported_tokens: tokens,
  });
}
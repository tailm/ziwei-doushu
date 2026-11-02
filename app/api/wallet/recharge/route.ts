import { NextRequest, NextResponse } from 'next/server';
import { getSession, getUserById, createRechargeRecord } from '@/lib/db';
import { CHAIN_CONFIGS, getReceivingAddress, getTokenContract, type ChainId, type TokenSymbol } from '@/lib/blockchain/config';

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

  const { tx_hash, amount, from_address, chain, token } = await req.json();

  if (!tx_hash || !amount || !from_address) {
    return NextResponse.json({ error: 'Missing tx_hash, amount, or from_address' }, { status: 400 });
  }

  if (amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  if (from_address.toLowerCase() !== user.wallet_address.toLowerCase()) {
    return NextResponse.json({ error: 'from_address does not match logged-in wallet' }, { status: 403 });
  }

  const chainId = (chain || 'ethereum') as ChainId;
  const tokenSymbol = (token || 'USDT') as TokenSymbol;

  if (!CHAIN_CONFIGS[chainId]) {
    return NextResponse.json({ error: 'Unsupported chain' }, { status: 400 });
  }

  if (!CHAIN_CONFIGS[chainId].tokens[tokenSymbol]) {
    return NextResponse.json({ error: 'Unsupported token' }, { status: 400 });
  }

  const receivingAddress = getReceivingAddress();
  const tokenContract = getTokenContract(chainId, tokenSymbol);

  const record = createRechargeRecord(
    user.id,
    tx_hash,
    amount,
    from_address,
    receivingAddress,
    chainId,
    tokenSymbol,
  );

  return NextResponse.json({
    record_id: record.id,
    status: record.status,
    receiving_address: receivingAddress,
    token_contract: tokenContract,
    chain: chainId,
    token: tokenSymbol,
  });
}
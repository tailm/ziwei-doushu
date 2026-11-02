import { NextRequest, NextResponse } from 'next/server';
import { getSession, getUserById, getRechargeByTxHash, confirmRecharge, addBalance, addCredits, logCredits, getDb, CREDITS_PER_USD } from '@/lib/db';
import { CHAIN_CONFIGS, ERC20_TRANSFER_TOPIC, getTokenDecimals, type ChainId, type TokenSymbol } from '@/lib/blockchain/config';

export const runtime = 'nodejs';

interface EthLog {
  topics: string[];
  data: string;
  address: string;
}

const MIN_CONFIRMATIONS: Record<ChainId, number> = {
  ethereum: 12,
  polygon: 20,
  bsc: 15,
};

async function verifyTransaction(
  txHash: string,
  expectedFrom: string,
  expectedTo: string,
  expectedAmount: number,
  chain: ChainId,
  token: TokenSymbol,
): Promise<boolean> {
  const config = CHAIN_CONFIGS[chain];
  if (!config) return false;

  const apiKey = process.env[config.explorer_api_key_env] || '';
  const decimals = getTokenDecimals(chain, token);

  try {
    const url = `${config.explorer_api}?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${apiKey}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    const data = await response.json();

    if (!data.result || data.result.status !== '0x1') {
      return false;
    }

    const txBlockNumber = data.result.blockNumber;
    if (!txBlockNumber) return false;

    const blockUrl = `${config.explorer_api}?module=proxy&action=eth_blockNumber&apikey=${apiKey}`;
    const blockResponse = await fetch(blockUrl, { signal: AbortSignal.timeout(15000) });
    const blockData = await blockResponse.json();
    const currentBlock = blockData.result ? BigInt(blockData.result) : BigInt(0);
    const confirmations = currentBlock - BigInt(txBlockNumber);
    const minConf = BigInt(MIN_CONFIRMATIONS[chain] || 12);

    if (confirmations < minConf) {
      return false;
    }

    const logs: EthLog[] = data.result.logs || [];
    const tokenContract = config.tokens[token].toLowerCase();

    for (const log of logs) {
      if (log.address.toLowerCase() !== tokenContract) continue;
      if (log.topics[0] !== ERC20_TRANSFER_TOPIC) continue;

      const fromAddr = '0x' + log.topics[1].slice(26);
      const toAddr = '0x' + log.topics[2].slice(26);
      const rawAmount = BigInt(log.data);
      const amount = Number(rawAmount) / Math.pow(10, decimals);

      if (fromAddr.toLowerCase() === expectedFrom.toLowerCase() &&
          toAddr.toLowerCase() === expectedTo.toLowerCase() &&
          amount >= expectedAmount) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

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

  const { tx_hash } = await req.json();

  if (!tx_hash) {
    return NextResponse.json({ error: 'Missing tx_hash' }, { status: 400 });
  }

  const record = getRechargeByTxHash(tx_hash);
  if (!record) {
    return NextResponse.json({ error: 'Recharge record not found' }, { status: 404 });
  }

  if (record.status === 'confirmed') {
    return NextResponse.json({ status: 'confirmed', message: 'Already confirmed' });
  }

  if (record.user_id !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const chain = (record.chain || 'ethereum') as ChainId;
  const token = (record.token || 'USDT') as TokenSymbol;

  const verified = await verifyTransaction(
    record.tx_hash,
    record.from_address,
    record.to_address,
    record.amount,
    chain,
    token,
  );

  if (!verified) {
    return NextResponse.json({
      status: 'pending',
      message: 'Transaction not yet confirmed on chain. Please try again later.',
    }, { status: 202 });
  }

  const db = getDb();
  const confirmResult = db.transaction(() => {
    const currentRecord = getRechargeByTxHash(tx_hash);
    if (!currentRecord || currentRecord.status === 'confirmed') {
      return null;
    }
    confirmRecharge(currentRecord.id);
    addBalance(user.id, currentRecord.amount);
    const creditsGained = Math.round(currentRecord.amount * CREDITS_PER_USD);
    addCredits(user.id, creditsGained);
    logCredits(user.id, 'recharge_bonus', creditsGained);
    return currentRecord;
  })();

  if (!confirmResult) {
    return NextResponse.json({ status: 'confirmed', message: 'Already confirmed or not found' });
  }

  const updatedUser = getUserById(user.id);

  return NextResponse.json({
    status: 'confirmed',
    amount: confirmResult.amount,
    token: confirmResult.token,
    chain: confirmResult.chain,
    new_balance: updatedUser?.balance ?? 0,
  });
}
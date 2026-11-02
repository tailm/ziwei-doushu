import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';

export const ADMIN_WALLET_ADDRESS = '0xEe964B82D61e51196Dd22Bf6dcB75Ea3D04a87a8';

export function isAdmin(walletAddress: string): boolean {
  return walletAddress.toLowerCase() === ADMIN_WALLET_ADDRESS.toLowerCase();
}

export function isMembershipActive(user: UserRow): boolean {
  if (user.membership_tier !== 'premium') return false;
  if (!user.membership_expires_at) return true;
  return user.membership_expires_at > Math.floor(Date.now() / 1000);
}

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  const dbPath = path.join(process.cwd(), 'data', 'ziwei.db');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  initSchema(db);
  return db;
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wallet_address TEXT UNIQUE NOT NULL,
      nickname TEXT,
      avatar TEXT,
      membership_tier TEXT DEFAULT 'free',
      membership_expires_at INTEGER,
      balance REAL DEFAULT 0,
      credits INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      wallet_address TEXT NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      expires_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS usage_limits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      feature TEXT NOT NULL,
      used_count INTEGER DEFAULT 0,
      max_count INTEGER DEFAULT 3,
      period_start INTEGER DEFAULT (strftime('%s', 'now')),
      period_end INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS nonces (
      nonce TEXT PRIMARY KEY,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      expires_at INTEGER NOT NULL,
      used INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS recharge_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      tx_hash TEXT UNIQUE NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      from_address TEXT NOT NULL,
      to_address TEXT NOT NULL,
      chain TEXT DEFAULT 'ethereum',
      token TEXT DEFAULT 'USDT',
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      confirmed_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS credits_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      feature TEXT NOT NULL,
      amount INTEGER NOT NULL,
      balance_after INTEGER NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
    CREATE INDEX IF NOT EXISTS idx_usage_user_feature ON usage_limits(user_id, feature);
    CREATE INDEX IF NOT EXISTS idx_nonces_expires ON nonces(expires_at);
    CREATE INDEX IF NOT EXISTS idx_recharge_user ON recharge_records(user_id);
    CREATE INDEX IF NOT EXISTS idx_recharge_status ON recharge_records(status);
    CREATE INDEX IF NOT EXISTS idx_credits_log_user ON credits_log(user_id);
  `);

  // 迁移：为已有数据库添加 credits 字段
  const userColumns = database.prepare("PRAGMA table_info(users)").all() as Array<{ name: string }>;
  if (!userColumns.some(c => c.name === 'credits')) {
    database.exec('ALTER TABLE users ADD COLUMN credits INTEGER DEFAULT 0');
  }
}

export interface UserRow {
  id: number;
  wallet_address: string;
  nickname: string | null;
  avatar: string | null;
  membership_tier: string;
  membership_expires_at: number | null;
  balance: number;
  credits: number;
  created_at: number;
  updated_at: number;
}

export interface SessionRow {
  id: string;
  user_id: number;
  wallet_address: string;
  created_at: number;
  expires_at: number;
}

export interface UsageLimitRow {
  id: number;
  user_id: number;
  feature: string;
  used_count: number;
  max_count: number;
  period_start: number;
  period_end: number | null;
}

export interface RechargeRecordRow {
  id: number;
  user_id: number;
  tx_hash: string;
  amount: number;
  status: string;
  from_address: string;
  to_address: string;
  chain: string;
  token: string;
  created_at: number;
  confirmed_at: number | null;
}

export interface CreditsLogRow {
  id: number;
  user_id: number;
  feature: string;
  amount: number;
  balance_after: number;
  created_at: number;
}

export const FREE_TIER_TOTAL_LIMIT = 3;
export const AI_INTERPRET_COST = 1;
export const SESSION_DURATION = 7 * 24 * 60 * 60;
export const NONCE_DURATION = 5 * 60;
export const USDT_RECEIVING_ADDRESS = process.env.USDT_RECEIVING_ADDRESS || '0x0000000000000000000000000000000000000000';
export const USDT_CONTRACT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

export const CREDITS_NEW_USER = 50;
export const CREDITS_PER_USD = 100;
export const CREDITS_CHART = 20;
export const CREDITS_HEMING = 50;
export const CREDITS_AI_INTERPRET = 100;
export const CREDITS_AI_QA = 10;
export const CREDITS_TIP = 10;
export const CREDITS_DAILY = 10;
export const CREDITS_CEZI = 10;
export const CREDITS_CHOUQIAN = 10;
export const CREDITS_TONGQIAN = 10;

export function createUser(walletAddress: string): UserRow {
  const db = getDb();
  const existing = getUserByAddress(walletAddress);
  if (existing) {
    db.prepare("UPDATE users SET updated_at = strftime('%s', 'now') WHERE wallet_address = ?").run(walletAddress);
    return getUserByAddress(walletAddress)!;
  }
  const stmt = db.prepare(`
    INSERT INTO users (wallet_address, credits) VALUES (?, ?)
    RETURNING *
  `);
  return stmt.get(walletAddress, CREDITS_NEW_USER) as UserRow;
}

export function getUserByAddress(walletAddress: string): UserRow | null {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM users WHERE wallet_address = ?');
  return stmt.get(walletAddress) as UserRow | null;
}

export function getUserById(id: number): UserRow | null {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id) as UserRow | null;
}

export function updateUser(id: number, fields: Partial<Pick<UserRow, 'nickname' | 'avatar' | 'membership_tier' | 'membership_expires_at' | 'balance' | 'credits'>>): UserRow | null {
  const db = getDb();
  const sets: string[] = [];
  const values: (string | number | null)[] = [];

  if (fields.nickname !== undefined) { sets.push('nickname = ?'); values.push(fields.nickname); }
  if (fields.avatar !== undefined) { sets.push('avatar = ?'); values.push(fields.avatar); }
  if (fields.membership_tier !== undefined) { sets.push('membership_tier = ?'); values.push(fields.membership_tier); }
  if (fields.membership_expires_at !== undefined) { sets.push('membership_expires_at = ?'); values.push(fields.membership_expires_at); }
  if (fields.balance !== undefined) { sets.push('balance = ?'); values.push(fields.balance); }
  if (fields.credits !== undefined) { sets.push('credits = ?'); values.push(fields.credits); }

  if (sets.length === 0) return getUserById(id);

  sets.push("updated_at = strftime('%s', 'now')");
  values.push(id);

  db.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`).run(...values);
  return getUserById(id);
}

export function addBalance(userId: number, amount: number): UserRow | null {
  const db = getDb();
  db.prepare('UPDATE users SET balance = balance + ?, updated_at = strftime(\'%s\', \'now\') WHERE id = ?').run(amount, userId);
  return getUserById(userId);
}

export function deductBalance(userId: number, amount: number): boolean {
  const db = getDb();
  const user = getUserById(userId);
  if (!user || user.balance < amount) return false;
  db.prepare('UPDATE users SET balance = balance - ?, updated_at = strftime(\'%s\', \'now\') WHERE id = ?').run(amount, userId);
  return true;
}

export function addCredits(userId: number, amount: number): UserRow | null {
  const db = getDb();
  db.prepare('UPDATE users SET credits = credits + ?, updated_at = strftime(\'%s\', \'now\') WHERE id = ?').run(amount, userId);
  return getUserById(userId);
}

export function deductCredits(userId: number, amount: number): boolean {
  const db = getDb();
  const user = getUserById(userId);
  if (!user || user.credits < amount) return false;
  db.prepare('UPDATE users SET credits = credits - ?, updated_at = strftime(\'%s\', \'now\') WHERE id = ?').run(amount, userId);
  return true;
}

export function logCredits(userId: number, feature: string, amount: number): void {
  const db = getDb();
  const user = getUserById(userId);
  if (!user) return;
  db.prepare(`
    INSERT INTO credits_log (user_id, feature, amount, balance_after)
    VALUES (?, ?, ?, ?)
  `).run(userId, feature, amount, user.credits);
}

export function getCreditsLog(userId: number, limit: number = 50): CreditsLogRow[] {
  const db = getDb();
  return db.prepare('SELECT * FROM credits_log WHERE user_id = ? ORDER BY created_at DESC LIMIT ?').all(userId, limit) as CreditsLogRow[];
}

export function createSession(userId: number, walletAddress: string): SessionRow {
  const db = getDb();
  const sessionId = generateSessionId();
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION;
  db.prepare(`
    INSERT INTO sessions (id, user_id, wallet_address, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(sessionId, userId, walletAddress, expiresAt);
  return { id: sessionId, user_id: userId, wallet_address: walletAddress, created_at: Math.floor(Date.now() / 1000), expires_at: expiresAt };
}

export function getSession(sessionId: string): SessionRow | null {
  const db = getDb();
  const now = Math.floor(Date.now() / 1000);
  const stmt = db.prepare('SELECT * FROM sessions WHERE id = ? AND expires_at > ?');
  return stmt.get(sessionId, now) as SessionRow | null;
}

export function deleteSession(sessionId: string): void {
  const db = getDb();
  db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
}

export function cleanExpiredSessions(): void {
  const db = getDb();
  const now = Math.floor(Date.now() / 1000);
  db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(now);
  db.prepare('DELETE FROM nonces WHERE expires_at <= ?').run(now);
}

export function createNonce(): string {
  const db = getDb();
  const nonce = generateNonce();
  const expiresAt = Math.floor(Date.now() / 1000) + NONCE_DURATION;
  db.prepare('INSERT INTO nonces (nonce, expires_at) VALUES (?, ?)').run(nonce, expiresAt);
  return nonce;
}

export function consumeNonce(nonce: string): boolean {
  const db = getDb();
  const now = Math.floor(Date.now() / 1000);
  const row = db.prepare('SELECT * FROM nonces WHERE nonce = ? AND expires_at > ? AND used = 0').get(nonce, now);
  if (!row) return false;
  db.prepare('UPDATE nonces SET used = 1 WHERE nonce = ?').run(nonce);
  return true;
}

export function getOrCreateUsageLimit(userId: number, feature: string): UsageLimitRow {
  const db = getDb();
  const now = Math.floor(Date.now() / 1000);

  let row = db.prepare('SELECT * FROM usage_limits WHERE user_id = ? AND feature = ?').get(userId, feature) as UsageLimitRow | null;

  if (!row) {
    const user = getUserById(userId);
    const maxCount = user?.membership_tier === 'premium' || (user && isAdmin(user.wallet_address)) ? 999999 : FREE_TIER_TOTAL_LIMIT;
    db.prepare(`
      INSERT INTO usage_limits (user_id, feature, used_count, max_count, period_start, period_end)
      VALUES (?, ?, 0, ?, ?, NULL)
    `).run(userId, feature, maxCount, now);
    row = db.prepare('SELECT * FROM usage_limits WHERE user_id = ? AND feature = ?').get(userId, feature) as UsageLimitRow;
  }

  return row!;
}

export function incrementUsage(userId: number, feature: string): UsageLimitRow | null {
  const db = getDb();
  const limit = getOrCreateUsageLimit(userId, feature);
  if (limit.used_count >= limit.max_count) return null;
  db.prepare('UPDATE usage_limits SET used_count = used_count + 1 WHERE id = ?').run(limit.id);
  return db.prepare('SELECT * FROM usage_limits WHERE id = ?').get(limit.id) as UsageLimitRow;
}

export function createRechargeRecord(userId: number, txHash: string, amount: number, fromAddress: string, toAddress: string, chain: string = 'ethereum', token: string = 'USDT'): RechargeRecordRow {
  const db = getDb();
  db.prepare(`
    INSERT INTO recharge_records (user_id, tx_hash, amount, status, from_address, to_address, chain, token)
    VALUES (?, ?, ?, 'pending', ?, ?, ?, ?)
  `).run(userId, txHash, amount, fromAddress, toAddress, chain, token);
  return db.prepare('SELECT * FROM recharge_records WHERE tx_hash = ?').get(txHash) as RechargeRecordRow;
}

export function getRechargeByTxHash(txHash: string): RechargeRecordRow | null {
  const db = getDb();
  return db.prepare('SELECT * FROM recharge_records WHERE tx_hash = ?').get(txHash) as RechargeRecordRow | null;
}

export function confirmRecharge(recordId: number): RechargeRecordRow | null {
  const db = getDb();
  const now = Math.floor(Date.now() / 1000);
  db.prepare('UPDATE recharge_records SET status = ?, confirmed_at = ? WHERE id = ?').run('confirmed', now, recordId);
  return db.prepare('SELECT * FROM recharge_records WHERE id = ?').get(recordId) as RechargeRecordRow;
}

export function getRechargeHistory(userId: number): RechargeRecordRow[] {
  const db = getDb();
  return db.prepare('SELECT * FROM recharge_records WHERE user_id = ? ORDER BY created_at DESC').all(userId) as RechargeRecordRow[];
}

function generateSessionId(): string {
  return crypto.randomBytes(36).toString('base64url');
}

function generateNonce(): string {
  return crypto.randomBytes(24).toString('base64url');
}
export function getAllUsers(): UserRow[] {
  const db = getDb();
  return db.prepare('SELECT * FROM users ORDER BY created_at DESC').all() as UserRow[];
}

export function getAllRechargeRecords(): RechargeRecordRow[] {
  const db = getDb();
  return db.prepare('SELECT * FROM recharge_records ORDER BY created_at DESC').all() as RechargeRecordRow[];
}

export function getRechargeRecordsByStatus(status: string): RechargeRecordRow[] {
  const db = getDb();
  return db.prepare('SELECT * FROM recharge_records WHERE status = ? ORDER BY created_at DESC').all(status) as RechargeRecordRow[];
}

export function setUserMembership(userId: number, tier: string, expiresAt: number | null): UserRow | null {
  return updateUser(userId, { membership_tier: tier, membership_expires_at: expiresAt });
}

export function adjustUserBalance(userId: number, newBalance: number): UserRow | null {
  return updateUser(userId, { balance: newBalance });
}
export function adjustUserCredits(userId: number, newCredits: number): UserRow | null {
  return updateUser(userId, { credits: newCredits });
}
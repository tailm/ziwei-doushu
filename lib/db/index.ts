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

    CREATE TABLE IF NOT EXISTS prayer_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      target TEXT,
      deity TEXT,
      category TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_prayer_user ON prayer_records(user_id);
    CREATE INDEX IF NOT EXISTS idx_prayer_type ON prayer_records(type);

    CREATE TABLE IF NOT EXISTS recitation_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      session_type TEXT NOT NULL,
      sutra_key TEXT NOT NULL,
      sutra_name TEXT NOT NULL,
      duration_minutes INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_recitation_user ON recitation_records(user_id);
    CREATE INDEX IF NOT EXISTS idx_recitation_session ON recitation_records(session_type);
    CREATE INDEX IF NOT EXISTS idx_recitation_date ON recitation_records(created_at);

    CREATE TABLE IF NOT EXISTS wellness_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      practice_type TEXT NOT NULL,
      sub_type TEXT,
      duration_minutes INTEGER DEFAULT 0,
      note TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_wellness_user ON wellness_records(user_id);
    CREATE INDEX IF NOT EXISTS idx_wellness_type ON wellness_records(practice_type);
    CREATE INDEX IF NOT EXISTS idx_wellness_date ON wellness_records(created_at);

    CREATE TABLE IF NOT EXISTS feature_stats (
      feature TEXT PRIMARY KEY,
      click_count INTEGER DEFAULT 0,
      last_clicked_at TEXT
    );
  `);

  // 迁移：为已有数据库添加 credits 字段
  const userColumns = database.prepare("PRAGMA table_info(users)").all() as Array<{ name: string }>;
  if (!userColumns.some(c => c.name === 'credits')) {
    database.exec('ALTER TABLE users ADD COLUMN credits INTEGER DEFAULT 0');
  }
  if (!userColumns.some(c => c.name === 'gender')) {
    database.exec('ALTER TABLE users ADD COLUMN gender TEXT');
  }
  if (!userColumns.some(c => c.name === 'birth_date')) {
    database.exec('ALTER TABLE users ADD COLUMN birth_date TEXT');
  }
  if (!userColumns.some(c => c.name === 'birth_city')) {
    database.exec('ALTER TABLE users ADD COLUMN birth_city TEXT');
  }
  if (!userColumns.some(c => c.name === 'current_city')) {
    database.exec('ALTER TABLE users ADD COLUMN current_city TEXT');
  }
}

export interface UserRow {
  id: number;
  wallet_address: string;
  nickname: string | null;
  avatar: string | null;
  gender: string | null;
  birth_date: string | null;
  birth_city: string | null;
  current_city: string | null;
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
export const CREDITS_PER_USD = 10;
export const CREDITS_CHART = 20;
export const CREDITS_HEMING = 50;
export const CREDITS_AI_INTERPRET = 10;
export const CREDITS_AI_QA = 10;
export const CREDITS_TIP = 10;
export const CREDITS_DAILY = 10;
export const CREDITS_CEZI = 10;
export const CREDITS_CHOUQIAN = 10;
export const CREDITS_TONGQIAN = 10;
export const CREDITS_FENGSHUI = 10;

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

export function updateUser(id: number, fields: Partial<Pick<UserRow, 'nickname' | 'avatar' | 'gender' | 'birth_date' | 'birth_city' | 'current_city' | 'membership_tier' | 'membership_expires_at' | 'balance' | 'credits'>>): UserRow | null {
  const db = getDb();
  const sets: string[] = [];
  const values: (string | number | null)[] = [];

  if (fields.nickname !== undefined) { sets.push('nickname = ?'); values.push(fields.nickname); }
  if (fields.avatar !== undefined) { sets.push('avatar = ?'); values.push(fields.avatar); }
  if (fields.gender !== undefined) { sets.push('gender = ?'); values.push(fields.gender); }
  if (fields.birth_date !== undefined) { sets.push('birth_date = ?'); values.push(fields.birth_date); }
  if (fields.birth_city !== undefined) { sets.push('birth_city = ?'); values.push(fields.birth_city); }
  if (fields.current_city !== undefined) { sets.push('current_city = ?'); values.push(fields.current_city); }
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
  return crypto.randomBytes(16).toString('hex');
}
export function getAllUsers(): UserRow[] {
  const db = getDb();
  return db.prepare('SELECT * FROM users ORDER BY created_at DESC').all() as UserRow[];
}

export function getAllRechargeRecords(): RechargeRecordRow[] {
  const db = getDb();
  return db.prepare('SELECT * FROM recharge_records ORDER BY created_at DESC').all() as RechargeRecordRow[];
}

export function getAllCreditsLog(limit: number = 200): CreditsLogRow[] {
  const db = getDb();
  return db.prepare('SELECT * FROM credits_log ORDER BY created_at DESC LIMIT ?').all(limit) as CreditsLogRow[];
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
export interface PrayerRecordRow {
  id: number;
  user_id: number;
  type: string;
  content: string;
  target: string | null;
  deity: string | null;
  category: string | null;
  created_at: string;
}

export function createPrayerRecord(
  userId: number,
  type: string,
  content: string,
  target?: string,
  deity?: string,
  category?: string,
): PrayerRecordRow {
  const db = getDb();
  db.prepare(
    'INSERT INTO prayer_records (user_id, type, content, target, deity, category) VALUES (?, ?, ?, ?, ?, ?)',
  ).run(userId, type, content, target ?? null, deity ?? null, category ?? null);
  return db.prepare('SELECT * FROM prayer_records WHERE user_id = ? AND type = ? ORDER BY id DESC LIMIT 1').get(userId, type) as PrayerRecordRow;
}

export function getPrayerRecords(userId: number, type?: string): PrayerRecordRow[] {
  const db = getDb();
  if (type) {
    return db.prepare('SELECT * FROM prayer_records WHERE user_id = ? AND type = ? ORDER BY created_at DESC').all(userId, type) as PrayerRecordRow[];
  }
  return db.prepare('SELECT * FROM prayer_records WHERE user_id = ? ORDER BY created_at DESC').all(userId) as PrayerRecordRow[];
}
export interface RecitationRecordRow {
  id: number;
  user_id: number;
  session_type: string;
  sutra_key: string;
  sutra_name: string;
  duration_minutes: number;
  created_at: string;
}

export function createRecitationRecord(
  userId: number,
  sessionType: string,
  sutraKey: string,
  sutraName: string,
  durationMinutes?: number,
): RecitationRecordRow {
  const db = getDb();
  db.prepare(
    'INSERT INTO recitation_records (user_id, session_type, sutra_key, sutra_name, duration_minutes) VALUES (?, ?, ?, ?, ?)',
  ).run(userId, sessionType, sutraKey, sutraName, durationMinutes ?? 0);
  return db.prepare('SELECT * FROM recitation_records WHERE user_id = ? ORDER BY id DESC LIMIT 1').get(userId) as RecitationRecordRow;
}

export function getRecitationRecords(userId: number, sessionType?: string): RecitationRecordRow[] {
  const db = getDb();
  if (sessionType) {
    return db.prepare('SELECT * FROM recitation_records WHERE user_id = ? AND session_type = ? ORDER BY created_at DESC').all(userId, sessionType) as RecitationRecordRow[];
  }
  return db.prepare('SELECT * FROM recitation_records WHERE user_id = ? ORDER BY created_at DESC').all(userId) as RecitationRecordRow[];
}

export function getRecitationStreak(userId: number): { current_streak: number; today_checked: { morning: boolean; evening: boolean } } {
  const db = getDb();
  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = db.prepare(
    "SELECT session_type FROM recitation_records WHERE user_id = ? AND date(created_at) = ?",
  ).all(userId, today) as Array<{ session_type: string }>;

  const today_checked = {
    morning: todayRecords.some(r => r.session_type === 'morning'),
    evening: todayRecords.some(r => r.session_type === 'evening'),
  };

  const allRecords = db.prepare(
    "SELECT DISTINCT date(created_at) as d FROM recitation_records WHERE user_id = ? ORDER BY d DESC",
  ).all(userId) as Array<{ d: string }>;

  let current_streak = 0;
  if (allRecords.length > 0) {
    const todayDate = new Date();
    const checkDate = new Date(todayDate);
    for (let i = 0; i < allRecords.length; i++) {
      const recordDate = allRecords[i].d;
      const expectedDate = checkDate.toISOString().slice(0, 10);
      if (recordDate === expectedDate) {
        current_streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0 && recordDate !== expectedDate) {
        break;
      } else {
        break;
      }
    }
  }

  return { current_streak, today_checked };
}
export interface WellnessRecordRow {
  id: number;
  user_id: number;
  practice_type: string;
  sub_type: string | null;
  duration_minutes: number;
  note: string | null;
  created_at: string;
}

export function createWellnessRecord(
  userId: number,
  practiceType: string,
  subType?: string,
  durationMinutes?: number,
  note?: string,
): WellnessRecordRow {
  const db = getDb();
  db.prepare(
    'INSERT INTO wellness_records (user_id, practice_type, sub_type, duration_minutes, note) VALUES (?, ?, ?, ?, ?)',
  ).run(userId, practiceType, subType ?? null, durationMinutes ?? 0, note ?? null);
  return db.prepare('SELECT * FROM wellness_records WHERE user_id = ? ORDER BY id DESC LIMIT 1').get(userId) as WellnessRecordRow;
}

export function getWellnessRecords(userId: number, practiceType?: string): WellnessRecordRow[] {
  const db = getDb();
  if (practiceType) {
    return db.prepare('SELECT * FROM wellness_records WHERE user_id = ? AND practice_type = ? ORDER BY created_at DESC').all(userId, practiceType) as WellnessRecordRow[];
  }
  return db.prepare('SELECT * FROM wellness_records WHERE user_id = ? ORDER BY created_at DESC').all(userId) as WellnessRecordRow[];
}

export function getWellnessStreak(userId: number, practiceType: string): { current_streak: number; today_checked: boolean } {
  const db = getDb();
  const today = new Date().toISOString().slice(0, 10);
  const todayRecord = db.prepare(
    "SELECT id FROM wellness_records WHERE user_id = ? AND practice_type = ? AND date(created_at) = ?",
  ).get(userId, practiceType, today);
  const today_checked = !!todayRecord;

  const allRecords = db.prepare(
    "SELECT DISTINCT date(created_at) as d FROM wellness_records WHERE user_id = ? AND practice_type = ? ORDER BY d DESC",
  ).all(userId, practiceType) as Array<{ d: string }>;

  let current_streak = 0;
  if (allRecords.length > 0) {
    const checkDate = new Date();
    for (let i = 0; i < allRecords.length; i++) {
      const expectedDate = checkDate.toISOString().slice(0, 10);
      if (allRecords[i].d === expectedDate) {
        current_streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0 && allRecords[i].d !== expectedDate) {
        break;
      } else {
        break;
      }
    }
  }

  return { current_streak, today_checked };
}
export interface CheckinCalendarDay {
  date: string;
  count: number;
  types: string[];
}

export interface CheckinOverview {
  calendar: CheckinCalendarDay[];
  stats: {
    total_days: number;
    total_checkins: number;
    by_type: Record<string, number>;
    current_streaks: Record<string, number>;
    longest_streak: number;
    this_week_count: number;
    this_month_count: number;
  };
  achievements: Array<{
    key: string;
    title_zh: string;
    title_en: string;
    desc_zh: string;
    desc_en: string;
    unlocked: boolean;
    progress: number;
    target: number;
    icon: string;
  }>;
}

const ACHIEVEMENT_DEFS = [
  { key: 'first_step', title_zh: '初入道门', title_en: 'First Step', desc_zh: '完成首次修行', desc_en: 'Complete your first check-in', target: 1, icon: '🌟' },
  { key: 'seven_days', title_zh: '七日不辍', title_en: 'Seven Days', desc_zh: '连续修行7天', desc_en: '7-day streak', target: 7, icon: '🔥' },
  { key: 'thirty_days', title_zh: '三十日修行', title_en: 'Thirty Days', desc_zh: '连续修行30天', desc_en: '30-day streak', target: 30, icon: '⚡' },
  { key: 'hundred_days', title_zh: '百日筑基', title_en: 'Hundred Days', desc_zh: '连续修行100天', desc_en: '100-day streak', target: 100, icon: '🏔' },
  { key: 'all_six', title_zh: '六根清净', title_en: 'All Six', desc_zh: '同日完成全部6项修行', desc_en: 'Complete all 6 check-ins in one day', target: 6, icon: '☯' },
  { key: 'total_50', title_zh: '半百之勤', title_en: 'Fifty Check-ins', desc_zh: '累计修行50次', desc_en: '50 total check-ins', target: 50, icon: '📖' },
  { key: 'total_200', title_zh: '二百精进', title_en: 'Two Hundred', desc_zh: '累计修行200次', desc_en: '200 total check-ins', target: 200, icon: '🪷' },
  { key: 'total_500', title_zh: '五百圆满', title_en: 'Five Hundred', desc_zh: '累计修行500次', desc_en: '500 total check-ins', target: 500, icon: '🙏' },
];

export function getCheckinOverview(userId: number): CheckinOverview {
  const db = getDb();

  const wellnessRecords = db.prepare(
    "SELECT practice_type, date(created_at) as d FROM wellness_records WHERE user_id = ?",
  ).all(userId) as Array<{ practice_type: string; d: string }>;

  const recitationRecords = db.prepare(
    "SELECT session_type, date(created_at) as d FROM recitation_records WHERE user_id = ?",
  ).all(userId) as Array<{ session_type: string; d: string }>;

  const dayMap = new Map<string, Set<string>>();
  for (const r of wellnessRecords) {
    if (!dayMap.has(r.d)) dayMap.set(r.d, new Set());
    dayMap.get(r.d)!.add(r.practice_type);
  }
  for (const r of recitationRecords) {
    if (!dayMap.has(r.d)) dayMap.set(r.d, new Set());
    dayMap.get(r.d)!.add('recitation');
  }

  const calendar: CheckinCalendarDay[] = [];
  const sortedDays = Array.from(dayMap.keys()).sort();
  for (const d of sortedDays) {
    const types = Array.from(dayMap.get(d)!);
    calendar.push({ date: d, count: types.length, types });
  }

  const byType: Record<string, number> = {};
  for (const r of wellnessRecords) {
    byType[r.practice_type] = (byType[r.practice_type] || 0) + 1;
  }
  byType['recitation'] = recitationRecords.length;

  const total_checkins = wellnessRecords.length + recitationRecords.length;
  const total_days = dayMap.size;

  const currentStreaks: Record<string, number> = {};
  const practiceTypes = ['vegetarian', 'meditation', 'reflection', 'taichi', 'charity'];
  for (const pt of practiceTypes) {
    currentStreaks[pt] = getWellnessStreak(userId, pt).current_streak;
  }
  currentStreaks['recitation'] = getRecitationStreak(userId).current_streak;

  const longestStreak = Math.max(...Object.values(currentStreaks), 0);

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekStartStr = weekStart.toISOString().slice(0, 10);
  const monthStartStr = now.toISOString().slice(0, 7);

  let this_week_count = 0;
  let this_month_count = 0;
  for (const d of sortedDays) {
    if (d >= weekStartStr) this_week_count++;
    if (d.startsWith(monthStartStr)) this_month_count++;
  }

  const maxDailyTypes = Math.max(...calendar.map(c => c.count), 0);

  const achievements = ACHIEVEMENT_DEFS.map(def => {
    let progress = 0;
    let unlocked = false;
    switch (def.key) {
      case 'first_step':
        progress = total_checkins > 0 ? 1 : 0;
        unlocked = total_checkins > 0;
        break;
      case 'seven_days':
      case 'thirty_days':
      case 'hundred_days':
        progress = longestStreak;
        unlocked = longestStreak >= def.target;
        break;
      case 'all_six':
        progress = maxDailyTypes;
        unlocked = maxDailyTypes >= 6;
        break;
      case 'total_50':
      case 'total_200':
      case 'total_500':
        progress = total_checkins;
        unlocked = total_checkins >= def.target;
        break;
    }
    return { ...def, unlocked, progress: Math.min(progress, def.target) };
  });

  return {
    calendar,
    stats: {
      total_days,
      total_checkins,
      by_type: byType,
      current_streaks: currentStreaks,
      longest_streak: longestStreak,
      this_week_count,
      this_month_count,
    },
    achievements,
  };
}
export function incrementFeatureClick(feature: string): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO feature_stats (feature, click_count, last_clicked_at) VALUES (?, 1, datetime('now'))
     ON CONFLICT(feature) DO UPDATE SET click_count = click_count + 1, last_clicked_at = datetime('now')`,
  ).run(feature);
}

export interface FeatureRankingItem {
  feature: string;
  click_count: number;
  zh: string;
  en: string;
  icon: string;
  path: string;
  category: string;
}

const FEATURE_META: Record<string, { zh: string; en: string; icon: string; path: string; category: string }> = {
  chart: { zh: '紫微起盘', en: 'Chart', icon: '🌟', path: '/chart', category: '命理' },
  heming: { zh: '紫微合盘', en: 'Compatibility', icon: '💕', path: '/heming', category: '命理' },
  daily: { zh: '每日运势', en: 'Daily Fortune', icon: '☀', path: '/daily', category: '占卜' },
  cezi: { zh: '测字', en: 'Word Divination', icon: '✍', path: '/cezi', category: '占卜' },
  chouqian: { zh: '抽签', en: 'Draw Lots', icon: '🎋', path: '/chouqian', category: '占卜' },
  tongqian: { zh: '铜钱占卜', en: 'Coin Divination', icon: '🪙', path: '/tongqian', category: '占卜' },
  mianxiang: { zh: 'AI面相', en: 'Face Reading', icon: '👁', path: '/mianxiang', category: '相术' },
  shouxiang: { zh: 'AI手相', en: 'Palm Reading', icon: '✋', path: '/shouxiang', category: '相术' },
  fengshui: { zh: '风水分析', en: 'Feng Shui', icon: '🏠', path: '/fengshui', category: '相术' },
  library: { zh: '古籍库', en: 'Classics', icon: '📖', path: '/library', category: '知识' },
  knowledge: { zh: '知识库', en: 'Knowledge', icon: '📚', path: '/knowledge', category: '知识' },
  recitation: { zh: '诵经修行', en: 'Recitation', icon: '🔔', path: '/recitation', category: '修行' },
  vegetarian: { zh: '吃斋修行', en: 'Vegetarian', icon: '🥬', path: '/vegetarian', category: '修行' },
  meditation: { zh: '打坐修行', en: 'Meditation', icon: '🧘', path: '/meditation', category: '修行' },
  reflection: { zh: '每日三省', en: 'Reflection', icon: '🔍', path: '/reflection', category: '修行' },
  taichi: { zh: '太极修行', en: 'Tai Chi', icon: '☯', path: '/taichi', category: '修行' },
  charity: { zh: '积德行善', en: 'Charity', icon: '🤝', path: '/charity', category: '修行' },
  prayer: { zh: '祈福', en: 'Prayer', icon: '🙏', path: '/prayer', category: '修持' },
  wish: { zh: '许愿', en: 'Wish', icon: '🌠', path: '/wish', category: '修持' },
  repent: { zh: '忏悔', en: 'Repentance', icon: '💧', path: '/repent', category: '修持' },
  lamp: { zh: '长明灯', en: 'Eternal Lamp', icon: '🔥', path: '/lamp', category: '修持' },
  incense: { zh: '上香', en: 'Incense', icon: '🕯', path: '/incense', category: '修持' },
  ritual: { zh: '祭祀', en: 'Ritual', icon: '🏮', path: '/ritual', category: '修持' },
};

export interface AdminStats {
  user_registration_trend: Array<{ date: string; count: number }>;
  daily_active_users: Array<{ date: string; count: number }>;
  checkin_by_type: Array<{ type: string; total: number; last_7d: number }>;
  checkin_trend_30d: Array<{ date: string; count: number }>;
  feature_usage: Array<{ feature: string; click_count: number; zh: string; icon: string; category: string }>;
  recharge_summary: {
    total_confirmed: number;
    total_pending: number;
    total_amount: number;
    last_30d_amount: number;
  };
  user_summary: {
    total: number;
    premium: number;
    free: number;
    new_7d: number;
    new_30d: number;
  };
}

export function getAdminStats(): AdminStats {
  const db = getDb();

  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().slice(0, 10);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 10);

  const userRegistrationTrend = db.prepare(`
    SELECT date(created_at, 'unixepoch') as date, COUNT(*) as count
    FROM users
    WHERE created_at >= strftime('%s', ?)
    GROUP BY date(created_at, 'unixepoch')
    ORDER BY date ASC
  `).all(thirtyDaysAgoStr) as Array<{ date: string; count: number }>;

  const wellnessDailyActive = db.prepare(`
    SELECT date(created_at) as date, COUNT(DISTINCT user_id) as count
    FROM wellness_records
    WHERE date(created_at) >= ?
    GROUP BY date(created_at)
    ORDER BY date ASC
  `).all(thirtyDaysAgoStr) as Array<{ date: string; count: number }>;

  const recitationDailyActive = db.prepare(`
    SELECT date(created_at) as date, COUNT(DISTINCT user_id) as count
    FROM recitation_records
    WHERE date(created_at) >= ?
    GROUP BY date(created_at)
    ORDER BY date ASC
  `).all(thirtyDaysAgoStr) as Array<{ date: string; count: number }>;

  const dauMap = new Map<string, Set<number>>();
  for (const r of wellnessDailyActive) {
    if (!dauMap.has(r.date)) dauMap.set(r.date, new Set());
  }
  for (const r of recitationDailyActive) {
    if (!dauMap.has(r.date)) dauMap.set(r.date, new Set());
  }

  const wellnessDAU = db.prepare(`
    SELECT date(created_at) as date, user_id FROM wellness_records WHERE date(created_at) >= ?
  `).all(thirtyDaysAgoStr) as Array<{ date: string; user_id: number }>;
  for (const r of wellnessDAU) {
    dauMap.get(r.date)?.add(r.user_id);
  }

  const recitationDAU = db.prepare(`
    SELECT date(created_at) as date, user_id FROM recitation_records WHERE date(created_at) >= ?
  `).all(thirtyDaysAgoStr) as Array<{ date: string; user_id: number }>;
  for (const r of recitationDAU) {
    dauMap.get(r.date)?.add(r.user_id);
  }

  const dailyActiveUsers = Array.from(dauMap.entries())
    .map(([date, users]) => ({ date, count: users.size }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const checkinByTypeRaw = db.prepare(`
    SELECT practice_type, COUNT(*) as total FROM wellness_records GROUP BY practice_type
  `).all() as Array<{ practice_type: string; total: number }>;

  const recitationTotal = db.prepare(`SELECT COUNT(*) as total FROM recitation_records`).get() as { total: number };

  const checkinLast7dRaw = db.prepare(`
    SELECT practice_type, COUNT(*) as cnt FROM wellness_records WHERE date(created_at) >= ? GROUP BY practice_type
  `).all(sevenDaysAgoStr) as Array<{ practice_type: string; cnt: number }>;

  const recitationLast7d = db.prepare(`SELECT COUNT(*) as cnt FROM recitation_records WHERE date(created_at) >= ?`).get(sevenDaysAgoStr) as { cnt: number };

  const checkinByType: Array<{ type: string; total: number; last_7d: number }> = [];
  const typeLabels: Record<string, string> = {
    vegetarian: '吃斋',
    meditation: '打坐',
    reflection: '每日三省',
    taichi: '太极',
    charity: '积德行善',
    recitation: '诵经',
  };
  for (const [type, label] of Object.entries(typeLabels)) {
    const totalRow = checkinByTypeRaw.find(r => r.practice_type === type);
    const last7dRow = checkinLast7dRaw.find(r => r.practice_type === type);
    checkinByType.push({
      type: label,
      total: totalRow?.total ?? 0,
      last_7d: last7dRow?.cnt ?? 0,
    });
  }

  const checkinTrend30d = db.prepare(`
    SELECT date(created_at) as date, COUNT(*) as count FROM (
      SELECT created_at FROM wellness_records WHERE date(created_at) >= ?
      UNION ALL
      SELECT created_at FROM recitation_records WHERE date(created_at) >= ?
    ) GROUP BY date(created_at) ORDER BY date ASC
  `).all(thirtyDaysAgoStr, thirtyDaysAgoStr) as Array<{ date: string; count: number }>;

  const featureUsageRaw = db.prepare(`
    SELECT feature, click_count FROM feature_stats ORDER BY click_count DESC
  `).all() as Array<{ feature: string; click_count: number }>;

  const featureUsage: Array<{ feature: string; click_count: number; zh: string; icon: string; category: string }> = [];
  for (const row of featureUsageRaw) {
    const meta = FEATURE_META[row.feature];
    if (meta) {
      featureUsage.push({
        feature: row.feature,
        click_count: row.click_count,
        zh: meta.zh,
        icon: meta.icon,
        category: meta.category,
      });
    }
  }

  const rechargeSummaryRaw = db.prepare(`
    SELECT
      SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as total_confirmed,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as total_pending,
      SUM(CASE WHEN status = 'confirmed' THEN amount ELSE 0 END) as total_amount
    FROM recharge_records
  `).get() as { total_confirmed: number; total_pending: number; total_amount: number };

  const rechargeLast30d = db.prepare(`
    SELECT SUM(amount) as amount FROM recharge_records
    WHERE status = 'confirmed' AND created_at >= strftime('%s', ?)
  `).get(thirtyDaysAgoStr) as { amount: number | null };

  const userSummaryRaw = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN membership_tier = 'premium' THEN 1 ELSE 0 END) as premium,
      SUM(CASE WHEN membership_tier = 'free' THEN 1 ELSE 0 END) as free,
      SUM(CASE WHEN created_at >= strftime('%s', ?) THEN 1 ELSE 0 END) as new_7d,
      SUM(CASE WHEN created_at >= strftime('%s', ?) THEN 1 ELSE 0 END) as new_30d
    FROM users
  `).get(sevenDaysAgoStr, thirtyDaysAgoStr) as { total: number; premium: number; free: number; new_7d: number; new_30d: number };

  return {
    user_registration_trend: userRegistrationTrend,
    daily_active_users: dailyActiveUsers,
    checkin_by_type: checkinByType,
    checkin_trend_30d: checkinTrend30d,
    feature_usage: featureUsage,
    recharge_summary: {
      total_confirmed: rechargeSummaryRaw.total_confirmed || 0,
      total_pending: rechargeSummaryRaw.total_pending || 0,
      total_amount: rechargeSummaryRaw.total_amount || 0,
      last_30d_amount: rechargeLast30d.amount || 0,
    },
    user_summary: {
      total: userSummaryRaw.total || 0,
      premium: userSummaryRaw.premium || 0,
      free: userSummaryRaw.free || 0,
      new_7d: userSummaryRaw.new_7d || 0,
      new_30d: userSummaryRaw.new_30d || 0,
    },
  };
}

export function getFeatureRanking(): FeatureRankingItem[] {
  const db = getDb();
  const rows = db.prepare(
    'SELECT feature, click_count FROM feature_stats ORDER BY click_count DESC',
  ).all() as Array<{ feature: string; click_count: number }>;

  const ranking: FeatureRankingItem[] = [];
  for (const row of rows) {
    const meta = FEATURE_META[row.feature];
    if (meta) {
      ranking.push({
        feature: row.feature,
        click_count: row.click_count,
        zh: meta.zh,
        en: meta.en,
        icon: meta.icon,
        path: meta.path,
        category: meta.category,
      });
    }
  }

  for (const [feature, meta] of Object.entries(FEATURE_META)) {
    if (!ranking.find(r => r.feature === feature)) {
      ranking.push({
        feature,
        click_count: 0,
        zh: meta.zh,
        en: meta.en,
        icon: meta.icon,
        path: meta.path,
        category: meta.category,
      });
    }
  }

  ranking.sort((a, b) => b.click_count - a.click_count);
  return ranking;
}
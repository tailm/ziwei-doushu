'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { getAddress } from 'viem';

export interface UserInfo {
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
}

export interface PermissionInfo {
  can_use_chart: boolean;
  can_use_heming: boolean;
  can_use_ai: boolean;
  can_use_ai_qa: boolean;
  chart_remaining: number;
  chart_used: number;
  chart_total: number;
  credits: number;
}

interface AuthContextValue {
  user: UserInfo | null;
  permissions: PermissionInfo | null;
  loading: boolean;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshPermissions: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  permissions: null,
  loading: true,
  login: async () => false,
  logout: async () => {},
  refreshUser: async () => {},
  refreshPermissions: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

function buildSiweMessage(params: {
  domain: string;
  address: string;
  statement: string;
  uri: string;
  nonce: string;
  chainId: number;
}): string {
  const { domain, address, statement, uri, nonce, chainId } = params;
  const issuedAt = new Date().toISOString();

  return [
    `${domain} wants you to sign in with your Ethereum account:`,
    address,
    '',
    statement,
    '',
    `URI: ${uri}`,
    `Version: 1`,
    `Chain ID: ${chainId}`,
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`,
  ].join('\n');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [permissions, setPermissions] = useState<PermissionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshPermissions = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/check');
      const data = await res.json();
      setPermissions({
        can_use_chart: data.can_use_chart,
        can_use_heming: data.can_use_heming,
        can_use_ai: data.can_use_ai,
        can_use_ai_qa: data.can_use_ai_qa,
        chart_remaining: data.chart_remaining,
        chart_used: data.chart_used,
        chart_total: data.chart_total,
        credits: data.credits,
      });
    } catch {
      setPermissions(null);
    }
  }, []);

  const login = useCallback(async (): Promise<boolean> => {
    if (!window.ethereum) {
      window.location.href = '/login';
      return false;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      const checksumAddress = getAddress(accounts[0]);

      const nonceRes = await fetch('/api/auth/nonce');
      const { nonce } = await nonceRes.json();

      const message = buildSiweMessage({
        domain: window.location.host,
        address: checksumAddress,
        statement: 'Sign in to Ziwei Chart',
        uri: window.location.origin,
        nonce,
        chainId: 1,
      });

      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, checksumAddress],
      }) as string;

      const verifyRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature }),
      });

      if (!verifyRes.ok) {
        const err = await verifyRes.json();
        throw new Error(err.error || '登录失败');
      }

      const data = await verifyRes.json();
      setUser(data.user);
      await refreshPermissions();
      return true;
    } catch (error) {
      if (error instanceof Error && (error as Error & { code?: number }).code !== 4001) {
        alert(`登录失败: ${error.message}`);
      }
      return false;
    }
  }, [refreshPermissions]);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setPermissions(null);
  }, []);

  useEffect(() => {
    refreshUser().then(() => refreshPermissions());
  }, [refreshUser, refreshPermissions]);

  return (
    <AuthContext.Provider value={{ user, permissions, loading, login, logout, refreshUser, refreshPermissions }}>
      {children}
    </AuthContext.Provider>
  );
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}
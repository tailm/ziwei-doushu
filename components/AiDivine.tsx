'use client';
import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth/AuthContext';
import { useLang } from '@/lib/i18n/LanguageContext';
import InsufficientCredits from '@/components/InsufficientCredits';

interface AiDivineProps {
  tool: 'daily' | 'cezi' | 'chouqian' | 'tongqian' | 'mianxiang' | 'shouxiang';
  context: string;
  goldSolid: string;
  goldLine: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecond: string;
  textMuted: string;
  isDark: boolean;
}

export default function AiDivine({
  tool, context, goldSolid, goldLine, cardBg, cardBorder, textPrimary, textSecond, textMuted, isDark,
}: AiDivineProps) {
  const { lang } = useLang();
  const { user, refreshPermissions } = useAuth();
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [showAi, setShowAi] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleAiDivine = useCallback(async () => {
    setAiLoading(true);
    setAiError('');
    setAiResult('');
    setShowAi(true);

    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/ai-divine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, context, lang }),
        signal: abortRef.current.signal,
      });

      if (res.status === 401) {
        setAiError(lang === 'zh' ? '请先登录后使用AI解读' : 'Please login to use AI interpretation');
        setAiLoading(false);
        return;
      }
      if (res.status === 402) {
        const data = await res.json();
        setAiError(data.message);
        setAiLoading(false);
        return;
      }
      if (!res.ok) {
        setAiError(lang === 'zh' ? 'AI解读服务暂时不可用' : 'AI service temporarily unavailable');
        setAiLoading(false);
        return;
      }

      refreshPermissions();

      const reader = res.body?.getReader();
      if (!reader) {
        setAiError('Stream error');
        setAiLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.delta?.text ?? '';
            if (delta) {
              setAiResult(prev => prev + delta);
            }
          } catch {
          }
        }
      }

      setAiLoading(false);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        setAiLoading(false);
        return;
      }
      setAiError(e instanceof Error ? e.message : 'Unknown error');
      setAiLoading(false);
    }
  }, [tool, context, lang, refreshPermissions]);

  const handleStop = () => {
    abortRef.current?.abort();
    setAiLoading(false);
  };

  if (!user) return null;

  return (
    <div className="space-y-3">
      {!showAi && (
        <button
          onClick={handleAiDivine}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
          style={{
            background: isDark ? 'linear-gradient(135deg, rgba(184,137,42,0.2), rgba(212,168,67,0.15))' : 'linear-gradient(135deg, rgba(140,100,20,0.12), rgba(180,140,40,0.08))',
            border: `1px solid ${goldLine}`,
            color: goldSolid,
          }}
        >
          <span>✨</span>
          <span>{lang === 'zh' ? 'AI深度解读' : 'AI Deep Interpretation'}</span>
          <span className="text-[10px] opacity-70">({lang === 'zh' ? '10积分' : '10 credits'})</span>
        </button>
      )}

      {showAi && (
        <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${goldLine}` }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: goldSolid }}>
              <span>✨</span>
              {lang === 'zh' ? 'AI深度解读' : 'AI Deep Interpretation'}
            </h3>
            {aiLoading && (
              <button
                onClick={handleStop}
                className="text-xs px-2 py-1 rounded transition-colors"
                style={{ border: `1px solid ${cardBorder}`, color: textMuted }}
              >
                {lang === 'zh' ? '停止' : 'Stop'}
              </button>
            )}
            {!aiLoading && aiResult && (
              <button
                onClick={() => { setShowAi(false); setAiResult(''); }}
                className="text-xs px-2 py-1 rounded transition-colors"
                style={{ border: `1px solid ${cardBorder}`, color: textMuted }}
              >
                {lang === 'zh' ? '关闭' : 'Close'}
              </button>
            )}
          </div>

          {aiError && (
            <div>
              <InsufficientCredits message={aiError} goldSolid={goldSolid} />
            </div>
          )}

          {aiLoading && !aiResult && (
            <div className="flex items-center gap-2 py-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                className="text-lg" style={{ color: goldSolid }}
              >
                ◯
              </motion.div>
              <span className="text-sm" style={{ color: textMuted }}>
                {lang === 'zh' ? 'AI正在解读中…' : 'AI is interpreting…'}
              </span>
            </div>
          )}

          {aiResult && (
            <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: textSecond }}>
              {aiResult}
              {aiLoading && (
                <span className="inline-block w-2 h-4 ml-0.5 animate-pulse" style={{ background: goldSolid }} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
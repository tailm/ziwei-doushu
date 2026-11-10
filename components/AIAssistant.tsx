'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useLang } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_QUESTIONS_ZH = [
  '紫微斗数是什么？',
  '十四主星有哪些？',
  '什么是四化？',
  '如何看大限运势？',
  '倪海厦紫微体系有何特点？',
];

const QUICK_QUESTIONS_EN = [
  'What is Ziwei Dou Shu?',
  'What are the 14 Main Stars?',
  'What are the Four Transformations?',
  'How to read Decade fortune?',
  'What is the Ni Haixia lineage?',
];

export default function AIAssistant() {
  const { lang } = useLang();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const isZh = lang === 'zh';
  const quickQuestions = isZh ? QUICK_QUESTIONS_ZH : QUICK_QUESTIONS_EN;

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || streaming) return;

    if (!user) {
      setError(isZh ? '请先登录后使用 AI 解惑' : 'Please login first');
      return;
    }

    setError('');
    const userMsg: ChatMsg = { role: 'user', content: content.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setStreaming(true);

    const assistantMsg: ChatMsg = { role: 'assistant', content: '' };
    setMessages([...newMessages, assistantMsg]);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          lang,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (errData.error === 'not_authenticated' || errData.error === 'session_expired') {
          setError(isZh ? '请先登录后使用 AI 解惑' : 'Please login first');
        } else if (errData.error === 'insufficient_credits') {
          setError(isZh ? `积分不足，AI 解惑每次需要 ${errData.cost} 积分` : `Insufficient credits. AI Q&A costs ${errData.cost} credits.`);
        } else {
          setError(errData.message || (isZh ? '请求失败，请稍后重试' : 'Request failed. Please try again.'));
        }
        setMessages(prev => prev.slice(0, -1));
        setStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setError(isZh ? '连接失败' : 'Connection failed');
        setStreaming(false);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let assistantContent = '';

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
              assistantContent += delta;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
                return updated;
              });
            }
          } catch {
            // skip
          }
        }
      }

      setStreaming(false);
    } catch {
      setError(isZh ? '网络错误，请稍后重试' : 'Network error. Please try again.');
      setMessages(prev => prev.slice(0, -1));
      setStreaming(false);
    }
  }, [messages, streaming, user, lang, isZh]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9000,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #B8922A 0%, #8A6A1A 100%)',
          boxShadow: '0 4px 20px rgba(184,146,42,0.4), 0 2px 8px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
        }}
        aria-label={isZh ? 'AI 解惑' : 'AI Assistant'}
      >
        <MessageCircle size={26} strokeWidth={2} />
        <motion.span
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#FFD700',
          }}
        />
      </motion.button>

      {/* Chat Dialog */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => !streaming && setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(20,12,2,0.7)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              padding: '0',
            }}
          >
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                width: '420px',
                maxWidth: '100vw',
                height: '600px',
                maxHeight: '100vh',
                margin: '16px',
                borderRadius: '16px',
                background: 'var(--bg, #1a1410)',
                border: '1px solid rgba(184,146,42,0.3)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid rgba(184,146,42,0.2)',
                  background: 'linear-gradient(180deg, rgba(184,146,42,0.08) 0%, transparent 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #B8922A 0%, #8A6A1A 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Sparkles size={18} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--tx, #e8dcc8)' }}>
                      {isZh ? 'AI 解惑' : 'AI Assistant'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--tx-dim, #8a7a60)' }}>
                      {isZh ? '紫微斗数 · 传统文化' : 'Ziwei · Traditional Culture'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => !streaming && setOpen(false)}
                  disabled={streaming}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: streaming ? 'not-allowed' : 'pointer',
                    color: 'var(--tx-dim, #8a7a60)',
                    padding: '4px',
                    opacity: streaming ? 0.4 : 1,
                  }}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages Area */}
              <div
                ref={scrollRef}
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {messages.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <div style={{ fontSize: '14px', color: 'var(--tx-dim, #8a7a60)', marginBottom: '16px' }}>
                      {isZh ? '有什么可以帮你的？' : 'How can I help you?'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {quickQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => sendMessage(q)}
                          disabled={streaming}
                          style={{
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: '1px solid rgba(184,146,42,0.2)',
                            background: 'rgba(184,146,42,0.05)',
                            color: 'var(--tx, #e8dcc8)',
                            fontSize: '13px',
                            cursor: streaming ? 'not-allowed' : 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            if (!streaming) e.currentTarget.style.background = 'rgba(184,146,42,0.12)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(184,146,42,0.05)';
                          }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '85%',
                        padding: '10px 14px',
                        borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg, #B8922A 0%, #8A6A1A 100%)'
                          : 'rgba(184,146,42,0.08)',
                        color: msg.role === 'user' ? '#fff' : 'var(--tx, #e8dcc8)',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {msg.content || (msg.role === 'assistant' && streaming ? '...' : '')}
                    </div>
                  </div>
                ))}

                {error && (
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(168,50,40,0.1)',
                      border: '1px solid rgba(168,50,40,0.3)',
                      color: '#c85040',
                      fontSize: '13px',
                      textAlign: 'center',
                    }}
                  >
                    {error}
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div
                style={{
                  padding: '12px 16px',
                  borderTop: '1px solid rgba(184,146,42,0.2)',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={streaming}
                  placeholder={isZh ? '输入你的问题...' : 'Type your question...'}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(184,146,42,0.2)',
                    background: 'var(--bg-tint, #221a14)',
                    color: 'var(--tx, #e8dcc8)',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(184,146,42,0.5)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(184,146,42,0.2)';
                  }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={streaming || !input.trim()}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    border: 'none',
                    background: streaming || !input.trim()
                      ? 'rgba(184,146,42,0.3)'
                      : 'linear-gradient(135deg, #B8922A 0%, #8A6A1A 100%)',
                    color: '#fff',
                    cursor: streaming || !input.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                  aria-label={isZh ? '发送' : 'Send'}
                >
                  <Send size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
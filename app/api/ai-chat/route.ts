import { NextRequest } from 'next/server';
import { getSession, getUserById, deductCredits, logCredits, isAdmin, isMembershipActive, CREDITS_AI_QA } from '@/lib/db';
import { callAI, createSSEStream, type ChatMessage } from '@/lib/ai/stream';

export const runtime = 'nodejs';

interface RequestBody {
  messages: ChatMessage[];
  lang?: 'zh' | 'en';
}

function buildSystemPrompt(lang: 'zh' | 'en' = 'zh'): string {
  if (lang === 'en') {
    return `You are a knowledgeable assistant for the Ziwei Dou Shu (Purple Star Astrology) platform, following the Ni Haixia lineage.

You can answer questions about:
- Ziwei Dou Shu (紫微斗数) concepts, stars, palaces, and Si Hua (Four Transformations)
- Chinese metaphysics: I Ching, Ba Zi, Feng Shui, face reading, palm reading
- Chinese traditional culture, philosophy, and religious/spiritual practices
- How to use this platform's features

Guidelines:
- Be concise, professional, and helpful
- Use Chinese proper nouns with pinyin when needed (e.g., Ziwei=紫微, Hua Lu=化禄)
- For specific chart readings, guide users to generate their chart first
- Do not make definitive life predictions without a chart context
- Respond in English`;
  }

  return `你是紫微研究平台的AI解惑助手，基于倪海厦《天纪》紫微斗数体系。

你可以回答以下方面的问题：
- 紫微斗数概念、星曜、宫位、四化等知识
- 中国传统术数：易经、八字、风水、面相、手相
- 中国传统文化、哲学、宗教修行
- 本平台功能使用指引

注意事项：
- 回答简洁专业，避免冗长
- 命理专名保留中文，必要时附拼音
- 涉及具体命盘解读时，引导用户先起盘
- 没有命盘上下文时，不做具体人生预测
- 用中文回答`;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { messages, lang = 'zh' } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Missing messages' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sessionId = req.cookies.get('ziwei_session')?.value;

    if (!sessionId) {
      return new Response(JSON.stringify({
        error: 'not_authenticated',
        message: 'AI 解惑需要登录后使用',
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const session = getSession(sessionId);
    if (!session) {
      return new Response(JSON.stringify({
        error: 'session_expired',
        message: '登录已过期，请重新登录',
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = session.user_id;
    const user = getUserById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isPremium = isMembershipActive(user) || isAdmin(user.wallet_address);
    const creditsCost = CREDITS_AI_QA;

    if (!isPremium) {
      if (user.credits < creditsCost) {
        return new Response(JSON.stringify({
          error: 'insufficient_credits',
          message: `积分不足，AI 解惑每次需要 ${CREDITS_AI_QA} 积分`,
          credits: user.credits,
          cost: creditsCost,
        }), {
          status: 402,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.MIMO_API_KEY || '';
    const baseUrl = process.env.MIMO_BASE_URL || 'https://api.deepseek.com/v1';
    const model = process.env.MIMO_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return new Response(JSON.stringify({
        error: 'AI API key not configured. Set DEEPSEEK_API_KEY or MIMO_API_KEY in .env.local',
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = buildSystemPrompt(lang);
    const aiBody = await callAI(systemPrompt, messages, apiKey, baseUrl, model);

    if (!isPremium) {
      deductCredits(userId, creditsCost);
      logCredits(userId, 'ai_qa', -creditsCost);
    }

    const sseStream = createSSEStream(aiBody);

    return new Response(sseStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errMsg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
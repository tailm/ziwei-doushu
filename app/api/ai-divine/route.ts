import { NextRequest } from 'next/server';
import { getSession, getUserById, deductCredits, logCredits, isAdmin, isMembershipActive, CREDITS_AI_QA } from '@/lib/db';
import { callAI, createSSEStream, type ChatMessage } from '@/lib/ai/stream';

export const runtime = 'nodejs';

interface RequestBody {
  tool: 'daily' | 'cezi' | 'chouqian' | 'tongqian' | 'mianxiang' | 'shouxiang';
  context: string;
  question?: string;
  lang?: 'zh' | 'en';
}

const SYSTEM_PROMPTS: Record<string, (lang: 'zh' | 'en') => string> = {
  daily: (lang) => lang === 'en'
    ? `You are a Chinese fortune-telling expert specializing in daily fortune analysis based on Bazi (Four Pillars) and Chinese almanac. Analyze the provided daily fortune data and give practical, specific advice. Be concise and encouraging. Respond in English.`
    : `你是一位精通八字命理和黄历的运势分析师。根据提供的每日运势数据，给出具体、实用的建议。语言简洁积极，用中文回答。`,

  cezi: (lang) => lang === 'en'
    ? `You are an expert in Chinese character divination (测字). Analyze the provided character interpretation data — including radical, Five Elements, stroke count, and structure — and provide deeper insight. Be specific about how each element relates to the user's question. Respond in English.`
    : `你是一位精通测字解字的命理师。根据提供的汉字解读数据（偏旁部首、五行属性、笔画数理、字形结构），给出更深入的解读。具体说明每个要素与所问事项的关联。用中文回答。`,

  chouqian: (lang) => lang === 'en'
    ? `You are an expert in Guanyin Oracle (观音灵签) interpretation. Analyze the provided sign data — including the poem, interpretation, and story — and provide personalized guidance. Connect the sign's message to practical life advice. Respond in English.`
    : `你是一位精通观音灵签解签的命理师。根据提供的签文数据（签诗、解签、典故），给出个性化的指引。将签文寓意与实际生活建议相结合。用中文回答。`,

  tongqian: (lang) => lang === 'en'
    ? `You are an expert in I Ching (易经) Six-Line divination (六爻占卜). Analyze the provided hexagram data — including the original hexagram, changing lines, and changed hexagram — and provide detailed interpretation. Explain the hexagram's judgment and advice in practical terms. Respond in English.`
    : `你是一位精通易经六爻占卜的命理师。根据提供的卦象数据（本卦、变爻、变卦），给出详细的解读。将卦辞和爻辞的含义转化为实际的生活指引。用中文回答。`,

  mianxiang: (lang) => lang === 'en'
    ? `You are an expert in Chinese face reading (面相学). Analyze the provided facial feature data — including face shape, forehead, eyebrows, eyes, nose, mouth, chin, and ears — and provide deeper insight into personality, fortune, and life trajectory. Be specific about how each feature relates to career, wealth, relationships, and health. Respond in English.`
    : `你是一位精通面相学的命理师。根据提供的面部特征数据（脸型、额头、眉毛、眼睛、鼻子、嘴巴、下巴、耳朵），给出更深入的解读。具体说明每个特征与事业、财运、感情、健康的关联。用中文回答。`,

  shouxiang: (lang) => lang === 'en'
    ? `You are an expert in Chinese palm reading (手相学). Analyze the provided palm feature data — including life line, head line, heart line, fate line, fingers, thumb, and palm shape — and provide deeper insight into personality, fortune, and life trajectory. Be specific about how each feature relates to career, wealth, relationships, and health. Respond in English.`
    : `你是一位精通手相学的命理师。根据提供的手掌特征数据（生命线、智慧线、感情线、命运线、手指、拇指、掌型），给出更深入的解读。具体说明每个特征与事业、财运、感情、健康的关联。用中文回答。`,
};

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { tool, context, question, lang = 'zh' } = body;

    if (!tool || !context) {
      return new Response(JSON.stringify({ error: 'Missing tool or context' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sessionId = req.cookies.get('ziwei_session')?.value;

    if (!sessionId) {
      return new Response(JSON.stringify({
        error: 'not_authenticated',
        message: lang === 'en' ? 'AI interpretation requires login' : 'AI解读需要登录后使用',
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const session = getSession(sessionId);
    if (!session) {
      return new Response(JSON.stringify({
        error: 'session_expired',
        message: lang === 'en' ? 'Session expired, please login again' : '登录已过期，请重新登录',
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

    if (!isPremium) {
      if (user.credits < CREDITS_AI_QA) {
        return new Response(JSON.stringify({
          error: 'insufficient_credits',
          message: lang === 'en' ? `Insufficient credits. AI interpretation costs ${CREDITS_AI_QA} credits.` : `积分不足，AI解读每次需要 ${CREDITS_AI_QA} 积分`,
          credits: user.credits,
          cost: CREDITS_AI_QA,
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
        error: 'AI API key not configured',
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = SYSTEM_PROMPTS[tool]?.(lang) || SYSTEM_PROMPTS.daily(lang);
    const userContent = question
      ? `${context}\n\n用户提问：${question}`
      : `${context}\n\n请给出更深入的解读和建议。`;

    const messages: ChatMessage[] = [
      { role: 'user', content: userContent },
    ];

    const aiBody = await callAI(systemPrompt, messages, apiKey, baseUrl, model);

    if (!isPremium) {
      deductCredits(userId, CREDITS_AI_QA);
      logCredits(userId, `ai_${tool}`, -CREDITS_AI_QA);
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
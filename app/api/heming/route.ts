import { NextRequest } from 'next/server';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { getSession, getUserById, deductCredits, logCredits, addBalance, isAdmin, isMembershipActive, CREDITS_HEMING } from '@/lib/db';
import { callAI, createSSEStream } from '@/lib/ai/stream';

export const runtime = 'nodejs';

interface RequestBody {
  chartA: ZiweiChart;
  chartB: ZiweiChart;
  question?: string;
  lang?: 'zh' | 'en';
}

function buildHemingSystemPrompt(chartA: ZiweiChart, chartB: ZiweiChart, question?: string, lang: 'zh' | 'en' = 'zh'): string {
  const summary = (chart: ZiweiChart) => {
    const palaceDetails = chart.palaces.map((p: { name: string; stars: { name: string; type: string; brightnessRaw?: string; siHua?: string }[] }) => {
      const majors = p.stars.filter(s => s.type === 'major');
      const minors = p.stars.filter(s => s.type === 'minor');
      const others = p.stars.filter(s => s.type !== 'major' && s.type !== 'minor');
      let desc = `${p.name}: `;
      if (majors.length === 0) desc += '空宫';
      else desc += majors.map(s => s.name + (s.brightnessRaw ? `(${s.brightnessRaw})` : '') + (s.siHua ? `[${s.siHua}]` : '')).join(', ');
      if (minors.length > 0) desc += ' | 辅煞: ' + minors.map(s => s.name + (s.siHua ? `[${s.siHua}]` : '')).join(', ');
      if (others.length > 0) desc += ' | 其他: ' + others.map(s => s.name).join(', ');
      return desc;
    });

    const siHuaList = chart.palaces.flatMap((p: { name: string; stars: { name: string; siHua?: string }[] }) =>
      p.stars.filter(s => s.siHua).map(s => `${s.siHua}(${p.name}-${s.name})`)
    );

    return `性别: ${chart.birthInfo.gender === 'male' ? '男' : '女'}
出生: ${chart.birthInfo.year}年${chart.birthInfo.month}月${chart.birthInfo.day}日 ${chart.birthInfo.hour}时
十二宫详情:
${palaceDetails.join('\n')}
四化飞星: ${siHuaList.join(', ') || '无'}`;
  };

  if (lang === 'en') {
    return `You are a Ziwei Dou Shu expert, strictly following the Ni Haixia "Tian Ji" lineage for compatibility analysis.

【Chart A】
${summary(chartA)}

【Chart B】
${summary(chartB)}

【Analysis Requirements】
1. Based on the Ni Haixia "Tian Ji" orthodox Ziwei Dou Shu system
2. Focus on the interaction of both parties' Ming Gong (Life Palace) major stars (e.g., Ziwei-Tianfu, Tianji-Taiyin combinations)
3. Analyze emotional compatibility: examine both parties' Spouse Palace stars and Peach Blossom stars (Lianzhen, Tanlang) interactions
4. Analyze career complementarity: examine both parties' Career Palace and Wealth Palace star combinations
5. Analyze financial influence: examine both parties' Wealth Palace and Property Palace interactions
6. Consider star brightness (庙旺利陷) impact; state negative effects of fallen stars honestly
7. Note Si Hua (Four Transformations) cross-influence, especially Hua Lu and Hua Ji
8. Respond in English. Be concise and professional. Do not alarm the user.
${question ? `9. User question: ${question}` : ''}`;
  }

  return `你是一位精通紫微斗数的命理师，严格遵循倪海厦《天纪》体系进行合盘分析。

【命盘A】
${summary(chartA)}

【命盘B】
${summary(chartB)}

【分析要求】
1. 基于倪海厦《天纪》正统紫微斗数体系
2. 重点分析两人命宫主星的互动关系（如紫微-天府、天机-太阴等组合的契合度）
3. 分析感情契合度：看双方夫妻宫星曜、桃花星（廉贞、贪狼）的互动
4. 分析事业互补性：看双方官禄宫、财帛宫的星曜配合
5. 分析财运影响：看双方财帛宫、田宅宫的互动
6. 注意星曜庙旺利陷对论断的影响，落陷星曜的负面影响要如实指出
7. 注意四化飞星的交互影响，特别是化禄、化忌的交叉影响
8. 回答用中文，语言简洁专业，不要恐吓
${question ? `9. 用户问题: ${question}` : ''}`;
}


export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { chartA, chartB, question, lang = 'zh' } = body;

    if (!chartA || !chartB) {
      return new Response(JSON.stringify({ error: 'Missing chartA or chartB' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sessionId = req.cookies.get('ziwei_session')?.value;

    if (!sessionId) {
      return new Response(JSON.stringify({
        error: 'not_authenticated',
        message: '合盘功能需要登录后使用',
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

    const user = getUserById(session.user_id);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isPremium = isMembershipActive(user) || isAdmin(user.wallet_address);

    if (!isPremium && user.credits < CREDITS_HEMING) {
      return new Response(JSON.stringify({
        error: 'insufficient_credits',
        message: `积分不足，合盘分析每次需要 ${CREDITS_HEMING} 积分`,
        credits: user.credits,
        cost: CREDITS_HEMING,
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
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

    const systemPrompt = buildHemingSystemPrompt(chartA, chartB, question, lang);
    const userMessage = question || (lang === 'en' ? 'Please analyze the compatibility of both charts, including emotional compatibility, career complementarity, and financial influence.' : '请分析两人的合盘关系，包括感情契合度、事业互补性、财运影响等方面。');
    const aiBody = await callAI(systemPrompt, userMessage, apiKey, baseUrl, model);

    if (!isPremium) {
      deductCredits(user.id, CREDITS_HEMING);
      logCredits(user.id, 'heming', -CREDITS_HEMING);
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
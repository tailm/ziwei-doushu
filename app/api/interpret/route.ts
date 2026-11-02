import { NextRequest } from 'next/server';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import { STEMS, BRANCHES, PALACE_NAMES_ORDER } from '@/lib/ziwei/constants';
import { getSession, getUserById, getOrCreateUsageLimit, incrementUsage, deductCredits, logCredits, addBalance, isAdmin, isMembershipActive, CREDITS_AI_INTERPRET, CREDITS_AI_QA } from '@/lib/db';
import { callAI, createSSEStream, type ChatMessage } from '@/lib/ai/stream';

export const runtime = 'nodejs';

interface RequestBody {
  chart: ZiweiChart;
  messages: ChatMessage[];
  lang?: 'zh' | 'en';
}

const SI_HUA_MEANING: Record<string, string> = {
  '禄': '化禄（缘分、机会、财源）',
  '权': '化权（权力、掌控、行动力）',
  '科': '化科（名声、贵人、学业）',
  '忌': '化忌（执着、阻碍、消耗）',
};

function describePalace(palace: Palace): string {
  const majorStars = palace.stars.filter(s => s.type === 'major');
  const minorStars = palace.stars.filter(s => s.type === 'minor');
  const luckyStars = palace.stars.filter(s => s.type === 'lucky');
  const shaStars = palace.stars.filter(s => s.type === 'sha');

  const parts: string[] = [];
  if (majorStars.length > 0) {
    const starDescs = majorStars.map(s => {
      let desc = s.name;
      if (s.brightnessRaw) desc += `(${s.brightnessRaw})`;
      if (s.siHua) desc += `[${SI_HUA_MEANING[s.siHua] || s.siHua}]`;
      return desc;
    });
    parts.push(`主星: ${starDescs.join(', ')}`);
  } else {
    parts.push('主星: (空宫)');
    if (palace.borrowedStars?.length) {
      parts.push(`借对宫: ${palace.borrowedStars.join(', ')}`);
    }
  }

  if (minorStars.length > 0) {
    parts.push(`辅星: ${minorStars.map(s => s.name + (s.siHua ? `[${s.siHua}]` : '')).join(', ')}`);
  }
  if (luckyStars.length > 0) {
    parts.push(`吉星: ${luckyStars.map(s => s.name).join(', ')}`);
  }
  if (shaStars.length > 0) {
    parts.push(`煞星: ${shaStars.map(s => s.name).join(', ')}`);
  }

  if (palace.selfSihua?.length) {
    parts.push(`自化: ${palace.selfSihua.map(m => `${m.starName}自化${m.siHua}`).join(', ')}`);
  }

  return parts.join(' | ');
}

function buildChartContext(chart: ZiweiChart): string {
  const { birthInfo, lunarInfo } = chart;
  const genderText = birthInfo.gender === 'male' ? '男' : '女';

  const lines: string[] = [
    `【命盘基本信息】`,
    `性别: ${genderText}`,
    `公历: ${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日`,
    `时辰: ${BRANCHES[birthInfo.hour]}时（时辰序号${birthInfo.hour}）`,
    `农历: ${lunarInfo.lunarYear}年${lunarInfo.isLeapMonth ? '闰' : ''}${Math.abs(lunarInfo.lunarMonth)}月${lunarInfo.lunarDay}日`,
    `年柱: ${STEMS[lunarInfo.yearStem]}${BRANCHES[lunarInfo.yearBranch]}`,
    `五行局: ${chart.wuxingJuName}`,
    `命宫: ${BRANCHES[chart.mingGongBranch]}宫`,
    `身宫: ${BRANCHES[chart.shenGongBranch]}宫`,
    `命主星: ${chart.mingZhu || '未知'}`,
    `身主星: ${chart.shenZhu || '未知'}`,
    `阴阳性别: ${chart.yinYangGender || '未知'}`,
    '',
    `【十二宫详情】`,
  ];

  for (const palace of chart.palaces) {
    const palaceName = PALACE_NAMES_ORDER[palace.name.charCodeAt(0) >= 0x4e00 ? chart.palaces.indexOf(palace) : 0] || palace.name;
    const dxInfo = palace.daXianAge ? ` [大限${palace.daXianAge[0]}-${palace.daXianAge[1]}岁]` : '';
    const marks: string[] = [];
    if (palace.isMingGong) marks.push('命宫');
    if (palace.isShenGong) marks.push('身宫');
    if (palace.isCurrentDaXian) marks.push('当前大限');
    const markStr = marks.length ? ` ※${marks.join('/')}` : '';

    lines.push(`${palace.name}（${BRANCHES[palace.branch]}宫${dxInfo}${markStr}）: ${describePalace(palace)}`);
  }

  if (chart.daXians?.length) {
    lines.push('', `【大限排列】`);
    for (const dx of chart.daXians) {
      const current = dx.palaceBranch === chart.daXians[chart.currentDaXianIndex]?.palaceBranch ? ' ← 当前' : '';
      lines.push(`${dx.startAge}-${dx.endAge}岁: ${dx.palaceName}（${BRANCHES[dx.palaceBranch]}宫）${current}`);
    }
  }

  return lines.join('\n');
}

function buildSystemPrompt(chart: ZiweiChart, lang: 'zh' | 'en' = 'zh'): string {
  const chartContext = buildChartContext(chart);

  if (lang === 'en') {
    return `You are a Ziwei Dou Shu (Purple Star Astrology) expert, strictly following the Ni Haixia "Tian Ji" lineage.

${chartContext}

【Interpretation Rules】
1. Based on the Ni Haixia "Tian Ji" orthodox Ziwei Dou Shu system. Do NOT use Flying Star school tools (self-transformation, origin palace, etc.)
2. Keep Chinese proper nouns with pinyin + English (e.g., Ziwei=紫微, Tianfu=天府, Hua Lu=化禄)
3. Be specific about palaces, stars, and Si Hua (Four Transformations). Do not generalize.
4. State conclusions first, then provide evidence (which star, which palace, brightness, Si Hua)
5. Consider star brightness (庙旺利陷) and its impact on interpretation
6. Apply the empty palace borrowing rule when applicable
7. Analyze Da Xian (decade) and Liu Nian (annual) in relation to current age
8. Health analysis follows Ni Haixia's method: find the palace with the most Sha stars, map by Earthly Branch to organ
9. Six relatives (parents, siblings, children) analysis is for reference only — Ziwei Dou Shu has limitations here
10. Respond in English. Be concise and professional.

【Cautions】
- Do not mention impossible Si Hua combinations (e.g., Qi Sha Hua Quan, Ziwei Hua Ji — these do not exist in the Si Hua table)
- Conditional statements must specify the condition
- State negative effects of fallen stars honestly, but do not alarm the user
- Hua Ji is not necessarily bad — depends on palace and which star transforms`;
  }

  return `你是一位精通紫微斗数的命理师，严格遵循倪海厦《天纪》体系进行解读。

${chartContext}

【解读规则】
1. 基于倪海厦《天纪》正统紫微斗数体系，不使用飞星派（自化、来因宫等）工具
2. 命理专名用拼音+英文（如 Ziwei=紫微, Tianfu=天府, Hua Lu=化禄）
3. 解读要具体到宫位、星曜、四化，不要泛泛而谈
4. 先说结论，再给依据（哪颗星在哪个宫、什么亮度、有无四化）
5. 注意星曜庙旺利陷对论断的影响
6. 注意空宫借对宫星曜的规则
7. 大限和流年要结合当前年龄分析
8. 健康分析按倪师方法：全盘杀星最集中的宫位，按地支对应脏腑
9. 六亲（父母、兄弟、子女）判断仅供参考，紫微斗数在六亲方面有局限
10. 回答用中文，语言简洁专业，避免冗长

【注意事项】
- 不会发生的四化不要提及（如七杀化权、紫微化忌等不存在于四化表中的组合）
- 有条件的断语要写明条件
- 落陷星曜的负面影响要如实指出，但不要恐吓
- 化忌不一定是坏事，要看在什么宫位、什么星化忌`;
}


export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { chart, messages, lang = 'zh' } = body;

    if (!chart || !messages) {
      return new Response(JSON.stringify({ error: 'Missing chart or messages' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sessionId = req.cookies.get('ziwei_session')?.value;

    if (!sessionId) {
      return new Response(JSON.stringify({
        error: 'not_authenticated',
        message: 'AI 解盘需要登录后使用',
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
    const userMsgCount = messages.filter(m => m.role === 'user').length;
    const isQA = userMsgCount > 1;
    const creditsCost = isQA ? CREDITS_AI_QA : CREDITS_AI_INTERPRET;

    if (!isPremium) {
      if (user.credits < creditsCost) {
        return new Response(JSON.stringify({
          error: 'insufficient_credits',
          message: isQA ? `积分不足，AI 问答每次需要 ${CREDITS_AI_QA} 积分` : `积分不足，AI 解盘每次需要 ${CREDITS_AI_INTERPRET} 积分`,
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

    const systemPrompt = buildSystemPrompt(chart, lang);
    const aiBody = await callAI(systemPrompt, messages, apiKey, baseUrl, model);

    if (!isPremium) {
      deductCredits(userId, creditsCost);
      logCredits(userId, isQA ? 'ai_qa' : 'ai_interpret', -creditsCost);
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
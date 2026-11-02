import { NextRequest } from 'next/server';
import { callAI, createSSEStream, type ChatMessage } from '@/lib/ai/stream';

export const runtime = 'nodejs';

interface RequestBody {
  houseType: string;
  facingDirection: string;
  birthYear?: string;
  gender?: 'male' | 'female';
  roomLayout?: string;
  lang?: 'zh' | 'en';
}

const HOUSE_TYPE_MAP: Record<string, { zh: string; en: string }> = {
  apartment: { zh: '公寓/楼房', en: 'Apartment' },
  house: { zh: '独栋住宅', en: 'House' },
  office: { zh: '办公室', en: 'Office' },
  shop: { zh: '商铺', en: 'Shop' },
};

function buildSystemPrompt(lang: 'zh' | 'en' = 'zh'): string {
  if (lang === 'en') {
    return `You are a Feng Shui (Kan Yu) master, deeply versed in Daoist Yin-Yang, Five Elements (Wu Xing), and Bagua direction theory.

【Knowledge Base】
- Bagua Directions: Qian(NW/Metal/Heaven/Father), Kan(N/Water/Middle son/Risk), Gen(NE/Earth/Mountain/Youngest son/Stillness), Zhen(E/Wood/Thunder/Eldest son/Movement), Xun(SE/Wood/Wind/Eldest daughter/Entry), Li(S/Fire/Middle daughter/Brightness), Kun(SW/Earth/Mother/Yielding), Dui(W/Metal/Lake/Youngest daughter/Joy)
- Five Elements Generation: Metal→Water→Wood→Fire→Earth→Metal
- Five Elements Destruction: Metal→Wood→Earth→Water→Fire→Metal
- Ming Gua (Life Gua) calculation based on birth year determines favorable directions
- East Four Gua (Zhen, Xun, Kan, Li) favorable directions: E, SE, N, S
- West Four Gua (Qian, Kun, Gen, Dui) favorable directions: W, NW, SW, NE

【Analysis Rules】
1. Analyze the facing direction using Bagua theory — determine which trigram governs the direction
2. Evaluate Five Elements compatibility between the occupant's Ming Gua and the house direction
3. Assess room layout based on Bagua palace attributes (e.g., kitchen should not be in NW/Qian — Heaven palace)
4. Identify favorable and unfavorable directions for the occupant
5. Provide specific, actionable Feng Shui adjustment recommendations
6. Be practical — focus on layout adjustments that are feasible to implement
7. Keep Chinese proper nouns with pinyin (e.g., Qian=乾, Kan=坎, Ming Gua=命卦)
8. Respond in English, be concise and professional

【Cautions】
- Do not make absolute predictions about fortune or misfortune — Feng Shui is about harmony and balance
- Recommendations should be practical and achievable
- Acknowledge limitations — Feng Shui analysis cannot replace professional on-site assessment`;
  }

  return `你是一位精通风水堪舆的大师，深谙道家阴阳五行、八卦方位理论。

【知识体系】
- 八卦方位：乾(西北/金/天/父)，坎(正北/水/中男/险)，艮(东北/土/山/少男/止)，震(正东/木/雷/长男/动)，巽(东南/木/风/长女/入)，离(正南/火/中女/明)，坤(西南/土/地/母/顺)，兑(正西/金/泽/少女/悦)
- 五行相生：金→水→木→火→土→金
- 五行相克：金→木→土→水→火→金
- 命卦推算：根据出生年份推算命卦，确定吉凶方位
- 东四命（震、巽、坎、离）吉方：东、东南、北、南
- 西四命（乾、坤、艮、兑）吉方：西、西北、西南、东北

【分析规则】
1. 根据八卦理论分析房屋朝向——确定该方位所属卦象
2. 评估居住者命卦与房屋朝向的五行生克关系
3. 根据八卦宫位属性评估房间布局（如厨房不宜在西北乾宫——天位）
4. 指出居住者的吉方和凶方
5. 提供具体可执行的风水调整建议
6. 建议要实用，聚焦于可行的布局调整
7. 回答用中文，语言简洁专业

【注意事项】
- 不要做绝对的吉凶断言——风水讲究和谐与平衡
- 建议应当实用且可操作
- 说明风水分析的局限性——无法替代实地专业勘测`;
}

function buildUserMessage(body: RequestBody, lang: 'zh' | 'en'): string {
  const houseTypeLabel = HOUSE_TYPE_MAP[body.houseType]?.[lang] || body.houseType;
  const parts: string[] = [];

  if (lang === 'en') {
    parts.push(`【Feng Shui Analysis Request】`);
    parts.push(`House Type: ${houseTypeLabel}`);
    parts.push(`Facing Direction: ${body.facingDirection}`);
    if (body.birthYear) {
      parts.push(`Birth Year: ${body.birthYear}`);
      if (body.gender) {
        parts.push(`Gender: ${body.gender === 'male' ? 'Male' : 'Female'}`);
      }
      parts.push(`(for Ming Gua calculation)`);
    }
    if (body.roomLayout) {
      parts.push(`Room Layout Description: ${body.roomLayout}`);
    }
    parts.push('');
    parts.push(`Please analyze the Feng Shui of this residence based on the above information. Include:`);
    parts.push(`1. Bagua direction analysis for the facing direction`);
    parts.push(`2. Five Elements compatibility assessment`);
    if (body.birthYear) {
      parts.push(`3. Ming Gua calculation and favorable/unfavorable directions`);
    }
    parts.push(`4. Room layout evaluation and specific adjustment recommendations`);
    parts.push(`5. Overall Feng Shui rating and key recommendations`);
  } else {
    parts.push(`【风水分析请求】`);
    parts.push(`房屋类型：${houseTypeLabel}`);
    parts.push(`房屋朝向：${body.facingDirection}`);
    if (body.birthYear) {
      parts.push(`出生年份：${body.birthYear}（用于命卦推算）`);
      if (body.gender) {
        parts.push(`性别：${body.gender === 'male' ? '男' : '女'}`);
      }
    }
    if (body.roomLayout) {
      parts.push(`房间布局描述：${body.roomLayout}`);
    }
    parts.push('');
    parts.push(`请根据以上信息分析此住宅的风水格局，包括：`);
    parts.push(`1. 朝向的八卦方位分析`);
    parts.push(`2. 五行生克评估`);
    if (body.birthYear) {
      parts.push(`3. 命卦推算及吉凶方位`);
    }
    parts.push(`4. 房间布局评估与具体调整建议`);
    parts.push(`5. 整体风水评分及关键建议`);
  }

  return parts.join('\n');
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { houseType, facingDirection, birthYear, gender, roomLayout, lang = 'zh' } = body;

    if (!houseType || !facingDirection) {
      return new Response(JSON.stringify({
        error: 'Missing houseType or facingDirection',
      }), {
        status: 400,
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

    const systemPrompt = buildSystemPrompt(lang);
    const userMessage = buildUserMessage({ houseType, facingDirection, birthYear, gender, roomLayout }, lang);

    const aiBody = await callAI(systemPrompt, userMessage, apiKey, baseUrl, model);
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
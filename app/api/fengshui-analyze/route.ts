import { NextRequest } from 'next/server';
import { callAI, createSSEStream, type ChatMessage } from '@/lib/ai/stream';
import { getSession, getUserById, isAdmin, isMembershipActive, deductCredits, logCredits, CREDITS_FENGSHUI } from '@/lib/db';

export const runtime = 'nodejs';

interface RequestBody {
  houseType: string;
  facingDirection: string;
  birthYear?: string;
  gender?: 'male' | 'female';
  floor?: string;
  unitType?: string;
  surroundings?: string[];
  roomLayout?: string;
  lang?: 'zh' | 'en';
}

const HOUSE_TYPE_MAP: Record<string, { zh: string; en: string }> = {
  apartment: { zh: '公寓/楼房', en: 'Apartment' },
  house: { zh: '独栋住宅', en: 'House' },
  office: { zh: '办公室', en: 'Office' },
  shop: { zh: '商铺', en: 'Shop' },
  tomb: { zh: '阴宅/墓地', en: 'Tomb/Cemetery' },
  factory: { zh: '工厂/企业', en: 'Factory/Enterprise' },
  hotel: { zh: '酒店/餐饮', en: 'Hotel/Restaurant' },
  school: { zh: '学校/教育', en: 'School/Education' },
};

const UNIT_TYPE_MAP: Record<string, { zh: string; en: string; element: string }> = {
  east: { zh: '东边户', en: 'East Unit', element: '木' },
  west: { zh: '西边户', en: 'West Unit', element: '金' },
  south: { zh: '南边户', en: 'South Unit', element: '火' },
  north: { zh: '北边户', en: 'North Unit', element: '水' },
  middle: { zh: '中间户型', en: 'Middle Unit', element: '土' },
};

const FLOOR_ELEMENT_MAP: Record<string, { zh: string; en: string }> = {
  water: { zh: '水', en: 'Water' },
  fire: { zh: '火', en: 'Fire' },
  wood: { zh: '木', en: 'Wood' },
  metal: { zh: '金', en: 'Metal' },
  earth: { zh: '土', en: 'Earth' },
};

const SURROUNDINGS_MAP: Record<string, { zh: string; en: string }> = {
  hospital: { zh: '医院', en: 'Hospital' },
  temple: { zh: '寺庙/教堂', en: 'Temple/Church' },
  river: { zh: '河流/水池', en: 'River/Water' },
  highrise: { zh: '高楼/高架', en: 'High-rise/Viaduct' },
  park: { zh: '公园/绿地', en: 'Park/Greenery' },
  cemetery: { zh: '墓地/殡仪馆', en: 'Cemetery' },
  school: { zh: '学校', en: 'School' },
  market: { zh: '市场/商业街', en: 'Market' },
  crossroad: { zh: '十字路口', en: 'Crossroad' },
  railway: { zh: '铁路/地铁', en: 'Railway/Subway' },
};

function getFloorElement(floorNum: number): string {
  const lastDigit = floorNum % 10;
  if (lastDigit === 1 || lastDigit === 6) return 'water';
  if (lastDigit === 2 || lastDigit === 7) return 'fire';
  if (lastDigit === 3 || lastDigit === 8) return 'wood';
  if (lastDigit === 4 || lastDigit === 9) return 'metal';
  return 'earth';
}

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
- Floor Five Elements (He Tu Luo Shu): floors ending 1/6=Water, 2/7=Fire, 3/8=Wood, 4/9=Metal, 5/0=Earth
- Unit Type Five Elements: East Unit=Wood(morning light, vital energy), West Unit=Metal(afternoon sun, strong light), South Unit=Fire(strongest Yang), North Unit=Water(heavier Yin, less light), Middle Unit=Earth(stable but poor ventilation, no side windows)
- Surroundings impact: Hospital(Yin energy), Temple(special Qi), River(wealth but position matters), High-rise(oppression), Park(vital Qi), Cemetery(extreme Yin), School(Yang but noise), Market(noise), Crossroad(chaotic Qi), Railway(movement Qi)

【Type-Specific Knowledge】
- Yang Residence (Apartment/House): Focus on door-main-kitchen (门主灶) triad, room layout by Bagua palace, Ming Gua matching
- Commercial (Office/Shop): Focus on wealth position (财位) — typically diagonal from entrance, reception desk placement, cash register location, customer flow
- Yin Residence (Tomb/Cemetery): Focus on dragon vein (龙脉), sand-water (砂水) pattern, bright hall (明堂), facing mountain (朝案), water incoming/outgoing (来水去水). Tomb should face auspicious direction matching descendant's Ming Gua
- Factory/Enterprise: Focus on production area (Yang) vs administration (Yin) zoning, main gate direction for wealth attraction, warehouse placement, office building orientation
- Hotel/Restaurant: Focus on main entrance direction, lobby layout, kitchen fire position (avoid NW), guest room orientation, restaurant seating arrangement
- School/Education: Focus on Wen Qu Xing (文昌星) — SE direction for study areas, classroom lighting, library placement, main gate direction for academic Qi

【Analysis Rules】
1. Analyze the facing direction using Bagua theory — determine which trigram governs the direction
2. Evaluate Five Elements compatibility between the occupant's Ming Gua and the direction
3. Assess floor Five Elements compatibility (for Yang residence with floors)
4. Evaluate surrounding environment impact
5. For Yang residence: assess room layout based on Bagua palace attributes
6. For Yin residence: assess dragon-sand-water-ming hall pattern
7. For commercial: assess wealth position and customer flow
8. For factory: assess production-admin zoning and main gate
9. For hotel/restaurant: assess entrance, kitchen, and seating
10. For school: assess Wen Chang position and study environment
11. Identify favorable and unfavorable directions
12. Provide specific, actionable adjustment recommendations
13. Be practical — focus on feasible adjustments
14. Respond in English, be concise and professional

【Output Format】
Use markdown formatting with clear section headers. Adapt sections to the analysis type:
## 1. Direction Analysis
## 2. Five Elements Assessment
## 3. Type-Specific Evaluation (floor/layout/dragon-vein/wealth-position/etc.)
## 4. Surrounding Environment
## 5. Ming Gua & Favorable Directions (if birth year provided)
## 6. Adjustment Recommendations
## 7. Overall Assessment

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
- 楼层五行（河图洛书）：尾数1/6层属水，2/7层属火，3/8层属木，4/9层属金，5/0层属土
- 户型五行：东边户=木(晨光朝气)，西边户=金(午后强光)，南边户=火(阳气最旺)，北边户=水(阴气较重采光弱)，中间户型=土(气场稳定但通风差无侧窗)
- 周边环境影响：医院(阴气重)，寺庙(气场特殊)，河流(主财但位置重要)，高楼(压迫感)，公园(生气旺)，墓地(阴气极重)，学校(阳气旺但噪音)，市场(喧闹)，十字路口(气场混乱)，铁路(动气振动)

【各类型专项知识】
- 阳宅（公寓/住宅）：重点分析门主灶三大关键，按八卦宫位评估房间布局，命卦与朝向匹配
- 商业（办公室/商铺）：重点分析财位（通常在大门对角线），前台/收银台位置，客流走向，门面朝向
- 阴宅（墓地）：重点分析龙脉走势、砂水格局、明堂开阔度、朝案山、来水去水方向。墓碑朝向需与后代命卦相配
- 工厂/企业：重点分析生产区（阳）与行政区（阴）的分区，大门朝向纳财，仓库位置，办公楼朝向
- 酒店/餐饮：重点分析大门朝向、大堂布局、厨房火位（忌西北乾宫）、客房朝向、餐厅座位安排
- 学校/教育：重点分析文昌位（东南方）设置学习区，教室采光，图书馆位置，校门朝向纳文气

【分析规则】
1. 根据八卦理论分析朝向——确定该方位所属卦象
2. 评估命卦与朝向的五行生克关系
3. 阳宅评估楼层五行与命卦的生克关系
4. 评估周边环境对选址的影响
5. 阳宅：按八卦宫位评估房间布局
6. 阴宅：评估龙砂水明堂格局
7. 商业：评估财位与客流走向
8. 工厂：评估生产行政分区与大门朝向
9. 酒店/餐饮：评估门面、厨房、座位
10. 学校：评估文昌位与学习环境
11. 指出吉方和凶方
12. 提供具体可执行的风水调整建议
13. 建议要实用，聚焦于可行的调整
14. 回答用中文，语言简洁专业

【输出格式】
使用markdown格式，根据分析类型调整分段标题：
## 一、方位分析
## 二、五行评估
## 三、专项评估（楼层/布局/龙脉/财位等）
## 四、周边环境
## 五、命卦与吉凶方位（如有出生年份）
## 六、调整建议
## 七、综合评估

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
    if (body.floor) {
      const floorNum = parseInt(body.floor);
      if (!isNaN(floorNum) && floorNum > 0) {
        const element = getFloorElement(floorNum);
        parts.push(`Floor: ${floorNum} (${FLOOR_ELEMENT_MAP[element].en} element)`);
      }
    }
    if (body.unitType) {
      const ut = UNIT_TYPE_MAP[body.unitType];
      if (ut) parts.push(`Unit Type: ${ut.en} (${ut.element} element)`);
    }
    if (body.surroundings && body.surroundings.length > 0) {
      const surroundingsList = body.surroundings.map(s => SURROUNDINGS_MAP[s]?.en || s).join(', ');
      parts.push(`Surrounding Environment: ${surroundingsList}`);
    }
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
    parts.push(`Please analyze the Feng Shui of this residence based on the above information.`);
  } else {
    parts.push(`【风水分析请求】`);
    parts.push(`房屋类型：${houseTypeLabel}`);
    parts.push(`房屋朝向：${body.facingDirection}`);
    if (body.floor) {
      const floorNum = parseInt(body.floor);
      if (!isNaN(floorNum) && floorNum > 0) {
        const element = getFloorElement(floorNum);
        parts.push(`楼层：${floorNum}层（五行属${FLOOR_ELEMENT_MAP[element].zh}）`);
      }
    }
    if (body.unitType) {
      const ut = UNIT_TYPE_MAP[body.unitType];
      if (ut) parts.push(`户型：${ut.zh}（五行属${ut.element}）`);
    }
    if (body.surroundings && body.surroundings.length > 0) {
      const surroundingsList = body.surroundings.map(s => SURROUNDINGS_MAP[s]?.zh || s).join('、');
      parts.push(`周边环境：${surroundingsList}`);
    }
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
    parts.push(`请根据以上信息分析此住宅的风水格局。`);
  }

  return parts.join('\n');
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { houseType, facingDirection, birthYear, gender, floor, unitType, surroundings, roomLayout, lang = 'zh' } = body;

    if (!houseType || !facingDirection) {
      return new Response(JSON.stringify({
        error: 'Missing houseType or facingDirection',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sessionId = req.cookies.get('ziwei_session')?.value;

    if (!sessionId) {
      return new Response(JSON.stringify({
        error: 'not_authenticated',
        message: lang === 'en' ? 'Feng Shui analysis requires login' : '风水分析需要登录后使用',
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

    const user = getUserById(session.user_id);
    if (!user) {
      return new Response(JSON.stringify({
        error: 'User not found',
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isPremium = isMembershipActive(user) || isAdmin(user.wallet_address);

    if (!isPremium) {
      if (user.credits < CREDITS_FENGSHUI) {
        return new Response(JSON.stringify({
          error: 'insufficient_credits',
          message: lang === 'en' ? `Insufficient credits. Feng Shui analysis costs ${CREDITS_FENGSHUI} credits.` : `积分不足，风水分析每次需要 ${CREDITS_FENGSHUI} 积分`,
          credits: user.credits,
          cost: CREDITS_FENGSHUI,
        }), {
          status: 402,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      deductCredits(user.id, CREDITS_FENGSHUI);
      logCredits(user.id, 'fengshui', -CREDITS_FENGSHUI);
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
    const userMessage = buildUserMessage({ houseType, facingDirection, birthYear, gender, floor, unitType, surroundings, roomLayout }, lang);

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
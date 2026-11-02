import { NextRequest } from 'next/server';
import { getSession, getUserById, isAdmin, isMembershipActive, deductCredits, logCredits, CREDITS_AI_QA } from '@/lib/db';
import { callAI, createSSEStream, type ChatMessage, type ContentPart } from '@/lib/ai/stream';

export const runtime = 'nodejs';

interface RequestBody {
  image: string;
  lang?: 'zh' | 'en';
}

const SYSTEM_PROMPTS: Record<'zh' | 'en', string> = {
  zh: `你是一位精通面相学的命理师，拥有深厚的传统面相学功底。请根据用户上传的面部照片，从以下维度进行专业面相分析：

1. 脸型 — 判断脸型（鹅蛋脸、圆脸、方脸、长脸、菱形脸、瓜子脸等），分析性格特征和整体运势
2. 额头 — 观察额头宽窄高低，分析少年运和智慧
3. 眉毛 — 观察眉形（浓密、稀疏、修长、短促、弯月、平直、连眉），分析性格和人际关系
4. 眼睛 — 观察眼形（大眼、小眼、凤眼、杏眼、圆眼、细长眼、深陷眼），分析感情和智慧
5. 鼻子 — 观察鼻形（挺直、高挺、扁平、尖细、宽厚、修长、圆鼻头），分析财运和中年运
6. 嘴巴 — 观察嘴形（大嘴、小嘴、厚唇、薄唇、嘴角上扬、嘴角下垂、阔嘴），分析言语和感情
7. 下巴 — 观察下巴（圆润、尖削、方正、修长、短促、前突、后缩），分析晚年运和意志力
8. 耳朵 — 观察耳朵（大耳、小耳、厚实、薄削、招风耳、贴脑耳、长耳垂、短耳垂），分析福气和健康

请对每个维度给出：
- 特征判断（属于哪种类型）
- 运势分析（吉凶等级：大吉/吉/中吉/平/小凶/凶）
- 具体解读（与事业、财运、感情、健康的关联）

最后给出：
- 总体面相运势评级
- 综合解读总结
- 行事建议（2-3条针对性建议）

注意：面相分析仅供文化参考，请用专业但温和的语气，不要恐吓用户。`,
  en: `You are an expert in Chinese face reading (面相学) with deep knowledge of traditional physiognomy. Based on the uploaded facial photo, analyze from the following dimensions:

1. Face Shape — Determine face shape (oval, round, square, long, diamond, heart) and analyze personality and overall fortune
2. Forehead — Observe forehead width/height, analyze early fortune and wisdom
3. Eyebrows — Observe eyebrow shape (thick, thin, long, short, arched, straight, joined), analyze personality and relationships
4. Eyes — Observe eye shape (big, small, phoenix, almond, round, narrow, deep-set), analyze emotions and wisdom
5. Nose — Observe nose shape (straight, high, flat, pointed, wide, long, bulbous), analyze wealth and mid-life fortune
6. Mouth — Observe mouth shape (big, small, thick lips, thin lips, upturned, downturned, wide), analyze speech and relationships
7. Chin — Observe chin shape (round, pointed, square, long, short, protruding, receding), analyze late-life fortune and willpower
8. Ears — Observe ear shape (big, small, thick, thin, protruding, close, long lobule, short lobule), analyze fortune and health

For each dimension, provide:
- Feature identification (which type)
- Fortune level (Excellent/Good/Fair/Average/Poor/Bad)
- Specific interpretation (relation to career, wealth, relationships, health)

Finally provide:
- Overall face fortune rating
- Comprehensive interpretation summary
- Actionable advice (2-3 specific suggestions)

Note: Face reading is for cultural reference only. Use professional but gentle tone. Do not alarm the user.`,
};

export async function POST(req: NextRequest) {
  let lang: 'zh' | 'en' = 'zh';
  try {
    const body: RequestBody = await req.json();
    lang = body.lang || 'zh';
    const { image } = body;

    if (!image) {
      return new Response(JSON.stringify({ error: 'Missing image' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sessionId = req.cookies.get('ziwei_session')?.value;

    if (!sessionId) {
      return new Response(JSON.stringify({
        error: 'not_authenticated',
        message: lang === 'en' ? 'Face analysis requires login' : '面相分析需要登录后使用',
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
          message: lang === 'en' ? `Insufficient credits. Face analysis costs ${CREDITS_AI_QA} credits.` : `积分不足，面相分析每次需要 ${CREDITS_AI_QA} 积分`,
          credits: user.credits,
          cost: CREDITS_AI_QA,
        }), {
          status: 402,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const apiKey = process.env.VISION_API_KEY || process.env.MIMO_API_KEY || '';
    const baseUrl = process.env.VISION_BASE_URL || process.env.MIMO_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3';
    const visionModel = process.env.VISION_MODEL || 'doubao-1.5-vision-pro-32k';

    if (!apiKey) {
      return new Response(JSON.stringify({
        error: 'AI API key not configured',
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = SYSTEM_PROMPTS[lang];

    const userContent: ContentPart[] = [
      {
        type: 'text',
        text: lang === 'en'
          ? 'Please analyze my face from this photo using Chinese face reading principles.'
          : '请根据这张照片进行面相分析。',
      },
      {
        type: 'image_url',
        image_url: { url: image },
      },
    ];

    const messages: ChatMessage[] = [
      { role: 'user', content: userContent },
    ];

    const aiBody = await callAI(systemPrompt, messages, apiKey, baseUrl, visionModel);

    if (!isPremium) {
      deductCredits(userId, CREDITS_AI_QA);
      logCredits(userId, 'ai_mianxiang', -CREDITS_AI_QA);
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
    const isApiError = errMsg.includes('AI API error');
    return new Response(JSON.stringify({
      error: isApiError ? 'vision_model_unavailable' : 'internal_error',
      message: isApiError
        ? (lang === 'zh' ? '视觉模型不可用，请在Ark控制台开通视觉模型权限' : 'Vision model unavailable, please enable vision model in Ark console')
        : errMsg,
    }), {
      status: isApiError ? 503 : 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

}
import { NextRequest } from 'next/server';
import { getSession, getUserById, isAdmin, isMembershipActive, deductCredits, logCredits, CREDITS_AI_QA } from '@/lib/db';
import { callAI, createSSEStream, type ChatMessage, type ContentPart } from '@/lib/ai/stream';

export const runtime = 'nodejs';

interface RequestBody {
  image: string;
  lang?: 'zh' | 'en';
}

const SYSTEM_PROMPTS: Record<'zh' | 'en', string> = {
  zh: `你是一位精通手相学的命理师，拥有深厚的传统手相学功底。请根据用户上传的手掌照片，从以下维度进行专业手相分析：

1. 生命线 — 观察生命线长短深浅曲直，分析健康和生命力
2. 智慧线 — 观察智慧线长短深浅曲直分叉，分析思维和智力
3. 感情线 — 观察感情线长短深浅曲直分叉，分析感情和人际关系
4. 命运线 — 观察命运线有无深浅长短，分析事业和人生方向
5. 手指 — 观察手指长短粗细曲直，分析性格细节
6. 拇指 — 观察拇指大小长短厚薄柔软度，分析意志力和决断力
7. 掌型 — 观察掌型（方形掌、长形掌、宽阔掌、狭窄掌、厚实掌、薄削掌），分析整体格局

请对每个维度给出：
- 特征判断（属于哪种类型）
- 运势分析（吉凶等级：大吉/吉/中吉/平/小凶/凶）
- 具体解读（与事业、财运、感情、健康的关联）

最后给出：
- 总体手相运势评级
- 综合解读总结
- 行事建议（2-3条针对性建议）

注意：手相分析仅供文化参考，请用专业但温和的语气，不要恐吓用户。`,
  en: `You are an expert in Chinese palm reading (手相学) with deep knowledge of traditional palmistry. Based on the uploaded palm photo, analyze from the following dimensions:

1. Life Line — Observe length, depth, curve, breaks; analyze health and vitality
2. Head Line — Observe length, depth, curve, forks; analyze thinking and intelligence
3. Heart Line — Observe length, depth, curve, forks; analyze emotions and relationships
4. Fate Line — Observe presence, depth, length; analyze career and life direction
5. Fingers — Observe length, thickness, straightness; analyze personality details
6. Thumb — Observe size, length, thickness, flexibility; analyze willpower and decisiveness
7. Palm Shape — Observe palm type (square, long, wide, narrow, thick, thin); analyze overall pattern

For each dimension, provide:
- Feature identification (which type)
- Fortune level (Excellent/Good/Fair/Average/Poor/Bad)
- Specific interpretation (relation to career, wealth, relationships, health)

Finally provide:
- Overall palm fortune rating
- Comprehensive interpretation summary
- Actionable advice (2-3 specific suggestions)

Note: Palm reading is for cultural reference only. Use professional but gentle tone. Do not alarm the user.`,
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
        message: lang === 'en' ? 'Palm analysis requires login' : '手相分析需要登录后使用',
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
          message: lang === 'en' ? `Insufficient credits. Palm analysis costs ${CREDITS_AI_QA} credits.` : `积分不足，手相分析每次需要 ${CREDITS_AI_QA} 积分`,
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
          ? 'Please analyze my palm from this photo using Chinese palm reading principles.'
          : '请根据这张手掌照片进行手相分析。',
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
      logCredits(userId, 'ai_shouxiang', -CREDITS_AI_QA);
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
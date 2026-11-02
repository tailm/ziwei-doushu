export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string | ContentPart[];
}

export interface ContentPart {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: { url: string };
}

export async function callAI(
  systemPrompt: string,
  messages: ChatMessage[] | string,
  apiKey: string,
  baseUrl: string,
  model: string,
): Promise<ReadableStream<Uint8Array>> {
  const openaiMessages = typeof messages === 'string'
    ? [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: messages },
      ]
    : [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ];

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: openaiMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 4096,
    }),
    signal: AbortSignal.timeout(120000),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status} ${response.statusText}`);
  }

  if (!response.body) {
    throw new Error('AI API returned no body');
  }

  return response.body;
}

export function createSSEStream(aiBody: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let buffer = '';

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = aiBody.getReader();
      try {
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
              const delta = parsed.choices?.[0]?.delta?.content ?? '';
              if (delta) {
                const sseData = `data: ${JSON.stringify({ delta: { text: delta } })}\n\n`;
                controller.enqueue(encoder.encode(sseData));
              }
            } catch {
              // skip non-JSON lines
            }
          }
        }

        if (buffer.startsWith('data: ')) {
          const data = buffer.slice(6).trim();
          if (data && data !== '[DONE]') {
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content ?? '';
              if (delta) {
                const sseData = `data: ${JSON.stringify({ delta: { text: delta } })}\n\n`;
                controller.enqueue(encoder.encode(sseData));
              }
            } catch {
              // skip
            }
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Stream error';
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: { text: `[错误] ${errMsg}` } })}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } finally {
        controller.close();
      }
    },
  });
}
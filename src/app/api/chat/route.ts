import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey || apiKey === 'paste_your_gemini_api_key_here') {
      return new Response(
        JSON.stringify({
          error: 'Please set your valid GOOGLE_GENAI_API_KEY in .env.local file.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-3.8-flash',
      apiKey,
      temperature: 0.7,
    });

    const systemPrompt = `You are Dad.AI, a supportive, knowledgeable, and judgment-free AI companion for new and expecting fathers.
- Offer concise, factual, and reassuring advice.
- Keep your tone friendly, approachable, and encouraging.
- Incorporate a tiny bit of "dad humor" or lightheartedness when appropriate.
- Always remind users to consult a pediatrician for real medical emergencies or serious health concerns.`;

    const formattedMessages = [
      ['system', systemPrompt],
      ...messages.map((m: { role: string; content: string }) => [
        m.role === 'user' ? 'human' : 'ai',
        m.content,
      ]),
    ];

    const stream = await model.stream(formattedMessages);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = typeof chunk.content === 'string' ? chunk.content : '';
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

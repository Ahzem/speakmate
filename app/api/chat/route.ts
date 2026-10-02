import { NextRequest, NextResponse } from 'next/server';
import { queryOllama, OllamaConnectionError, OllamaModelError } from '@/lib/ollama';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON payload. Please send a valid JSON request.' },
      { status: 400 }
    );
  }

  const { messages } = (body as { messages?: unknown }) || {};

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: 'Invalid request: messages array is required and cannot be empty.' },
      { status: 400 }
    );
  }

  // Sanitize and validate messages
  const validMessages = messages
    .filter(
      (m: unknown): m is { role: string; content: string } =>
        typeof m === 'object' &&
        m !== null &&
        'role' in m &&
        'content' in m &&
        typeof (m as { content: unknown }).content === 'string' &&
        ((m as { role: unknown }).role === 'user' || (m as { role: unknown }).role === 'assistant')
    )
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content.trim(),
    }))
    .filter((m) => m.content.length > 0);

  if (validMessages.length === 0) {
    return NextResponse.json(
      { error: 'Message content cannot be empty.' },
      { status: 400 }
    );
  }

  try {
    // Call Ollama with the conversation history
    const assistantReply = await queryOllama(validMessages);

    return NextResponse.json({
      message: {
        role: 'assistant',
        content: assistantReply,
      },
    });
  } catch (error: unknown) {
    if (error instanceof OllamaConnectionError) {
      return NextResponse.json(
        {
          error: error.message,
          code: 'OLLAMA_UNAVAILABLE',
        },
        { status: 503 }
      );
    }

    if (error instanceof OllamaModelError) {
      return NextResponse.json(
        {
          error: error.message,
          code: 'MODEL_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    console.error('Chat API unexpected error:', error);
    return NextResponse.json(
      {
        error: "SpeakMate encountered an unexpected error. Please try again.",
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}

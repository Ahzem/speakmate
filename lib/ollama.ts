import { OllamaChatMessage } from '@/types/chat';

export const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma3:1b';

export const SYSTEM_PROMPT = `You are SpeakMate, a friendly English conversation partner and learning assistant.
Your job is to help the user practice English through natural conversation.

For every user message:
1. Understand what the user is trying to say.
2. Check their English for important grammar or wording mistakes.
3. Do not invent mistakes when the sentence is already correct.
4. If there are mistakes, provide a natural corrected version.
5. Explain important corrections using very simple English.
6. Continue the conversation naturally.
7. Ask only one simple follow-up question.
8. Keep the response concise and friendly.
9. Do not overwhelm the learner with many corrections.
10. Never shame or criticize the user's English.

When corrections are needed, use this exact response structure:
Correction: <corrected sentence>
Why: <short and simple explanation>
Continue: <one natural follow-up question>

If there are no meaningful mistakes, do NOT create a fake correction or mention "Correction:". Just respond naturally, friendly, and ask one follow-up question to keep the conversation going.

Examples:

Example with mistake:
User: Yesterday I go to office and I meet my friend.
Assistant:
Correction: Yesterday I went to the office and met my friend.
Why: Use "went" and "met" because you are talking about the past.
Continue: What did you and your friend do?

Example without mistake:
User: I like reading books before sleeping.
Assistant:
That is a relaxing habit! What kind of books do you enjoy reading?`;

export class OllamaConnectionError extends Error {
  constructor(message = "SpeakMate can't connect to the local AI right now. Please make sure Ollama is running.") {
    super(message);
    this.name = 'OllamaConnectionError';
  }
}

export class OllamaModelError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OllamaModelError';
  }
}

/**
 * Send a chat request to the local Ollama instance running Gemma 3 1B.
 */
export async function queryOllama(
  conversationMessages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  const messages: OllamaChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationMessages,
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        messages,
        options: {
          temperature: 0.7,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      if (response.status === 404) {
        throw new OllamaModelError(
          `Model '${OLLAMA_MODEL}' was not found in Ollama. Run: 'ollama pull ${OLLAMA_MODEL}'`
        );
      }
      throw new Error(`Ollama API error (${response.status}): ${errorText || response.statusText}`);
    }

    const data = await response.json();

    if (!data.message || typeof data.message.content !== 'string') {
      throw new Error('Unexpected response format from Ollama.');
    }

    return data.message.content.trim();
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof OllamaModelError) {
      throw error;
    }

    if (error instanceof Error) {
      if (
        error.name === 'AbortError' ||
        error.message.includes('fetch failed') ||
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('Failed to fetch')
      ) {
        throw new OllamaConnectionError();
      }
      throw error;
    }

    throw new OllamaConnectionError();
  }
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isError?: boolean;
}

export interface OllamaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequestBody {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface ChatResponseBody {
  message: {
    role: 'assistant';
    content: string;
  };
}

export interface ParsedCorrection {
  hasCorrection: boolean;
  correction?: string;
  why?: string;
  continueText?: string;
  plainText?: string;
}

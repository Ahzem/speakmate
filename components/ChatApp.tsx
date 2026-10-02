'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import { Header } from '@/components/Header';
import { ChatMessageItem } from '@/components/ChatMessageItem';
import { TypingIndicator } from '@/components/TypingIndicator';
import { StarterPrompts } from '@/components/StarterPrompts';
import { ChatInput } from '@/components/ChatInput';
import { ConnectionBanner } from '@/components/ConnectionBanner';

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm SpeakMate. Let's practice English together. Tell me something about your day.",
  timestamp: 0,
};

export function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on message list updates or typing indicator
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    // Optimistically add user message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setErrorMessage(null);
    setLastFailedText(null);

    try {
      // Prepare conversation history to send to Ollama (excluding welcome message & errors)
      const conversationPayload = updatedMessages
        .filter((m) => !m.isError && m.id !== 'welcome')
        .slice(-10) // keep last 10 messages for Gemma 3 1B context window
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      // If this is the very first user message, the array only has 1 message
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: conversationPayload }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "SpeakMate can't connect to the local AI right now. Please make sure Ollama is running."
        );
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        role: 'assistant',
        content: data.message.content,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      const displayError =
        err instanceof Error
          ? err.message
          : "SpeakMate can't connect to the local AI right now. Please make sure Ollama is running.";

      setErrorMessage(displayError);
      setLastFailedText(trimmed);

      // Add a friendly error message bubble with retry option
      const errorAssistantMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: displayError,
        timestamp: Date.now(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorAssistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = (messageId?: string) => {
    if (messageId) {
      // Remove the error message from state
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    }
    if (lastFailedText) {
      handleSend(lastFailedText);
    }
  };

  const handleClearChat = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setMessages([
      {
        ...INITIAL_MESSAGE,
        timestamp: Date.now(),
      },
    ]);
    setErrorMessage(null);
    setLastFailedText(null);
  };

  const isInitialState = messages.length <= 1;

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      {/* Header */}
      <Header onClearChat={handleClearChat} messageCount={messages.length} />

      {/* Main chat viewport */}
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-5">
          {/* Connection Error Banner */}
          {errorMessage && (
            <ConnectionBanner
              message={errorMessage}
              onRetry={lastFailedText ? () => handleRetry() : undefined}
              onDismiss={() => setErrorMessage(null)}
            />
          )}

          {/* Chat Messages */}
          {messages.map((message) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              onRetry={handleRetry}
            />
          ))}

          {/* Typing Indicator */}
          {isLoading && <TypingIndicator />}

          {/* Starter Topics on Initial State */}
          {isInitialState && !isLoading && (
            <StarterPrompts
              onSelectPrompt={(text) => handleSend(text)}
              disabled={isLoading}
            />
          )}

          <div ref={messagesEndRef} className="h-2" />
        </div>
      </main>

      {/* Chat Input */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={handleSend}
        isLoading={isLoading}
      />
    </div>
  );
}

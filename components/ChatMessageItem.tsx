'use client';

import React, { useState } from 'react';
import { Message } from '@/types/chat';
import { parseAiResponse } from '@/lib/parser';
import { useMounted } from '@/lib/useMounted';

interface ChatMessageItemProps {
  message: Message;
  onRetry?: (messageId: string) => void;
}

export function ChatMessageItem({ message, onRetry }: ChatMessageItemProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isMounted = useMounted();

  const parsed = !isUser ? parseAiResponse(message.content) : null;
  const canSpeak = isMounted && typeof window !== 'undefined' && 'speechSynthesis' in window;
  const formattedTime =
    isMounted && message.timestamp > 0
      ? new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Read the primary conversational continuation or whole message
    const textToSpeak = parsed?.hasCorrection
      ? `${parsed.correction}. ${parsed.continueText || ''}`
      : message.content;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US';
    utterance.rate = 0.95; // Slightly slower for language learners

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 px-1">
        <div className="group relative max-w-[85%] sm:max-w-[75%]">
          <div className="rounded-2xl rounded-tr-xs bg-indigo-600 px-4 py-3 text-white shadow-xs">
            <p className="whitespace-pre-wrap break-words text-sm sm:text-[15px] leading-relaxed">
              {message.content}
            </p>
          </div>
          <div className="mt-1 flex items-center justify-end px-1">
            <span
              suppressHydrationWarning
              className="text-[11px] text-slate-400 min-h-[16px]"
            >
              {formattedTime}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex items-start gap-3 px-1">
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-semibold text-xs ring-1 ring-indigo-500/20">
        SM
      </div>

      <div className="flex-1 max-w-[92%] sm:max-w-[85%]">
        <div
          className={`rounded-2xl rounded-tl-xs border p-4 shadow-xs transition-colors ${
            message.isError
              ? 'border-red-200 bg-red-50/50 text-red-900'
              : 'border-slate-200/90 bg-white text-slate-800'
          }`}
        >
          {message.isError ? (
            <div>
              <div className="flex items-center gap-2 font-medium text-red-700 text-sm">
                <svg
                  className="h-4 w-4 shrink-0 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>Connection Issue</span>
              </div>
              <p className="mt-1.5 text-xs text-red-600 sm:text-sm leading-relaxed">
                {message.content}
              </p>
              {onRetry && (
                <button
                  type="button"
                  onClick={() => onRetry(message.id)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700 transition-colors"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Retry Message
                </button>
              )}
            </div>
          ) : parsed?.hasCorrection ? (
            /* Structured Learning Card */
            <div className="space-y-3.5">
              {/* Correction Section */}
              <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-3 sm:p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  <svg
                    className="h-4 w-4 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Correction</span>
                </div>
                <p className="mt-1.5 text-sm sm:text-[15px] font-medium text-emerald-950 leading-relaxed">
                  {parsed.correction}
                </p>
              </div>

              {/* Explanation Section */}
              {parsed.why && (
                <div className="rounded-xl border border-amber-200/70 bg-amber-50/50 p-3 sm:p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800">
                    <svg
                      className="h-4 w-4 text-amber-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Why</span>
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm text-amber-950 leading-relaxed">
                    {parsed.why}
                  </p>
                </div>
              )}

              {/* Conversation Continuation */}
              {parsed.continueText && (
                <div className="pt-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700">
                    <svg
                      className="h-4 w-4 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span>Continue</span>
                  </div>
                  <p className="mt-1.5 text-sm sm:text-[15px] font-normal text-slate-800 leading-relaxed">
                    {parsed.continueText}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Plain Conversation Reply */
            <p className="whitespace-pre-wrap break-words text-sm sm:text-[15px] leading-relaxed text-slate-800">
              {message.content}
            </p>
          )}

          {/* Action Toolbar */}
          {!message.isError && (
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-400">
              <span suppressHydrationWarning className="min-h-[16px]">
                {formattedTime}
              </span>

              <div className="flex items-center gap-2">
                {/* Audio Pronunciation Button (only after mounted) */}
                {canSpeak && (
                  <button
                    type="button"
                    onClick={handleSpeak}
                    className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium transition-colors ${
                      isSpeaking
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                    }`}
                    title={isSpeaking ? 'Stop speaking' : 'Listen in English'}
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      />
                    </svg>
                    <span>{isSpeaking ? 'Playing...' : 'Listen'}</span>
                  </button>
                )}

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  title="Copy text"
                >
                  {copied ? (
                    <>
                      <svg
                        className="h-3 w-3 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

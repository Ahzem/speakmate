'use client';

import React from 'react';

interface StarterPromptsProps {
  onSelectPrompt: (promptText: string) => void;
  disabled?: boolean;
}

const STARTER_PROMPTS = [
  {
    icon: '🌅',
    label: 'Tell me about my day',
    message: 'Hi SpeakMate, I want to tell you about what I did today.',
  },
  {
    icon: '💻',
    label: "Let's talk about technology",
    message: "Let's talk about technology and how AI is changing our daily lives.",
  },
  {
    icon: '💼',
    label: 'Practice job interview',
    message: 'Can you help me practice answering questions for a job interview?',
  },
  {
    icon: '☕',
    label: 'Weekend plans',
    message: 'I am planning a trip with my friends this weekend. What do you recommend?',
  },
];

export function StarterPrompts({ onSelectPrompt, disabled }: StarterPromptsProps) {
  return (
    <div className="mx-auto max-w-xl py-4">
      <p className="mb-2.5 text-center text-xs font-medium text-slate-400">
        Or choose a topic to begin:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {STARTER_PROMPTS.map((prompt) => (
          <button
            key={prompt.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(prompt.message)}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/80 p-3 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 active:scale-[0.99] disabled:opacity-50"
          >
            <span className="text-base select-none">{prompt.icon}</span>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                {prompt.label}
              </span>
            </div>
            <svg
              className="h-3.5 w-3.5 shrink-0 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

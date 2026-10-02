'use client';

import React from 'react';

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-1 animate-fade-in">
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-semibold text-xs ring-1 ring-indigo-500/20">
        SM
      </div>

      <div className="rounded-2xl rounded-tl-xs border border-slate-200/90 bg-white px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2">
          {/* Animated 3 dots */}
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce" />
          </div>
          <span className="text-xs font-medium text-slate-500">
            SpeakMate is thinking...
          </span>
        </div>
      </div>
    </div>
  );
}

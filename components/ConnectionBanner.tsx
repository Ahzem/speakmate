'use client';

import React from 'react';

interface ConnectionBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss: () => void;
}

export function ConnectionBanner({
  message,
  onRetry,
  onDismiss,
}: ConnectionBannerProps) {
  return (
    <div className="mx-auto my-2 max-w-2xl rounded-xl border border-amber-300 bg-amber-50/90 p-3.5 text-amber-900 shadow-xs backdrop-blur-xs">
      <div className="flex items-start gap-3">
        <div className="shrink-0 pt-0.5">
          <svg
            className="h-5 w-5 text-amber-600"
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
        </div>

        <div className="flex-1 text-xs sm:text-sm">
          <p className="font-semibold text-amber-900">{message}</p>
          <p className="mt-1 text-xs text-amber-800/90">
            Make sure Ollama is started locally and the Gemma 3 1B model is downloaded:
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <code className="rounded bg-amber-200/60 px-2 py-0.5 font-mono text-[11px] text-amber-950">
              ollama run gemma3:1b
            </code>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1 rounded-md bg-amber-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-700"
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
                Retry
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-md p-1 text-amber-600 hover:bg-amber-200/50 hover:text-amber-900 transition-colors"
          title="Dismiss"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

import { ParsedCorrection } from '@/types/chat';

/**
 * Parses the AI response into structured sections if a correction was provided,
 * or returns it as plain text if it was a standard conversational response.
 */
export function parseAiResponse(text: string): ParsedCorrection {
  // Matches "Correction: ...", "Why: ...", "Continue: ..." with optional markdown asterisks
  const correctionMatch = text.match(
    /(?:^|\n)\*?\*?Correction:\*?\*?\s*([\s\S]*?)(?=(?:\n\*?\*?Why:|\n\*?\*?Continue:|$))/i
  );
  const whyMatch = text.match(
    /(?:^|\n)\*?\*?Why:\*?\*?\s*([\s\S]*?)(?=(?:\n\*?\*?Continue:|$))/i
  );
  const continueMatch = text.match(
    /(?:^|\n)\*?\*?Continue:\*?\*?\s*([\s\S]*?)$/i
  );

  if (correctionMatch && correctionMatch[1]?.trim()) {
    return {
      hasCorrection: true,
      correction: correctionMatch[1].trim(),
      why: whyMatch ? whyMatch[1]?.trim() : undefined,
      continueText: continueMatch ? continueMatch[1]?.trim() : undefined,
      plainText: text.trim(),
    };
  }

  return {
    hasCorrection: false,
    plainText: text.trim(),
  };
}

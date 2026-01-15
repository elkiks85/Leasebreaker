'use client';

import { useState, useCallback } from 'react';

export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      setError('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setError(null);

      // Reset after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);

      return true;
    } catch (err) {
      setError('Failed to copy');
      setIsCopied(false);
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setIsCopied(false);
    setError(null);
  }, []);

  return { copy, isCopied, error, reset };
}

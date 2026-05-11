import { useState, useCallback } from 'react';

/**
 * Simple toast notification hook.
 * type: 'ok' | 'err' | 'del'
 */
export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

  return { toast, showToast, clearToast };
}

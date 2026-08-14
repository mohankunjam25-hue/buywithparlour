import { useState, useCallback, useRef } from 'react';

/**
 * Universal Anti-Spam Click Throttler
 * Discards any rapid subsequent clicks occurring within cooldownMs (defaults to 600ms).
 */
export function throttleClick<T extends (...args: any[]) => any>(
  fn: T,
  cooldownMs = 600
): (...args: Parameters<T>) => void {
  let isLocked = false;

  return function (...args: Parameters<T>) {
    if (isLocked) {
      // Instantly drop click without CPU load
      return;
    }

    isLocked = true;
    try {
      fn(...args);
    } finally {
      setTimeout(() => {
        isLocked = false;
      }, cooldownMs);
    }
  };
}

/**
 * React Hook for Synchronous and Asynchronous Button Click Mutex Locking
 */
export function useClickLock(defaultCooldownMs = 600) {
  const [isLocked, setIsLocked] = useState(false);
  const lockRef = useRef(false);

  const executeGuarded = useCallback(
    async (callback: () => Promise<void> | void, customCooldown?: number) => {
      if (lockRef.current) return;

      lockRef.current = true;
      setIsLocked(true);

      const cooldown = customCooldown || defaultCooldownMs;

      try {
        await callback();
      } catch (err) {
        console.error('[ClickGuard] Error during guarded execution:', err);
      } finally {
        setTimeout(() => {
          lockRef.current = false;
          setIsLocked(false);
        }, cooldown);
      }
    },
    [defaultCooldownMs]
  );

  return { isLocked, executeGuarded };
}

/**
 * 基于 IndexedDB 的用户偏好存储 Hook
 */

import { useCallback, useEffect, useState } from 'react';
import { getCachedValue, setCachedValue } from '@/utils/indexedDbCache';

export function useIndexedPreference<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const cached = await getCachedValue<T>(key);
      if (!cancelled && cached) {
        setValue(cached.value);
      }
      if (!cancelled) {
        setLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [key]);

  const update = useCallback(
    (nextValue: T) => {
      setValue(nextValue);
      void setCachedValue<T>(key, nextValue);
    },
    [key]
  );

  return [value, update, loaded];
}

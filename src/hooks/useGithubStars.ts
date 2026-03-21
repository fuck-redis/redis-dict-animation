/**
 * GitHub Star 数获取（带 1 小时缓存）
 */

import { useEffect, useState } from 'react';
import {
  GITHUB_REPO_OWNER,
  GITHUB_REPO_NAME,
} from '@/config/repository';
import { getCachedValue, setCachedValue } from '@/utils/indexedDbCache';

const CACHE_TTL_MS = 60 * 60 * 1000;

interface UseGithubStarsResult {
  stars: number;
  loading: boolean;
  updatedFrom: 'cache' | 'network' | 'default';
}

export function useGithubStars(): UseGithubStarsResult {
  const [stars, setStars] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatedFrom, setUpdatedFrom] = useState<'cache' | 'network' | 'default'>('default');

  useEffect(() => {
    let cancelled = false;
    const cacheKey = 'github-stars:' + GITHUB_REPO_OWNER + '/' + GITHUB_REPO_NAME;

    const loadStars = async () => {
      const cached = await getCachedValue<number>(cacheKey);
      const now = Date.now();

      if (cached && now - cached.updatedAt < CACHE_TTL_MS) {
        if (!cancelled) {
          setStars(cached.value);
          setUpdatedFrom('cache');
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(
          'https://api.github.com/repos/' + GITHUB_REPO_OWNER + '/' + GITHUB_REPO_NAME,
          {
            headers: {
              Accept: 'application/vnd.github+json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('GitHub API status ' + response.status);
        }

        const data = (await response.json()) as { stargazers_count?: number };
        const value = data.stargazers_count ?? 0;

        await setCachedValue<number>(cacheKey, value);

        if (!cancelled) {
          setStars(value);
          setUpdatedFrom('network');
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          if (cached) {
            setStars(cached.value);
            setUpdatedFrom('cache');
          } else {
            setStars(0);
            setUpdatedFrom('default');
          }
          setLoading(false);
        }
      }
    };

    void loadStars();

    return () => {
      cancelled = true;
    };
  }, []);

  return { stars, loading, updatedFrom };
}

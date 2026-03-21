/**
 * 教学页顶部栏
 */

import React from 'react';
import styles from './TeachingTopBar.module.css';

interface TeachingTopBarProps {
  backLabel: string;
  backUrl: string;
  title: string;
  repoUrl: string;
  stars: number;
  starsLoading?: boolean;
  onOpenIdea: () => void;
}

export const TeachingTopBar: React.FC<TeachingTopBarProps> = ({
  backLabel,
  backUrl,
  title,
  repoUrl,
  stars,
  starsLoading = false,
  onOpenIdea,
}) => {
  return (
    <div className={styles.container}>
      <a
        href={backUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.backLink}
      >
        ← {backLabel}
      </a>

      <h1 className={styles.title}>{title}</h1>

      <div className={styles.rightActions}>
        <button className={styles.ideaButton} onClick={onOpenIdea}>
          算法思路
        </button>

        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubLink}
          title="单击去 GitHub 仓库 Star 支持一下"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 0C5.373 0 0 5.373 0 12a12.01 12.01 0 0 0 8.207 11.387c.6.11.793-.261.793-.577v-2.234c-3.338.724-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.744.083-.728.083-.728 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.806 1.304 3.49.997.108-.775.42-1.304.763-1.604-2.665-.304-5.466-1.334-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.124-.302-.534-1.523.117-3.176 0 0 1.008-.322 3.3 1.23A11.51 11.51 0 0 1 12 5.8c1.02.004 2.046.138 3.004.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.768.84 1.234 1.91 1.234 3.22 0 4.607-2.803 5.624-5.475 5.922.43.37.82 1.1.82 2.22v3.293c0 .319.192.69.8.576A12.01 12.01 0 0 0 24 12c0-6.627-5.373-12-12-12Z" />
          </svg>
          <span className={styles.starText}>
            ★ {starsLoading ? '...' : stars.toLocaleString()}
          </span>
        </a>
      </div>
    </div>
  );
};

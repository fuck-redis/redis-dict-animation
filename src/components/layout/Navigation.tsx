/**
 * 导航栏组件
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Code, Zap, BarChart3, GraduationCap, PlayCircle, RefreshCw, LucideIcon } from 'lucide-react';
import { GITHUB_REPO_URL } from '@/config/repository';
import styles from './Navigation.module.css';

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    path: '/',
    label: '概念介绍',
    icon: BookOpen,
    description: 'Redis Dict基础概念',
  },
  {
    path: '/playground',
    label: '交互实践',
    icon: PlayCircle,
    description: '动手操作演示',
  },
  {
    path: '/hash-functions',
    label: '哈希函数',
    icon: Zap,
    description: '对比不同哈希函数',
  },
  {
    path: '/rehash',
    label: 'Rehash机制',
    icon: Code,
    description: '渐进式Rehash详解',
  },
  {
    path: '/performance',
    label: '性能分析',
    icon: BarChart3,
    description: '性能优化策略',
  },
  {
    path: '/iterator',
    label: '迭代器',
    icon: RefreshCw,
    description: '安全与不安全迭代器',
  },
  {
    path: '/tutorial',
    label: '互动教程',
    icon: GraduationCap,
    description: '分步学习指导',
  },
];

export const Navigation: React.FC = () => {
  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🔴</span>
          <div className={styles.logoText}>
            <h1>Redis Dict</h1>
            <p>可视化学习平台</p>
          </div>
        </div>
        
        <div className={styles.navLinks}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
                title={item.description}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
        
        <div className={styles.navActions}>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
            aria-label="GitHub"
            title="GitHub"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
};

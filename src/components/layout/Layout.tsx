/**
 * 页面布局组件
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import styles from './Layout.module.css';

export const Layout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Navigation />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>
            基于 <strong>TypeScript + React + D3.js</strong> 构建 | 
            开源项目 | 
            <a
              href="https://redis.io/docs/data-types/hashes/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Redis官方文档
            </a>
          </p>
          <p className={styles.copyright}>
            © 2024 Redis Dict 可视化学习平台 | 用于教育目的
          </p>
        </div>
      </footer>
    </div>
  );
};

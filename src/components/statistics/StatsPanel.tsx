/**
 * 统计信息面板
 */

import React from 'react';
import { DictStats } from '@/types/dict';
import { BarChart, Activity, Hash, TrendingUp, HardDrive } from 'lucide-react';
import styles from './StatsPanel.module.css';

interface StatsPanelProps {
  stats: DictStats;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  const statItems = [
    {
      icon: Activity,
      label: '总操作次数',
      value: stats.totalOperations.toLocaleString(),
      color: '#2196f3',
    },
    {
      icon: Hash,
      label: '哈希冲突',
      value: stats.hashCollisions.toLocaleString(),
      color: '#ff9800',
    },
    {
      icon: BarChart,
      label: 'Rehash操作',
      value: stats.rehashOperations.toLocaleString(),
      color: '#9c27b0',
    },
    {
      icon: TrendingUp,
      label: '平均查找长度',
      value: stats.averageProbeLength.toFixed(2),
      color: '#4caf50',
    },
    {
      icon: HardDrive,
      label: '内存使用',
      value: formatBytes(stats.memoryUsage),
      color: '#f44336',
    },
  ];
  
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>统计信息</h3>
      
      <div className={styles.stats}>
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className={styles.statItem}>
              <div
                className={styles.iconWrapper}
                style={{ backgroundColor: `${item.color}20` }}
              >
                <Icon size={20} color={item.color} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>{item.label}</div>
                <div className={styles.statValue} style={{ color: item.color }}>
                  {item.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {stats.maxChainLength > 3 && (
        <div className={styles.warning}>
          <span className={styles.warningIcon}>⚠️</span>
          <div>
            <div className={styles.warningTitle}>性能警告</div>
            <div className={styles.warningText}>
              最长冲突链达到 {stats.maxChainLength} 个节点，建议考虑Rehash
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

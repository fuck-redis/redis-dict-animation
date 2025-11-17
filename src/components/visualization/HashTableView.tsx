/**
 * 哈希表可视化组件
 */

import React, { useMemo } from 'react';
import { DictHashTable, DictEntry } from '@/types/dict';
import styles from './HashTableView.module.css';

interface HashTableViewProps {
  hashTable: DictHashTable;
  tableIndex: 0 | 1;
  title: string;
  onBucketClick?: (bucketIndex: number) => void;
  onEntryClick?: (entry: DictEntry) => void;
}

export const HashTableView: React.FC<HashTableViewProps> = ({
  hashTable,
  tableIndex,
  title,
  onBucketClick,
  onEntryClick,
}) => {
  // 计算每个桶的状态
  const bucketStats = useMemo(() => {
    return hashTable.table.map((entry, index) => {
      let chainLength = 0;
      let currentEntry = entry;
      
      while (currentEntry !== null) {
        chainLength++;
        currentEntry = currentEntry.next;
      }
      
      return {
        index,
        chainLength,
        isEmpty: chainLength === 0,
        hasConflict: chainLength > 1,
      };
    });
  }, [hashTable]);
  
  // 获取桶的颜色类
  const getBucketColorClass = (chainLength: number): string => {
    if (chainLength === 0) return styles.bucketEmpty;
    if (chainLength === 1) return styles.bucketSingle;
    if (chainLength === 2) return styles.bucketConflict2;
    if (chainLength === 3) return styles.bucketConflict3;
    return styles.bucketConflictHigh;
  };
  
  // 渲染单个节点
  const renderEntry = (entry: DictEntry, isFirst: boolean) => {
    const classes = [styles.entry];
    if (entry.isNew) classes.push(styles.entryNew);
    if (entry.isRehashing) classes.push(styles.entryRehashing);
    if (entry.isHighlighted) classes.push(styles.entryHighlighted);
    
    return (
      <div
        key={entry.key}
        className={classes.join(' ')}
        onClick={() => onEntryClick?.(entry)}
        title={`键: ${entry.key}\n值: ${entry.value}\n哈希: ${entry.hash}`}
      >
        <span className={styles.entryKey}>{entry.key}</span>
        <span className={styles.entrySeparator}>→</span>
        <span className={styles.entryValue}>{entry.value}</span>
        {entry.next && <span className={styles.chainArrow}> → </span>}
      </div>
    );
  };
  
  // 渲染冲突链
  const renderChain = (entry: DictEntry | null) => {
    if (!entry) {
      return <span className={styles.nullEntry}>null</span>;
    }
    
    const entries: JSX.Element[] = [];
    let currentEntry: DictEntry | null = entry;
    let isFirst = true;
    
    while (currentEntry !== null) {
      entries.push(renderEntry(currentEntry, isFirst));
      currentEntry = currentEntry.next;
      isFirst = false;
    }
    
    return <div className={styles.chain}>{entries}</div>;
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.stats}>
          <span>大小: {hashTable.size}</span>
          <span>使用: {hashTable.used}</span>
          <span>
            负载因子:{' '}
            <span
              className={
                hashTable.loadFactor > 0.75
                  ? styles.loadFactorHigh
                  : hashTable.loadFactor > 0.5
                  ? styles.loadFactorMedium
                  : styles.loadFactorLow
              }
            >
              {(hashTable.loadFactor * 100).toFixed(1)}%
            </span>
          </span>
        </div>
      </div>
      
      <div className={styles.table}>
        {bucketStats.map(({ index, chainLength }) => (
          <div
            key={index}
            className={`${styles.bucket} ${getBucketColorClass(chainLength)}`}
            onClick={() => onBucketClick?.(index)}
          >
            <div className={styles.bucketIndex}>{index}</div>
            <div className={styles.bucketContent}>
              {renderChain(hashTable.table[index])}
            </div>
            {chainLength > 1 && (
              <div className={styles.chainLengthBadge}>{chainLength}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

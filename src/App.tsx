/**
 * 主应用组件
 */

import React, { useState } from 'react';
import { useDict } from './hooks/useDict';
import { HashTableView } from './components/visualization/HashTableView';
import { OperationPanel } from './components/controls/OperationPanel';
import { StatsPanel } from './components/statistics/StatsPanel';
import { isRehashing } from './core/dict';
import styles from './App.module.css';

function App() {
  const { dict, executeOperation, reset, rehashConfig, updateRehashConfig } = useDict(8, 'siphash');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  
  const handleOperation = (operation: string, params: any) => {
    const result = executeOperation(operation as any, params);
    
    setMessage(result.message);
    setMessageType(result.success ? 'success' : 'error');
    
    // 3秒后清除消息
    setTimeout(() => setMessage(''), 3000);
  };
  
  const handleReset = () => {
    if (confirm('确定要重置字典吗？')) {
      reset();
      setMessage('字典已重置');
      setMessageType('info');
      setTimeout(() => setMessage(''), 3000);
    }
  };
  
  const handleQuickTest = () => {
    // 快速测试：插入一些示例数据
    const testKeys = ['user:1', 'user:2', 'session:abc', 'cache:data', 'key:test'];
    const testValues = ['Alice', 'Bob', 'token123', 'value', 'demo'];
    
    testKeys.forEach((key, index) => {
      setTimeout(() => {
        executeOperation('set', { key, value: testValues[index] });
      }, index * 500);
    });
    
    setMessage('正在插入测试数据...');
    setMessageType('info');
  };
  
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>
            <span className={styles.logoIcon}>🔴</span>
            Redis Dict 可视化演示
          </h1>
          <p className={styles.subtitle}>
            深入理解Redis字典数据结构 - 哈希表 | 渐进式Rehash | 冲突解决
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.actionBtn} onClick={handleQuickTest}>
            快速测试
          </button>
          <button className={styles.actionBtn} onClick={handleReset}>
            重置
          </button>
        </div>
      </header>
      
      {message && (
        <div className={`${styles.message} ${styles[messageType]}`}>
          {message}
        </div>
      )}
      
      <div className={styles.mainContent}>
        <div className={styles.visualizationArea}>
          <div className={styles.tablesContainer}>
            <div className={styles.tableWrapper}>
              <HashTableView
                hashTable={dict.ht[0]}
                tableIndex={0}
                title={`哈希表 0 ${!isRehashing(dict) ? '(主表)' : '(正在迁移)'}`}
              />
            </div>
            
            {isRehashing(dict) && dict.ht[1].size > 0 && (
              <div className={styles.tableWrapper}>
                <HashTableView
                  hashTable={dict.ht[1]}
                  tableIndex={1}
                  title="哈希表 1 (目标表)"
                />
                <div className={styles.rehashProgress}>
                  <div className={styles.progressLabel}>
                    Rehash进度: {dict.rehashidx} / {dict.ht[0].size}
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${(dict.rehashidx / dict.ht[0].size) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className={styles.statsContainer}>
            <StatsPanel stats={dict.stats} />
          </div>
        </div>
        
        <div className={styles.controlArea}>
          <OperationPanel onExecute={handleOperation} />
          
          <div className={styles.configSection}>
            <h3 className={styles.configTitle}>Rehash配置</h3>
            <div className={styles.configItem}>
              <label>
                <input
                  type="checkbox"
                  checked={rehashConfig.autoRehash}
                  onChange={(e) =>
                    updateRehashConfig({ autoRehash: e.target.checked })
                  }
                />
                <span>自动Rehash</span>
              </label>
            </div>
            <div className={styles.configItem}>
              <label>
                负载因子阈值:
                <input
                  type="number"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={rehashConfig.loadFactorThreshold}
                  onChange={(e) =>
                    updateRehashConfig({
                      loadFactorThreshold: parseFloat(e.target.value),
                    })
                  }
                />
              </label>
            </div>
            <div className={styles.configItem}>
              <label>
                Rehash批量大小:
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={rehashConfig.rehashBatchSize}
                  onChange={(e) =>
                    updateRehashConfig({
                      rehashBatchSize: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <footer className={styles.footer}>
        <p>
          基于 <strong>TypeScript + React + D3.js</strong> 构建 | 
          开源项目 | 
          <a
            href="https://github.com/redis/redis"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redis源码
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;

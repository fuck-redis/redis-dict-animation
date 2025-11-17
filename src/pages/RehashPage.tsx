/**
 * Rehash机制详解页面
 */

import React, { useState } from 'react';
import { Code, Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { useDict } from '@/hooks/useDict';
import { HashTableView } from '@/components/visualization/HashTableView';
import { isRehashing } from '@/core/dict';
import styles from './RehashPage.module.css';

export const RehashPage: React.FC = () => {
  const { dict, executeOperation, reset } = useDict(4, 'siphash');
  const [autoPlay, setAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(1000);
  
  // 自动播放Rehash
  React.useEffect(() => {
    if (!autoPlay || !isRehashing(dict)) return;
    
    const timer = setInterval(() => {
      if (isRehashing(dict)) {
        executeOperation('rehashStep', { rehashSteps: 1 });
      } else {
        setAutoPlay(false);
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [autoPlay, speed, dict, executeOperation]);
  
  const handleSetupDemo = () => {
    reset(4, 'siphash');
    // 插入足够的数据触发rehash
    const keys = ['k1', 'k2', 'k3', 'k4', 'k5', 'k6'];
    keys.forEach((key, i) => {
      setTimeout(() => {
        executeOperation('set', { key, value: `v${i + 1}` });
      }, i * 200);
    });
  };
  
  const handleStartRehash = () => {
    executeOperation('startRehash', { targetSize: 16 });
  };
  
  const handleStep = () => {
    executeOperation('rehashStep', { rehashSteps: 1 });
  };
  
  const getRehashProgress = () => {
    if (!isRehashing(dict)) return 0;
    return (dict.rehashidx / dict.ht[0].size) * 100;
  };
  
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <Code className={styles.heroIcon} size={48} />
        <h1 className={styles.title}>渐进式 Rehash 机制</h1>
        <p className={styles.subtitle}>
          理解Redis如何在不阻塞服务的情况下完成哈希表扩容
        </p>
      </div>

      <div className={styles.content}>
        {/* 概念介绍 */}
        <section className={styles.section}>
          <h2>为什么需要渐进式Rehash？</h2>
          <div className={styles.conceptGrid}>
            <div className={styles.conceptCard}>
              <div className={styles.conceptIcon}>⚠️</div>
              <h3>传统Rehash的问题</h3>
              <p>
                一次性将所有数据迁移到新哈希表会导致长时间阻塞，
                对于拥有百万级键的Redis实例，这是不可接受的。
              </p>
            </div>
            <div className={styles.conceptCard}>
              <div className={styles.conceptIcon}>✨</div>
              <h3>渐进式方案</h3>
              <p>
                将迁移工作分散到多次操作中，每次只迁移一小部分数据，
                保证服务始终可用，用户感知不到rehash过程。
              </p>
            </div>
            <div className={styles.conceptCard}>
              <div className={styles.conceptIcon}>🔄</div>
              <h3>双表协同</h3>
              <p>
                使用两个哈希表ht[0]和ht[1]，在rehash期间同时工作，
                新增操作在ht[1]，查询需要检查两个表。
              </p>
            </div>
          </div>
        </section>

        {/* 交互演示 */}
        <section className={styles.section}>
          <h2>交互式演示</h2>
          
          <div className={styles.controls}>
            <button onClick={handleSetupDemo} className={styles.btn}>
              <RotateCcw size={16} />
              准备演示数据
            </button>
            <button 
              onClick={handleStartRehash} 
              className={styles.btn}
              disabled={isRehashing(dict)}
            >
              <Play size={16} />
              开始Rehash
            </button>
            <button 
              onClick={handleStep} 
              className={styles.btn}
              disabled={!isRehashing(dict)}
            >
              <SkipForward size={16} />
              单步执行
            </button>
            <button 
              onClick={() => setAutoPlay(!autoPlay)} 
              className={styles.btn}
              disabled={!isRehashing(dict)}
            >
              {autoPlay ? <Pause size={16} /> : <Play size={16} />}
              {autoPlay ? '暂停' : '自动播放'}
            </button>
          </div>
          
          {isRehashing(dict) && (
            <div className={styles.progressSection}>
              <div className={styles.progressHeader}>
                <span>Rehash进度: {dict.rehashidx} / {dict.ht[0].size}</span>
                <span>{getRehashProgress().toFixed(1)}%</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${getRehashProgress()}%` }}
                />
              </div>
              <div className={styles.speedControl}>
                <label>播放速度:</label>
                <input 
                  type="range" 
                  min="100" 
                  max="2000" 
                  step="100"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                />
                <span>{(2000 - speed + 100) / 100}x</span>
              </div>
            </div>
          )}
          
          <div className={styles.visualization}>
            <div className={styles.tableContainer}>
              <HashTableView
                hashTable={dict.ht[0]}
                tableIndex={0}
                title={`哈希表 0 ${!isRehashing(dict) ? '(主表)' : '(源表 - 正在迁移)'}`}
              />
            </div>
            {isRehashing(dict) && dict.ht[1].size > 0 && (
              <div className={styles.tableContainer}>
                <HashTableView
                  hashTable={dict.ht[1]}
                  tableIndex={1}
                  title="哈希表 1 (目标表 - 接收数据)"
                />
              </div>
            )}
          </div>
        </section>

        {/* 工作流程 */}
        <section className={styles.section}>
          <h2>Rehash工作流程</h2>
          <div className={styles.workflow}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3>触发条件判断</h3>
                <p>当负载因子 (used/size) 超过阈值时触发rehash</p>
                <code>if (loadFactor {'>'} 1.0) startRehash()</code>
              </div>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3>创建新哈希表</h3>
                <p>分配ht[1]，大小通常为ht[0]的2倍（最近的2的幂次）</p>
                <code>ht[1].size = nextPower(ht[0].used * 2)</code>
              </div>
            </div>
            
            <div className={styles.step}>
              <div className="{ styles.stepNumber}">3</div>
              <div className={styles.stepContent}>
                <h3>渐进式迁移</h3>
                <p>每次操作时迁移一个桶，将rehashidx指向的桶迁移到ht[1]</p>
                <code>rehashStep() // 每次操作时执行</code>
              </div>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <h3>完成并切换</h3>
                <p>所有数据迁移完成后，释放ht[0]，将ht[1]设为ht[0]</p>
                <code>ht[0] = ht[1]; ht[1] = empty; rehashidx = -1</code>
              </div>
            </div>
          </div>
        </section>

        {/* 关键特性 */}
        <section className={styles.section}>
          <h2>Rehash期间的操作策略</h2>
          <div className={styles.strategies}>
            <div className={styles.strategyCard}>
              <h3>🔍 查询操作 (GET)</h3>
              <p><strong>策略:</strong> 先查ht[0]，未找到再查ht[1]</p>
              <div className={styles.code}>
                <pre>{`entry = dictFind(ht[0], key);
if (!entry && isRehashing()) {
    entry = dictFind(ht[1], key);
}
return entry;`}</pre>
              </div>
            </div>
            
            <div className={styles.strategyCard}>
              <h3>➕ 插入操作 (SET)</h3>
              <p><strong>策略:</strong> 新键直接插入ht[1]，避免再次迁移</p>
              <div className={styles.code}>
                <pre>{`if (isRehashing()) {
    dictAdd(ht[1], key, value);
} else {
    dictAdd(ht[0], key, value);
}`}</pre>
              </div>
            </div>
            
            <div className={styles.strategyCard}>
              <h3>❌ 删除操作 (DEL)</h3>
              <p><strong>策略:</strong> 需要在两个表中都尝试删除</p>
              <div className={styles.code}>
                <pre>{`deleted = dictDelete(ht[0], key);
if (!deleted && isRehashing()) {
    deleted = dictDelete(ht[1], key);
}
return deleted;`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* 性能影响 */}
        <section className={styles.section}>
          <h2>性能影响分析</h2>
          <div className={styles.performanceGrid}>
            <div className={styles.perfCard}>
              <div className={styles.perfIcon}>⚡</div>
              <h3>时间开销</h3>
              <p>每次操作额外增加O(1)的迁移成本，摊销后仍为O(1)</p>
            </div>
            <div className={styles.perfCard}>
              <div className={styles.perfIcon}>💾</div>
              <h3>空间开销</h3>
              <p>Rehash期间需要两个哈希表，内存使用临时增加约2倍</p>
            </div>
            <div className={styles.perfCard}>
              <div className={styles.perfIcon}>📈</div>
              <h3>用户体验</h3>
              <p>无阻塞操作，用户感知不到rehash，服务持续可用</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

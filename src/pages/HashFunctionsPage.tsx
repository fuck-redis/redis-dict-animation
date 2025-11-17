/**
 * 哈希函数对比页面
 */

import React, { useState, useMemo } from 'react';
import { Zap, TrendingUp, Shield, Clock } from 'lucide-react';
import { HASH_FUNCTIONS, calculateIndexWithSteps } from '@/core/hashFunctions';
import styles from './HashFunctionsPage.module.css';

export const HashFunctionsPage: React.FC = () => {
  const [testKey, setTestKey] = useState('user:12345');
  const [tableSize, setTableSize] = useState(16);
  const [testKeys, setTestKeys] = useState<string[]>([]);
  
  // 生成测试键
  const generateTestKeys = (count: number) => {
    const keys: string[] = [];
    for (let i = 0; i < count; i++) {
      keys.push(`key:${i}`);
    }
    setTestKeys(keys);
  };
  
  // 计算所有哈希函数的结果
  const hashResults = useMemo(() => {
    return HASH_FUNCTIONS.map(hashFunc => {
      const result = calculateIndexWithSteps(testKey, hashFunc.id, tableSize);
      return {
        ...hashFunc,
        result,
      };
    });
  }, [testKey, tableSize]);
  
  // 分析哈希分布
  const distributionAnalysis = useMemo(() => {
    if (testKeys.length === 0) return null;
    
    return HASH_FUNCTIONS.map(hashFunc => {
      const buckets = new Array(tableSize).fill(0);
      let collisions = 0;
      
      testKeys.forEach(key => {
        const result = calculateIndexWithSteps(key, hashFunc.id, tableSize);
        buckets[result.index]++;
        if (buckets[result.index] > 1) {
          collisions++;
        }
      });
      
      const maxBucket = Math.max(...buckets);
      const avgBucket = testKeys.length / tableSize;
      const variance = buckets.reduce((sum, count) => sum + Math.pow(count - avgBucket, 2), 0) / tableSize;
      const stdDev = Math.sqrt(variance);
      
      return {
        id: hashFunc.id,
        name: hashFunc.name,
        buckets,
        collisions,
        collisionRate: (collisions / testKeys.length * 100).toFixed(1),
        maxBucket,
        avgBucket: avgBucket.toFixed(2),
        stdDev: stdDev.toFixed(2),
        uniformity: (100 - (stdDev / avgBucket * 100)).toFixed(1),
      };
    });
  }, [testKeys, tableSize]);
  
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <Zap className={styles.heroIcon} size={48} />
        <h1 className={styles.title}>哈希函数对比实验室</h1>
        <p className={styles.subtitle}>
          深入理解不同哈希函数的性能特征和分布特性
        </p>
      </div>

      <div className={styles.content}>
        {/* 单键测试 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Zap size={24} />
            单键哈希测试
          </h2>
          <div className={styles.testPanel}>
            <div className={styles.inputGroup}>
              <label>测试键:</label>
              <input
                type="text"
                value={testKey}
                onChange={(e) => setTestKey(e.target.value)}
                placeholder="输入要测试的键"
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>哈希表大小:</label>
              <select
                value={tableSize}
                onChange={(e) => setTableSize(parseInt(e.target.value))}
                className={styles.select}
              >
                <option value="8">8</option>
                <option value="16">16</option>
                <option value="32">32</option>
                <option value="64">64</option>
              </select>
            </div>
          </div>
          
          <div className={styles.results}>
            {hashResults.map((item) => (
              <div key={item.id} className={styles.resultCard}>
                <div className={styles.resultHeader}>
                  <h3>{item.name}</h3>
                  <span className={styles.complexity}>{item.complexity}</span>
                </div>
                <p className={styles.description}>{item.description}</p>
                
                <div className={styles.hashSteps}>
                  <div className={styles.hashValue}>
                    <strong>哈希值:</strong>
                    <code>{item.result.hexHash}</code>
                  </div>
                  <div className={styles.indexValue}>
                    <strong>桶索引:</strong>
                    <code className={styles.indexBadge}>{item.result.index}</code>
                  </div>
                </div>
                
                <div className={styles.calculation}>
                  <strong>计算过程:</strong>
                  <code className={styles.formula}>
                    {item.result.hash} & {item.result.sizemask} = {item.result.index}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 分布测试 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <TrendingUp size={24} />
            分布均匀性测试
          </h2>
          <div className={styles.testPanel}>
            <div className={styles.inputGroup}>
              <label>生成测试键数量:</label>
              <div className={styles.buttonGroup}>
                <button onClick={() => generateTestKeys(50)} className={styles.btn}>
                  50个键
                </button>
                <button onClick={() => generateTestKeys(100)} className={styles.btn}>
                  100个键
                </button>
                <button onClick={() => generateTestKeys(200)} className={styles.btn}>
                  200个键
                </button>
              </div>
            </div>
          </div>
          
          {distributionAnalysis && (
            <div className={styles.analysisResults}>
              {distributionAnalysis.map((analysis) => (
                <div key={analysis.id} className={styles.analysisCard}>
                  <h3>{analysis.name}</h3>
                  
                  <div className={styles.metrics}>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>冲突率</span>
                      <span className={styles.metricValue}>{analysis.collisionRate}%</span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>均匀性</span>
                      <span className={styles.metricValue}>{analysis.uniformity}%</span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>最大桶</span>
                      <span className={styles.metricValue}>{analysis.maxBucket}</span>
                    </div>
                  </div>
                  
                  <div className={styles.distribution}>
                    {analysis.buckets.map((count, index) => (
                      <div key={index} className={styles.bucket}>
                        <div
                          className={styles.bucketBar}
                          style={{
                            height: `${(count / analysis.maxBucket) * 100}%`,
                            background: count === 0 ? '#e0e0e0' : 
                                       count === analysis.maxBucket ? '#f44336' :
                                       count > parseFloat(analysis.avgBucket) ? '#ff9800' : '#4caf50'
                          }}
                          title={`桶${index}: ${count}个键`}
                        />
                        <span className={styles.bucketLabel}>{index}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 特性对比 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Shield size={24} />
            特性对比矩阵
          </h2>
          <div className={styles.comparison}>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th>哈希函数</th>
                  <th><Clock size={16} /> 计算速度</th>
                  <th><TrendingUp size={16} /> 分布质量</th>
                  <th><Shield size={16} /> 安全性</th>
                  <th>推荐场景</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>SipHash</strong></td>
                  <td className={styles.ratingGood}>★★★☆☆</td>
                  <td className={styles.ratingExcellent}>★★★★★</td>
                  <td className={styles.ratingExcellent}>★★★★★</td>
                  <td>Redis生产环境</td>
                </tr>
                <tr>
                  <td><strong>DJB2</strong></td>
                  <td className={styles.ratingExcellent}>★★★★★</td>
                  <td className={styles.ratingGood}>★★★☆☆</td>
                  <td className={styles.ratingPoor}>★☆☆☆☆</td>
                  <td>内部使用、非安全场景</td>
                </tr>
                <tr>
                  <td><strong>FNV-1a</strong></td>
                  <td className={styles.ratingExcellent}>★★★★★</td>
                  <td className={styles.ratingGood}>★★★★☆</td>
                  <td className={styles.ratingPoor}>★★☆☆☆</td>
                  <td>通用哈希表</td>
                </tr>
                <tr>
                  <td><strong>MurmurHash3</strong></td>
                  <td className={styles.ratingGood}>★★★★☆</td>
                  <td className={styles.ratingExcellent}>★★★★★</td>
                  <td className={styles.ratingGood}>★★★☆☆</td>
                  <td>布隆过滤器、缓存</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 哈希洪水攻击 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Shield size={24} />
            哈希洪水攻击防御
          </h2>
          <div className={styles.attackDemo}>
            <div className={styles.infoBox}>
              <h3>什么是哈希洪水攻击？</h3>
              <p>
                攻击者构造大量具有相同哈希值的键，使它们全部映射到同一个桶，
                导致哈希表退化为链表，查找时间从O(1)退化到O(N)。
              </p>
            </div>
            
            <div className={styles.defenseBox}>
              <h3>Redis的防御策略</h3>
              <ul>
                <li>
                  <strong>SipHash算法:</strong> 使用密钥的哈希函数，攻击者无法预测哈希值
                </li>
                <li>
                  <strong>随机种子:</strong> Redis启动时生成随机种子，每个实例的哈希结果不同
                </li>
                <li>
                  <strong>渐进式Rehash:</strong> 即使发生攻击，也能通过rehash恢复性能
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

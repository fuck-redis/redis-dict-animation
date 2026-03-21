/**
 * 哈希函数对比页面
 * 深入解析Redis如何使用哈希函数实现高效的数据存储
 */

import React, { useState, useMemo } from 'react';
import { Zap, TrendingUp, Shield, Clock, AlertTriangle, CheckCircle, Hash } from 'lucide-react';
import { HASH_FUNCTIONS, calculateIndexWithSteps } from '@/core/hashFunctions';
import { HashFunctionVideos } from '@/components/video';
import { InlineVideo } from '@/components/video/InlineVideo';
import { HashFunctionOverview, CollisionDemo, HashFloodingAttack, HashCalculationSteps, DistributionUniformityDemo, HashFunctionComparison, SipHashDefenseMechanism, HashSeedGeneration } from '@/remotion/compositions/hash-functions';
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
        <Hash className={styles.heroIcon} size={48} />
        <h1 className={styles.title}>哈希函数对比实验室</h1>
        <p className={styles.subtitle}>
          深入理解不同哈希函数的性能特征和分布特性
        </p>
      </div>

      {/* 视频演示区域 - 整体概述 */}
      <HashFunctionVideos />

      <div className={styles.content}>
        {/* 哈希函数基础 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Zap size={24} />
            什么是哈希函数？
          </h2>

          <div className={styles.infoBox}>
            <p>
              哈希函数是将任意长度的输入（如字符串键）转换为固定长度输出的函数。
              在Redis中，哈希函数扮演着至关重要的角色：<strong>它决定了一个键应该存放在哪个桶（bucket）中</strong>。
            </p>
          </div>

          {/* 哈希函数工作原理演示 */}
          <div className={styles.videoInline}>
            <InlineVideo
              component={HashFunctionOverview}
              durationInFrames={1200}
              width={640}
              height={360}
              title="哈希函数工作原理"
              loop={true}
            />
          </div>

          <div className={styles.keyPoints}>
            <div className={styles.keyPoint}>
              <CheckCircle size={18} className={styles.checkIcon} />
              <span><strong>确定性</strong>：相同输入总是产生相同输出</span>
            </div>
            <div className={styles.keyPoint}>
              <CheckCircle size={18} className={styles.checkIcon} />
              <span><strong>均匀分布</strong>：好的哈希函数将键均匀分布到所有桶</span>
            </div>
            <div className={styles.keyPoint}>
              <CheckCircle size={18} className={styles.checkIcon} />
              <span><strong>高性能</strong>：计算速度快，延迟低</span>
            </div>
          </div>
        </section>
        {/* 单键测试 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Zap size={24} />
            单键哈希测试
          </h2>

          <div className={styles.infoBox}>
            <p>
              让我们通过一个具体例子来理解哈希函数的计算过程。
              输入一个键，观察不同哈希函数如何将其转换为桶索引。
            </p>
          </div>

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

          {/* 哈希计算步骤演示 */}
          <div className={styles.videoInline}>
            <InlineVideo
              component={HashCalculationSteps}
              durationInFrames={1500}
              width={640}
              height={360}
              title="哈希计算步骤演示"
              loop={true}
            />
          </div>

          {/* 哈希冲突演示 */}
          <div className={styles.videoSection}>
            <h3 className={styles.videoSectionTitle}>
              <AlertTriangle size={18} />
              理解哈希冲突
            </h3>
            <p className={styles.videoSectionDesc}>
              当两个不同的键计算出相同的桶索引时，就会发生哈希冲突。
              观察下方演示了解Redis如何处理这种情况：
            </p>
            <div className={styles.videoInline}>
              <InlineVideo
                component={CollisionDemo}
                durationInFrames={1650}
                width={640}
                height={360}
                title="哈希冲突演示"
                loop={true}
              />
            </div>
          </div>
        </section>

        {/* 分布测试 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <TrendingUp size={24} />
            分布均匀性测试
          </h2>

          <div className={styles.infoBox}>
            <p>
              哈希函数的核心目标是将键<strong>均匀分布</strong>到所有桶中。
              如果分布不均匀，会导致某些桶过长，查找性能退化。
              下方测试用大量随机键评估各哈希函数的分布质量。
            </p>
          </div>

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

          <div className={styles.interpretation}>
            <h4>如何解读图表:</h4>
            <ul>
              <li><span className={styles.colorGreen}>绿色</span> - 桶内键数量正常（接近平均值）</li>
              <li><span className={styles.colorOrange}>橙色</span> - 桶内键数量偏多（高于平均值）</li>
              <li><span className={styles.colorRed}>红色</span> - 桶内键数量过多（最大值，表示严重不均匀）</li>
              <li><span className={styles.colorGray}>灰色</span> - 空桶（没有键分布到此处）</li>
            </ul>
          </div>

          {/* 分布均匀性演示 */}
          <div className={styles.videoInline}>
            <InlineVideo
              component={DistributionUniformityDemo}
              durationInFrames={1500}
              width={640}
              height={360}
              title="分布均匀性演示"
              loop={true}
            />
          </div>
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

          {/* 哈希函数对比演示 */}
          <div className={styles.videoInline}>
            <InlineVideo
              component={HashFunctionComparison}
              durationInFrames={1500}
              width={640}
              height={360}
              title="哈希函数对比演示"
              loop={true}
            />
          </div>
        </section>

        {/* 哈希洪水攻击 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Shield size={24} />
            哈希洪水攻击防御
          </h2>

          <div className={styles.attackDemo}>
            <div className={styles.attackBox}>
              <h3>什么是哈希洪水攻击？</h3>
              <p>
                攻击者构造大量具有相同哈希值的键，使它们全部映射到同一个桶，
                导致哈希表退化为链表，查找时间从<strong>O(1)退化到O(N)</strong>。
                这是一种针对哈希表结构的DoS（拒绝服务）攻击手段。
              </p>
            </div>

            {/* 攻击演示视频 */}
            <div className={styles.videoInline}>
              <InlineVideo
                component={HashFloodingAttack}
                durationInFrames={1500}
                width={640}
                height={360}
                title="哈希洪水攻击演示"
                loop={true}
              />
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

            {/* SipHash防御机制演示 */}
            <div className={styles.videoInline}>
              <InlineVideo
                component={SipHashDefenseMechanism}
                durationInFrames={1500}
                width={640}
                height={360}
                title="SipHash防御机制演示"
                loop={true}
              />
            </div>

            {/* 哈希种子生成演示 */}
            <div className={styles.videoInline}>
              <InlineVideo
                component={HashSeedGeneration}
                durationInFrames={1500}
                width={640}
                height={360}
                title="哈希种子生成演示"
                loop={true}
              />
            </div>

            <div className={styles.securityNote}>
              <Shield size={16} />
              <span>
                <strong>安全提示:</strong> Redis默认使用SipHash作为哈希函数，
                这也是为什么Redis能够安全地承受恶意输入。在选择哈希函数时，
                如果用于安全敏感场景，务必使用抗碰撞的加密哈希函数。
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

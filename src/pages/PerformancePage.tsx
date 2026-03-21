/**
 * 性能分析页面
 * 深入分析Redis Dict的性能特征，展示负载因子与查询效率的关系
 */

import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2, Zap, Shield, Database, Target } from 'lucide-react';
import { useDict } from '@/hooks/useDict';
import { InlineVideo } from '@/components/video';
import { LoadFactorImpact, OptimizationTips, BenchmarkDemo, ScenarioComparison, PerformanceMetricsCards, LoadFactorThresholds, BenchmarkRunAnimation, ScenarioComparisonBars } from '@/remotion/compositions/performance';
import styles from './PerformancePage.module.css';

interface PerformanceResult {
  operations: number;
  insertTime: number;
  lookupTime: number;
  deleteTime: number;
}

export const PerformancePage: React.FC = () => {
  const { dict, executeOperation } = useDict(8, 'siphash');
  const [testResults, setTestResults] = useState<PerformanceResult[]>([]);
  
  // 运行性能测试
  const runPerformanceTest = (operationCount: number) => {
    const results = {
      operations: operationCount,
      insertTime: 0,
      lookupTime: 0,
      deleteTime: 0,
    };
    
    // 插入测试
    const insertStart = performance.now();
    for (let i = 0; i < operationCount; i++) {
      executeOperation('set', { key: `perf:${i}`, value: `val${i}` });
    }
    results.insertTime = performance.now() - insertStart;
    
    // 查询测试
    const lookupStart = performance.now();
    for (let i = 0; i < operationCount; i++) {
      executeOperation('get', { key: `perf:${i}` });
    }
    results.lookupTime = performance.now() - lookupStart;
    
    // 删除测试
    const deleteStart = performance.now();
    for (let i = 0; i < operationCount; i++) {
      executeOperation('delete', { key: `perf:${i}` });
    }
    results.deleteTime = performance.now() - deleteStart;
    
    setTestResults([...testResults, results]);
  };
  
  const loadFactorStatus = useMemo(() => {
    const lf = dict.ht[0].loadFactor;
    if (lf < 0.5) return { level: 'low', color: '#4caf50', icon: CheckCircle2, msg: '负载较低，性能良好' };
    if (lf < 0.75) return { level: 'normal', color: '#2196f3', icon: CheckCircle2, msg: '负载正常，建议继续监控' };
    if (lf < 1.0) return { level: 'high', color: '#ff9800', icon: AlertTriangle, msg: '负载较高，考虑rehash' };
    return { level: 'critical', color: '#f44336', icon: AlertTriangle, msg: '负载过高，强烈建议rehash' };
  }, [dict.ht[0].loadFactor]);
  
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <BarChart3 className={styles.heroIcon} size={48} />
        <h1 className={styles.title}>性能分析与优化</h1>
        <p className={styles.subtitle}>
          深入分析Redis Dict的性能特征，掌握优化策略
        </p>
      </div>

      <div className={styles.content}>
        {/* 性能概述 */}
        <section className={styles.section}>
          <h2>
            <BarChart3 size={24} />
            性能关键指标
          </h2>
          <p className={styles.intro}>
            Redis Dict 的性能主要取决于<strong>负载因子（Load Factor）</strong>——
            已使用槽位数与总槽位数的比率。这个比率直接决定了哈希冲突的概率，
            进而影响每次查找需要遍历的链表长度。
          </p>
          <div className={styles.statusGrid}>
            <div className={styles.statusCard}>
              <div className={styles.statusLabel}>哈希表大小</div>
              <div className={styles.statusValue}>{dict.ht[0].size}</div>
            </div>
            <div className={styles.statusCard}>
              <div className={styles.statusLabel}>已使用槽位</div>
              <div className={styles.statusValue}>{dict.ht[0].used}</div>
            </div>
            <div className={styles.statusCard}>
              <div className={styles.statusLabel}>负载因子</div>
              <div className={styles.statusValue} style={{ color: loadFactorStatus.color }}>
                {(dict.ht[0].loadFactor * 100).toFixed(1)}%
              </div>
            </div>
            <div className={styles.statusCard}>
              <div className={styles.statusLabel}>最长冲突链</div>
              <div className={styles.statusValue}>{dict.stats.maxChainLength}</div>
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <InlineVideo
              component={PerformanceMetricsCards}
              durationInFrames={1200}
              width={640}
              height={360}
              title="性能指标详解"
              loop={true}
            />
          </div>

          <div className={styles.alert} style={{ borderColor: loadFactorStatus.color }}>
            <loadFactorStatus.icon size={24} color={loadFactorStatus.color} />
            <div>
              <strong>状态评估:</strong> {loadFactorStatus.msg}
            </div>
          </div>
        </section>

        {/* 负载因子影响 - 配合视频 */}
        <section className={styles.section}>
          <h2>
            <TrendingUp size={24} />
            负载因子对性能的影响
          </h2>
          <p className={styles.intro}>
            负载因子是哈希表性能的核心指标。当负载因子升高时，冲突概率呈指数增长，
            导致查找性能急剧下降。下面通过动画演示这一过程：
          </p>

          <InlineVideo
            component={LoadFactorImpact}
            durationInFrames={1500}
            width={640}
            height={360}
            title="负载因子对性能的影响"
            loop={true}
          />

          <div className={styles.impactTable}>
            <table>
              <thead>
                <tr>
                  <th>负载因子范围</th>
                  <th>查找性能</th>
                  <th>冲突概率</th>
                  <th>内存利用率</th>
                  <th>建议操作</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.rowGood}>
                  <td>0 - 0.5</td>
                  <td>优秀 (&lt; 1.2次)</td>
                  <td>很低 (&lt; 10%)</td>
                  <td>较低 (50%)</td>
                  <td>无需操作</td>
                </tr>
                <tr className={styles.rowNormal}>
                  <td>0.5 - 0.75</td>
                  <td>良好 (1.2-1.5次)</td>
                  <td>低 (10-20%)</td>
                  <td>适中 (50-75%)</td>
                  <td>持续监控</td>
                </tr>
                <tr className={styles.rowWarning}>
                  <td>0.75 - 1.0</td>
                  <td>一般 (1.5-2次)</td>
                  <td>中等 (20-35%)</td>
                  <td>较高 (75-100%)</td>
                  <td>准备Rehash</td>
                </tr>
                <tr className={styles.rowDanger}>
                  <td>&gt; 1.0</td>
                  <td>较差 (&gt; 2次)</td>
                  <td>高 (&gt; 35%)</td>
                  <td>饱和 (100%+)</td>
                  <td>立即Rehash</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.keyInsight}>
            <strong>关键洞察：</strong>当负载因子超过 1.0 时，哈希表会发生过载，
            此时每个桶可能存储多个键值对，查找需要遍历链表，性能退化明显。
          </div>

          <div style={{ marginTop: '24px' }}>
            <InlineVideo
              component={LoadFactorThresholds}
              durationInFrames={1500}
              width={640}
              height={360}
              title="负载因子阈值详解"
              loop={true}
            />
          </div>
        </section>

        {/* 性能测试 */}
        <section className={styles.section}>
          <h2>性能基准测试</h2>
          <div className={styles.testControls}>
            <button onClick={() => runPerformanceTest(100)} className={styles.btn}>
              测试 100 次操作
            </button>
            <button onClick={() => runPerformanceTest(500)} className={styles.btn}>
              测试 500 次操作
            </button>
            <button onClick={() => runPerformanceTest(1000)} className={styles.btn}>
              测试 1000 次操作
            </button>
            <button onClick={() => setTestResults([])} className={styles.btnSecondary}>
              清空结果
            </button>
          </div>
          
          {testResults.length > 0 && (
            <div className={styles.testResults}>
              <table>
                <thead>
                  <tr>
                    <th>操作数</th>
                    <th>插入耗时</th>
                    <th>查询耗时</th>
                    <th>删除耗时</th>
                    <th>平均单次耗时</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.map((result, index) => (
                    <tr key={index}>
                      <td>{result.operations}</td>
                      <td>{result.insertTime.toFixed(2)} ms</td>
                      <td>{result.lookupTime.toFixed(2)} ms</td>
                      <td>{result.deleteTime.toFixed(2)} ms</td>
                      <td>
                        {((result.insertTime + result.lookupTime + result.deleteTime) / result.operations / 3).toFixed(4)} ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 嵌入式视频：基准测试演示 */}
          <div className={styles.inlineVideoWrapper}>
            <InlineVideo
              component={BenchmarkDemo}
              durationInFrames={450}
              width={640}
              height={360}
              title="性能基准测试演示"
            />
          </div>

          <div style={{ marginTop: '24px' }}>
            <InlineVideo
              component={BenchmarkRunAnimation}
              durationInFrames={1800}
              width={640}
              height={360}
              title="基准测试运行动画"
              loop={true}
            />
          </div>
        </section>

        {/* 优化建议 - 配合视频 */}
        <section className={styles.section}>
          <h2>
            <Zap size={24} />
            性能优化最佳实践
          </h2>
          <p className={styles.intro}>
            基于负载因子原理，以下是确保 Redis Dict 高性能运行的关键策略：
          </p>

          <InlineVideo
            component={OptimizationTips}
            durationInFrames={1650}
            width={640}
            height={360}
            title="性能优化建议"
            loop={true}
          />

          <div className={styles.practices}>
            <div className={styles.practice}>
              <div className={styles.practiceIcon}>
                <Target size={20} />
              </div>
              <h3>合理设置初始大小</h3>
              <p>根据预期数据量设置初始大小，避免频繁rehash。通常设置为预期量的1.5-2倍。</p>
              <code>initialSize = nextPower(expectedCount * 2)</code>
            </div>

            <div className={styles.practice}>
              <div className={styles.practiceIcon}>
                <Shield size={20} />
              </div>
              <h3>使用安全哈希函数</h3>
              <p>生产环境必须使用SipHash等抗攻击哈希函数，防止哈希洪水攻击。</p>
              <code>hashFunc = SipHash // 防御恶意输入</code>
            </div>

            <div className={styles.practice}>
              <div className={styles.practiceIcon}>
                <TrendingUp size={20} />
              </div>
              <h3>监控负载因子</h3>
              <p>定期检查负载因子，在达到0.75时开始准备rehash，不要等到超过1.0。</p>
              <code>if (loadFactor {'>'} 0.75) prepareRehash()</code>
            </div>

            <div className={styles.practice}>
              <div className={styles.practiceIcon}>
                <Database size={20} />
              </div>
              <h3>利用渐进式Rehash</h3>
              <p>Redis的渐进式rehash确保了无阻塞操作，但在高负载时可能需要调整批量大小。</p>
              <code>rehashBatchSize = min(used / 100, 100)</code>
            </div>

            <div className={styles.practice}>
              <div className={styles.practiceIcon}>
                <AlertTriangle size={20} />
              </div>
              <h3>避免大键值对</h3>
              <p>过大的value会影响内存和rehash性能，考虑拆分或使用其他数据结构。</p>
              <code>maxValueSize = 10KB // 建议上限</code>
            </div>

            <div className={styles.practice}>
              <div className={styles.practiceIcon}>
                <CheckCircle2 size={20} />
              </div>
              <h3>定期清理过期数据</h3>
              <p>及时清理不再使用的键，避免哈希表无限增长，保持合理的负载因子。</p>
              <code>expireUnusedKeys() // 定期执行</code>
            </div>
          </div>
        </section>

        {/* 性能对比 */}
        <section className={styles.section}>
          <h2>不同场景性能对比</h2>
          <div className={styles.comparison}>
            <div className={styles.comparisonItem}>
              <h3>低负载 (LF &lt; 0.5)</h3>
              <div className={styles.comparisonBar} style={{ width: '20%', background: '#4caf50' }} />
              <span>平均查找: 1.05次</span>
            </div>
            <div className={styles.comparisonItem}>
              <h3>中等负载 (LF 0.5-0.75)</h3>
              <div className={styles.comparisonBar} style={{ width: '40%', background: '#2196f3' }} />
              <span>平均查找: 1.37次</span>
            </div>
            <div className={styles.comparisonItem}>
              <h3>高负载 (LF 0.75-1.0)</h3>
              <div className={styles.comparisonBar} style={{ width: '65%', background: '#ff9800' }} />
              <span>平均查找: 1.87次</span>
            </div>
            <div className={styles.comparisonItem}>
              <h3>过载 (LF &gt; 1.0)</h3>
              <div className={styles.comparisonBar} style={{ width: '100%', background: '#f44336' }} />
              <span>平均查找: 2.5+次</span>
            </div>
          </div>

          {/* 嵌入式视频：场景性能对比 */}
          <div className={styles.inlineVideoWrapper}>
            <InlineVideo
              component={ScenarioComparison}
              durationInFrames={600}
              width={640}
              height={360}
              title="不同负载场景性能对比"
            />
          </div>

          <div style={{ marginTop: '24px' }}>
            <InlineVideo
              component={ScenarioComparisonBars}
              durationInFrames={1500}
              width={640}
              height={360}
              title="场景对比条形图"
              loop={true}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

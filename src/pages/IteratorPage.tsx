/**
 * 迭代器机制详解页面
 */

import React, { useState } from 'react';
import { RefreshCw, Shield, ShieldOff, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';
import { IteratorVideos } from '@/components/video';
import { InlineVideo } from '@/components/video/InlineVideo';
import { SafeVsUnsafe, IteratorMechanism, DictScanDemo, IteratorApplicationScenarios, IteratorMotivation, DictScanComparisonTable, DictIteratorStructure } from '@/remotion/compositions/iterator';
import styles from './IteratorPage.module.css';

export const IteratorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'safe' | 'unsafe'>('safe');

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <RefreshCw className={styles.heroIcon} size={48} />
        <h1 className={styles.title}>Dict 迭代器机制</h1>
        <p className={styles.subtitle}>
          理解 Redis 迭代器的安全机制与实现原理
        </p>
      </div>

      {/* 视频演示区域 */}
      <IteratorVideos />

      <div className={styles.content}>
        {/* 为什么需要迭代器 */}
        <section className={styles.section}>
          <h2>为什么需要迭代器？</h2>
          <div className={styles.conceptGrid}>
            <div className={styles.conceptCard}>
              <div className={styles.conceptIcon}>🔍</div>
              <h3>遍历所有键值对</h3>
              <p>
                在数据库操作中，经常需要遍历所有键（如 KEYS 命令），
                或者对所有元素进行批量操作，这就需要迭代器。
              </p>
            </div>
            <div className={styles.conceptCard}>
              <div className={styles.conceptIcon}>⚠️</div>
              <h3>并发安全问题</h3>
              <p>
                迭代过程中，如果哈希表发生 rehash（扩容/缩容），
                可能导致元素被遗漏或重复访问。
              </p>
            </div>
            <div className={styles.conceptCard}>
              <div className={styles.conceptIcon}>🔒</div>
              <h3>迭代器保护机制</h3>
              <p>
                Redis 通过迭代器与 rehash 的协调机制，
                确保遍历过程中元素既不遗漏也不重复。
              </p>
            </div>
          </div>

          {/* 插入动画：为什么需要迭代器 */}
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
            <InlineVideo
              component={IteratorMotivation}
              durationInFrames={1200}
              width={640}
              height={360}
              title="为什么需要迭代器"
              loop={true}
            />
          </div>

          {/* 插入内联视频：迭代器基本机制 */}
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
            <InlineVideo
              component={IteratorMechanism}
              durationInFrames={1650}
              width={640}
              height={360}
              title="迭代器遍历机制演示"
              loop={true}
            />
          </div>
        </section>

        {/* 迭代器类型 */}
        <section className={styles.section}>
          <h2>两种迭代器类型</h2>
          <div className={styles.tabButtons}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'safe' ? styles.active : ''}`}
              onClick={() => setActiveTab('safe')}
            >
              <Shield size={20} />
              安全迭代器 (Safe Iterator)
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'unsafe' ? styles.active : ''}`}
              onClick={() => setActiveTab('unsafe')}
            >
              <ShieldOff size={20} />
              非安全迭代器 (Unsafe Iterator)
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'safe' ? (
              <div className={styles.iteratorDemo}>
                <div className={styles.infoBox}>
                  <h3>🛡️ 安全迭代器</h3>
                  <p>
                    安全迭代器在迭代期间<strong>禁止触发 rehash</strong>。
                    迭代器持有 <code>dict-&gt;iterators</code> 计数，当计数大于 0 时，
                    任何会触发 rehash 的操作都会被推迟。
                  </p>
                </div>
                <div className={styles.codeBlock}>
                  <pre>{`// 安全迭代器的工作原理
dictIterator iter;
dictEntry *de;

de = dictNext(&iter);  // iterators++ (现在是1)
while (de) {
    // 此时任何 dictAdd/dictDelete 都不会触发 rehash
    process(de);
    de = dictNext(&iter);
}
dictReleaseIterator(&iter);  // iterators-- (现在是0)
// rehash 可以继续了`}</pre>
                </div>
                <div className={styles.points}>
                  <div className={styles.point}>
                    <CheckCircle size={20} />
                    <span>迭代过程中元素完整遍历，不会遗漏</span>
                  </div>
                  <div className={styles.point}>
                    <CheckCircle size={20} />
                    <span>不会有元素在迭代期间被迁移走</span>
                  </div>
                  <div className={styles.point}>
                    <CheckCircle size={20} />
                    <span>适合需要修改或删除元素的场景</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.iteratorDemo}>
                <div className={styles.infoBox} style={{ background: '#fff3e0', borderColor: '#ff9800' }}>
                  <h3>⚠️ 非安全迭代器</h3>
                  <p>
                    非安全迭代器在迭代期间<strong>不增加 iterators 计数</strong>，
                    因此 rehash 仍可能发生。迭代器必须快速完成，避免在 rehash 期间长时间持有。
                  </p>
                </div>
                <div className={styles.codeBlock}>
                  <pre>{`// 非安全迭代器的工作原理
dictIterator iter;
dictEntry *de;

de = dictNext(&iter);  // iterators 仍然是0！
while (de) {
    // 如果此时发生 rehash...
    // 同一元素可能被重复访问，或被遗漏
    process(de);
    de = dictNext(&iter);
}

// 正确的非安全迭代器用法
// 1. 确保迭代期间不发生写操作
// 2. 或者在迭代前先完成所有 rehash`}</pre>
                </div>
                <div className={styles.points}>
                  <div className={styles.point}>
                    <AlertTriangle size={20} style={{ color: '#ff9800' }} />
                    <span>迭代期间可能发生 rehash</span>
                  </div>
                  <div className={styles.point}>
                    <AlertTriangle size={20} style={{ color: '#ff9800' }} />
                    <span>可能出现元素遗漏或重复</span>
                  </div>
                  <div className={styles.point}>
                    <CheckCircle size={20} />
                    <span>性能更好，适合只读遍历</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 安全 vs 非安全迭代器对比视频 */}
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
            <InlineVideo
              component={SafeVsUnsafe}
              durationInFrames={1800}
              width={640}
              height={360}
              title="安全 vs 非安全迭代器对比"
              loop={true}
            />
          </div>
        </section>

        {/* 迭代中的 Rehash 处理 */}
        <section className={styles.section}>
          <h2>迭代过程中的 Rehash 处理</h2>
          <div className={styles.card}>
            <h3>迭代器如何处理双表？</h3>
            <p>
              在 rehash 期间，迭代器需要同时遍历 ht[0] 和 ht[1]。
              Redis 的实现方式是：先遍历 ht[0]，当 ht[0] 的所有桶都遍历完后，
              继续遍历 ht[1]。
            </p>
            <div className={styles.codeBlock}>
              <pre>{`// dictScan 函数的核心逻辑（简化版）
unsigned long dictScan(dict *d, unsigned long v,
                      dictScanFunction *fn, void *privdata) {
    dictht *t0 = &d->ht[0];

    // 第一步：遍历 ht[0] 的所有桶
    do {
        unsigned long m0 = t0->sizemask;
        // 遍历当前桶及其冲突链
        // ...

        // 如果正在进行 rehash
        if (d->rehashidx != -1) {
            // 渐进式迁移：每次 scan 迁移 100 个桶
            dictRehashMicroSteps(d, 100);
        }
    } while (t0->size > v);

    // 第二步：如果有 ht[1]，遍历它
    if (d->ht[1].size > 0) {
        dictht *t1 = &d->ht[1];
        // 遍历 ht[1] 的所有桶
        // ...
    }
}`}</pre>
            </div>

            {/* 迭代器与Rehash动画 */}
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
              <InlineVideo
                component={IteratorMechanism}
                durationInFrames={1650}
                width={640}
                height={360}
                title="迭代器与Rehash交互"
                loop={true}
              />
            </div>
          </div>

          <div className={styles.card} style={{ marginTop: '24px' }}>
            <h3>dictScan vs dictScanSafe</h3>
            <div className={styles.comparisonTable}>
              <table>
                <thead>
                  <tr>
                    <th>特性</th>
                    <th>dictScan</th>
                    <th>dictScanSafe</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>迭代器计数</td>
                    <td>不增加</td>
                    <td>增加</td>
                  </tr>
                  <tr>
                    <td>Rehash 安全</td>
                    <td>部分安全</td>
                    <td>完全安全</td>
                  </tr>
                  <tr>
                    <td>元素重复</td>
                    <td>可能重复</td>
                    <td>不重复</td>
                  </tr>
                  <tr>
                    <td>性能影响</td>
                    <td>较小</td>
                    <td>可能有延迟</td>
                  </tr>
                  <tr>
                    <td>使用场景</td>
                    <td>只读遍历</td>
                    <td>需要修改数据</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 嵌入式动画：dictScan vs dictScanSafe 对比 */}
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
              <InlineVideo
                component={DictScanComparisonTable}
                durationInFrames={1200}
                width={640}
                height={360}
                title="dictScan vs dictScanSafe 对比"
                loop={true}
              />
            </div>

            {/* 嵌入式视频：dictScan 演示 */}
            <div className={styles.inlineVideoWrapper}>
              <InlineVideo
                component={DictScanDemo}
                durationInFrames={600}
                width={640}
                height={360}
                title="dictScan 遍历机制演示"
              />
            </div>
          </div>
        </section>

        {/* 迭代器与数据结构 */}
        <section className={styles.section}>
          <h2>迭代器相关的数据结构</h2>
          <div className={styles.card}>
            <h3>dictIterator 结构</h3>
            <div className={styles.codeBlock}>
              <pre>{`typedef struct dictIterator {
    dict *d;                    // 指向所属字典
    long index;                 // 当前遍历的桶索引
    int table;                  // 当前遍历的哈希表 (0或1)
    int safe;                   // 是否为安全迭代器
    dictEntry *entry;           // 当前节点
    dictEntry *nextEntry;       // 下一个节点（防rehash用）
} dictIterator;`}</pre>
            </div>
            <div className={styles.explanation}>
              <h4>nextEntry 的作用</h4>
              <p>
                <strong>防止 rehash 导致节点丢失</strong>：在迭代过程中，
                如果节点被 rehash 迁移到 ht[1]，通过保存 nextEntry，
                仍然可以继续遍历完整个冲突链。
              </p>
            </div>

            {/* 嵌入式动画：迭代器数据结构 */}
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
              <InlineVideo
                component={DictIteratorStructure}
                durationInFrames={1200}
                width={640}
                height={360}
                title="迭代器数据结构详解"
                loop={true}
              />
            </div>
          </div>
        </section>

        {/* 实际应用场景 */}
        <section className={styles.section}>
          <h2>实际应用场景</h2>
          <div className={styles.scenarios}>
            <div className={styles.scenario}>
              <h3>🔑 KEYS 命令</h3>
              <p>
                使用非安全迭代器遍历所有键，返回匹配的键名。
                注意：生产环境中 KEYS 命令会阻塞 Redis，应使用 SCAN 代替。
              </p>
              <code>keys *pattern*</code>
            </div>
            <div className={styles.scenario}>
              <h3>📊 SCAN 命令</h3>
              <p>
                使用安全迭代器，分批返回匹配的键，避免阻塞。
                返回游标值，下次调用时传入以继续遍历。
              </p>
              <code>scan cursor [MATCH pattern] [COUNT count]</code>
            </div>
            <div className={styles.scenario}>
              <h3>🧹 过期键清理</h3>
              <p>
                使用安全迭代器遍历，删除过期键。
                迭代期间不会触发 rehash，确保完整性。
              </p>
              <code>EXPIRE key seconds</code>
            </div>
            <div className={styles.scenario}>
              <h3>📝 持久化保存</h3>
              <p>
                RDB 快照使用安全迭代器遍历所有键值对进行持久化。
                确保不会遗漏任何数据。
              </p>
              <code>SAVE / BGSAVE</code>
            </div>
          </div>

          {/* 嵌入式视频：迭代器应用场景 */}
          <div className={styles.inlineVideoWrapper}>
            <InlineVideo
              component={IteratorApplicationScenarios}
              durationInFrames={600}
              width={640}
              height={360}
              title="迭代器实际应用场景演示"
            />
          </div>
        </section>

        {/* 下一步 */}
        <section className={styles.nextSection}>
          <h2>准备好继续深入了吗？</h2>
          <p>前往交互实践页面，实际操作迭代器，观察其工作原理！</p>
          <a href="/playground" className={styles.ctaButton}>
            开始实践 <ArrowRight size={20} />
          </a>
        </section>
      </div>
    </div>
  );
};

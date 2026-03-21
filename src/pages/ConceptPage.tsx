/**
 * 概念介绍页面
 * Redis Dict 核心概念与数据结构详解
 */

import React from 'react';
import { BookOpen, Hash, Link2, ArrowRight, Zap, Shield, Database } from 'lucide-react';
import { InlineVideo } from '@/components/video';
import { WhatIsDict, SeparateChaining, DictStructure, ProgressiveRehashFeature, AutoResizeFeature, SecureHashFeature, SeparateChainingDeepDive, HashCollisionIntro, DictEntryVisualization, HashConflictOperations, TimeComplexityTable, ChainInsertionDemo, ChainTraversalDemo, ChainDeletionDemo, DictUseCases, DictEntryFieldExplanation, HashFunctionDeterminism, BucketIndexCalculation, LoadFactorFormula, CollisionVsNonCollision } from '@/remotion/compositions/concept';
import styles from './ConceptPage.module.css';

export const ConceptPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Redis Dict 核心概念</h1>
        <p className={styles.subtitle}>
          深入理解Redis字典的设计原理与实现细节
        </p>
      </div>

      {/* 主内容区域 */}
      <div className={styles.content}>
        {/* 什么是Dict - 带视频介绍 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <BookOpen className={styles.sectionIcon} />
            <h2>什么是 Redis Dict？</h2>
          </div>
          <div className={styles.card}>
            <p>
              Redis Dict（字典）是Redis最核心的数据结构之一，它实现了一个高性能的<strong>哈希表</strong>。
              几乎所有Redis的数据类型底层都会用到Dict。
            </p>

            {/* 视频：什么是 Dict */}
            <div className={styles.inlineVideoWrapper}>
              <InlineVideo
                component={WhatIsDict}
                durationInFrames={1350}
                width={640}
                height={360}
                title="什么是 Redis Dict"
                fullWidth={true}
              />
            </div>

            <h3 style={{ marginTop: '24px', fontSize: '18px', color: '#333' }}>Dict 的主要用途</h3>
            <ul className={styles.list}>
              <li><strong>数据库键空间</strong> - 存储所有键值对</li>
              <li><strong>哈希类型</strong> - HASH命令的底层实现</li>
              <li><strong>集合类型</strong> - SET命令的底层实现之一</li>
              <li><strong>有序集合</strong> - ZSET的内部索引</li>
            </ul>

            {/* 动画：Dict主要用途 */}
            <div style={{ marginTop: '24px' }}>
              <InlineVideo
                component={DictUseCases}
                durationInFrames={300}
                width={640}
                height={360}
                title="Redis Dict 应用场景"
                fullWidth={true}
              />
            </div>
          </div>
        </section>

        {/* 核心特性 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Zap className={styles.sectionIcon} />
            <h2>核心特性</h2>
          </div>
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}><Zap size={32} color="#D82C20" /></div>
              <h3>渐进式 Rehash</h3>
              <p>
                避免一次性rehash导致的长时间阻塞，将rehash操作分散到多次请求中执行。
                这是Redis保持高性能的关键设计。
              </p>
              <div className={styles.inlineVideoWrapper}>
                <InlineVideo
                  component={ProgressiveRehashFeature}
                  durationInFrames={450}
                  width={640}
                  height={360}
                  title="渐进式 Rehash 演示"
                />
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}><Link2 size={32} color="#D82C20" /></div>
              <h3>链地址法解决冲突</h3>
              <p>
                使用链表处理哈希冲突，每个哈希桶存储一个链表。
                相比开放地址法，链地址法在高负载下表现更稳定。
              </p>
              <div style={{ marginTop: '16px' }}>
                <InlineVideo
                  component={SeparateChainingDeepDive}
                  durationInFrames={900}
                  width={640}
                  height={360}
                  title="链地址法深入解析"
                />
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}><Database size={32} color="#D82C20" /></div>
              <h3>自动扩容与缩容</h3>
              <p>
                根据负载因子自动调整哈希表大小。
                负载因子 = 已使用节点数 / 哈希表大小，通常阈值为1.0。
              </p>
              <div className={styles.inlineVideoWrapper}>
                <InlineVideo
                  component={AutoResizeFeature}
                  durationInFrames={450}
                  width={640}
                  height={360}
                  title="自动扩容缩容演示"
                />
              </div>

              {/* 动画：负载因子公式 */}
              <div style={{ marginTop: '16px' }}>
                <InlineVideo
                  component={LoadFactorFormula}
                  durationInFrames={240}
                  width={640}
                  height={360}
                  title="负载因子公式解析"
                  fullWidth={true}
                />
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}><Shield size={32} color="#D82C20" /></div>
              <h3>安全的哈希函数</h3>
              <p>
                默认使用SipHash算法，有效防御哈希洪水攻击（Hash Flooding Attack）。
                保证在恶意输入下仍能维持O(1)性能。
              </p>
              <div className={styles.inlineVideoWrapper}>
                <InlineVideo
                  component={SecureHashFeature}
                  durationInFrames={450}
                  width={640}
                  height={360}
                  title="安全哈希函数演示"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 数据结构 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Link2 className={styles.sectionIcon} />
            <h2>数据结构详解</h2>
          </div>
          <div className={styles.card}>
            <h3>双哈希表结构</h3>
            <div className={styles.codeBlock}>
              <pre>{`struct dict {
    dictType *type;      // 类型特定函数
    dictht ht[2];        // 两个哈希表
    long rehashidx;      // rehash进度索引
    int iterators;       // 当前迭代器数量
};

struct dictht {
    dictEntry **table;   // 哈希表数组
    unsigned long size;  // 哈希表大小
    unsigned long used;  // 已使用节点数
};`}</pre>
            </div>

            {/* 视频：双哈希表结构 */}
            <div className={styles.inlineVideoWrapper}>
              <InlineVideo
                component={DictStructure}
                durationInFrames={1500}
                width={640}
                height={360}
                title="双哈希表结构与Rehash过程"
              />
            </div>

            <div className={styles.explanation}>
              <h4>为什么需要两个哈希表？</h4>
              <p>
                <strong>ht[0]</strong> 是主哈希表，正常情况下所有操作都在这里进行。<br/>
                <strong>ht[1]</strong> 是辅助哈希表，仅在rehash时使用。
              </p>
              <p>
                通过双表设计，可以将数据从ht[0]逐步迁移到ht[1]，
                在迁移过程中两个表同时工作，保证服务不中断。
              </p>
            </div>
          </div>

          {/* dictEntry 结构 */}
          <div className={styles.card} style={{ marginTop: '24px' }}>
            <h3>dictEntry 哈希桶节点</h3>
            <div className={styles.codeBlock}>
              <pre>{`typedef struct dictEntry {
    void *key;              // 键（指向字符串对象）
    union {                 // 值可以是多种类型
        void *val;
        uint64_t u64;
        int64_t s64;
        double d;
    } v;
    struct dictEntry *next; // 指向下一个节点的指针（链地址法）
} dictEntry;`}</pre>
            </div>
            <div className={styles.explanation}>
              <h4>dictEntry 的关键字段</h4>
              <p>
                <strong>key</strong>：指向键对象的指针，在Redis中键都是字符串对象。<br/>
                <strong>v</strong>：联合体，存储值，可以是指针、无符号64位整数、有符号64位整数或浮点数。<br/>
                <strong>next</strong>：指向链表中下一个节点的指针，实现链地址法解决哈希冲突。
              </p>
              <p>
                <strong>注意</strong>：dictEntry 本身不存储哈希值，哈希值在需要时通过 dictType 中的哈希函数实时计算。
              </p>
            </div>
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <InlineVideo
                component={DictEntryVisualization}
                durationInFrames={900}
                width={640}
                height={360}
                title="dictEntry 节点结构可视化"
              />
            </div>

            {/* 动画：dictEntry字段详解 */}
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <InlineVideo
                component={DictEntryFieldExplanation}
                durationInFrames={360}
                width={640}
                height={360}
                title="dictEntry 各字段详解"
                fullWidth={true}
              />
            </div>
          </div>
        </section>

        {/* 哈希冲突详解 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Hash className={styles.sectionIcon} />
            <h2>哈希冲突与链地址法</h2>
          </div>
          <div className={styles.card}>
            <h3>什么是哈希冲突？</h3>
            <p>
              哈希冲突是指不同的键经过哈希函数计算后，得到了相同的哈希值，因此需要被存放到同一个哈希桶中。
              理想的哈希函数应该均匀分布键，但完全避免冲突是不可能的。
            </p>
            <div className={styles.codeBlock}>
              <pre>{`// 哈希冲突示例
哈希函数: h(key) = key.length % 4

插入键 "name" (长度5):  h("name") = 5 % 4 = 1  → 桶1
插入键 "age" (长度3):    h("age") = 3 % 4 = 3  → 桶3
插入键 "user" (长度4):   h("user") = 4 % 4 = 0  → 桶0
插入键 "key" (长度3):    h("key") = 3 % 4 = 3  → 桶3 (与age冲突!)`}</pre>
            </div>
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <InlineVideo
                component={HashCollisionIntro}
                durationInFrames={900}
                width={640}
                height={360}
                title="哈希冲突详解"
              />
            </div>

            {/* 动画：哈希函数确定性 */}
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <InlineVideo
                component={HashFunctionDeterminism}
                durationInFrames={240}
                width={640}
                height={360}
                title="哈希函数的确定性"
                fullWidth={true}
              />
            </div>

            {/* 动画：桶索引计算 */}
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <InlineVideo
                component={BucketIndexCalculation}
                durationInFrames={300}
                width={640}
                height={360}
                title="桶索引计算过程"
                fullWidth={true}
              />
            </div>
          </div>

          <div className={styles.card} style={{ marginTop: '24px' }}>
            <h3>链地址法解决方案</h3>
            <p>
              Redis 使用<strong>链地址法（Separate Chaining）</strong>解决哈希冲突：
              每个哈希桶不再存储单个元素，而是存储一个链表的头指针，所有哈希到同一桶的元素都加入这个链表。
            </p>

            {/* 视频：链地址法 */}
            <div className={styles.inlineVideoWrapper}>
              <InlineVideo
                component={SeparateChaining}
                durationInFrames={1800}
                width={640}
                height={360}
                title="链地址法解决哈希冲突"
              />
            </div>

            <h4 style={{ marginTop: '24px', marginBottom: '12px' }}>链地址法操作演示</h4>
            <div style={{ marginBottom: '16px' }}>
              <InlineVideo
                component={ChainInsertionDemo}
                durationInFrames={900}
                width={640}
                height={360}
                title="链表插入操作"
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <InlineVideo
                component={ChainTraversalDemo}
                durationInFrames={900}
                width={640}
                height={360}
                title="链表遍历操作"
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <InlineVideo
                component={ChainDeletionDemo}
                durationInFrames={900}
                width={640}
                height={360}
                title="链表删除操作"
              />
            </div>

            <div className={styles.codeBlock}>
              <pre>{`// 链地址法示意图
桶0: [user] → null
桶1: [name] → null
桶2: [city] → null
桶3: [age] → [key] → [id] → null
          ↑
       冲突链（最近插入的在头部）

// 插入 "email" (长度6, h=2)
桶2: [email] → [city] → null

// 查找 "key"
1. 计算 h("key") = 3
2. 定位到桶3
3. 遍历链表: age → key → 找到!`}</pre>
            </div>
            <div className={styles.explanation}>
              <h4>链地址法的优势</h4>
              <p>
                <strong>1. 简单实现</strong>：只需在链表头部插入新节点，O(1)时间复杂度。<br/>
                <strong>2. 内存效率</strong>：只在有冲突时才分配节点，避免开放地址法的内存碎片。<br/>
                <strong>3. 删除简单</strong>：直接操作链表节点，无需探测其他位置。<br/>
                <strong>4. 负载因子无限制</strong>：可以超过1，不像开放地址法需要立即rehash。
              </p>
            </div>
          </div>

          <div className={styles.card} style={{ marginTop: '24px' }}>
            <h3>冲突处理的具体操作</h3>
            <div className={styles.table}>
              <table>
                <thead>
                  <tr>
                    <th>操作</th>
                    <th>执行过程</th>
                    <th>时间复杂度</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>插入</td>
                    <td>计算桶索引 → 头插法插入链表</td>
                    <td className={styles.goodPerf}>O(1)</td>
                  </tr>
                  <tr>
                    <td>查找</td>
                    <td>计算桶索引 → 遍历链表对比key</td>
                    <td>O(1+k/n)</td>
                  </tr>
                  <tr>
                    <td>删除</td>
                    <td>计算桶索引 → 找到并从链表移除</td>
                    <td>O(1+k/n)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
              注：k/n 是负载因子（已用槽位/总槽位），理想情况下为 O(1)
            </p>
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <InlineVideo
                component={HashConflictOperations}
                durationInFrames={900}
                width={640}
                height={360}
                title="哈希冲突操作详解"
              />
            </div>

            {/* 动画：有冲突vs无冲突对比 */}
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <InlineVideo
                component={CollisionVsNonCollision}
                durationInFrames={300}
                width={640}
                height={360}
                title="有冲突 vs 无冲突情况对比"
                fullWidth={true}
              />
            </div>
          </div>
        </section>

        {/* 关键操作 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <ArrowRight className={styles.sectionIcon} />
            <h2>关键操作复杂度</h2>
          </div>
          <div className={styles.table}>
            <table>
              <thead>
                <tr>
                  <th>操作</th>
                  <th>平均时间复杂度</th>
                  <th>最坏时间复杂度</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>查找 (GET)</td>
                  <td className={styles.goodPerf}>O(1)</td>
                  <td className={styles.badPerf}>O(N)</td>
                  <td>最坏情况：所有键哈希到同一桶</td>
                </tr>
                <tr>
                  <td>插入 (SET)</td>
                  <td className={styles.goodPerf}>O(1)</td>
                  <td className={styles.badPerf}>O(N)</td>
                  <td>可能触发rehash，但分摊后仍为O(1)</td>
                </tr>
                <tr>
                  <td>删除 (DEL)</td>
                  <td className={styles.goodPerf}>O(1)</td>
                  <td className={styles.badPerf}>O(N)</td>
                  <td>需要遍历冲突链</td>
                </tr>
                <tr>
                  <td>Rehash步骤</td>
                  <td className={styles.goodPerf}>O(1)</td>
                  <td className={styles.goodPerf}>O(1)</td>
                  <td>每次只迁移一个桶</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <InlineVideo
              component={TimeComplexityTable}
              durationInFrames={900}
              width={640}
              height={360}
              title="关键操作复杂度分析"
            />
          </div>
        </section>

        {/* 下一步 */}
        <section className={styles.nextSection}>
          <h2>准备好动手实践了吗？</h2>
          <p>前往交互实践页面，亲自操作Redis Dict，观察各种操作的实时效果！</p>
          <a href="/playground" className={styles.ctaButton}>
            开始实践 <ArrowRight size={20} />
          </a>
        </section>
      </div>
    </div>
  );
};

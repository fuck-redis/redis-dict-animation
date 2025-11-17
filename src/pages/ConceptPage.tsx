/**
 * 概念介绍页面
 */

import React from 'react';
import { BookOpen, Hash, Link2, ArrowRight } from 'lucide-react';
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

      <div className={styles.content}>
        {/* 什么是Dict */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <BookOpen className={styles.sectionIcon} />
            <h2>什么是 Redis Dict？</h2>
          </div>
          <div className={styles.card}>
            <p>
              Redis Dict（字典）是Redis最核心的数据结构之一，它实现了一个高性能的<strong>哈希表</strong>。
              几乎所有Redis的数据类型底层都会用到Dict：
            </p>
            <ul className={styles.list}>
              <li><strong>数据库键空间</strong> - 存储所有键值对</li>
              <li><strong>哈希类型</strong> - HASH命令的底层实现</li>
              <li><strong>集合类型</strong> - SET命令的底层实现之一</li>
              <li><strong>有序集合</strong> - ZSET的内部索引</li>
            </ul>
          </div>
        </section>

        {/* 核心特性 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Hash className={styles.sectionIcon} />
            <h2>核心特性</h2>
          </div>
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔄</div>
              <h3>渐进式 Rehash</h3>
              <p>
                避免一次性rehash导致的长时间阻塞，将rehash操作分散到多次请求中执行。
                这是Redis保持高性能的关键设计。
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔗</div>
              <h3>链地址法解决冲突</h3>
              <p>
                使用链表处理哈希冲突，每个哈希桶存储一个链表。
                相比开放地址法，链地址法在高负载下表现更稳定。
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📊</div>
              <h3>自动扩容与缩容</h3>
              <p>
                根据负载因子自动调整哈希表大小。
                负载因子 = 已使用节点数 / 哈希表大小，通常阈值为1.0。
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔐</div>
              <h3>安全的哈希函数</h3>
              <p>
                默认使用SipHash算法，有效防御哈希洪水攻击（Hash Flooding Attack）。
                保证在恶意输入下仍能维持O(1)性能。
              </p>
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

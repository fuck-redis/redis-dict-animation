/**
 * 迭代器机制详解
 * 视频时长: 55秒 (1650帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const FPS = 30;
const TOTAL_FRAMES = 1650; // 55秒

function IteratorStructure() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 24 }}>迭代器数据结构</h2>

      <div
        style={{
          background: '#1e1e1e',
          borderRadius: 8,
          padding: 24,
          fontFamily: "'Courier New', monospace",
          fontSize: 15,
          marginBottom: 32,
        }}
      >
        <div style={{ color: '#6a9955' }}>typedef struct dictIterator {'{'}</div>
        <div style={{ color: '#d4d4d4', paddingLeft: 20, marginTop: 8 }}>
          dict *d;
          <span style={{ color: '#6a9955' }}> // 指向所属字典</span>
        </div>
        <div style={{ color: '#d4d4d4', paddingLeft: 20, marginTop: 8 }}>
          long index;
          <span style={{ color: '#6a9955' }}> // 当前遍历的桶索引</span>
        </div>
        <div style={{ color: '#d4d4d4', paddingLeft: 20, marginTop: 8 }}>
          int table;
          <span style={{ color: '#6a9955' }}> // 当前遍历的哈希表 (0或1)</span>
        </div>
        <div style={{ color: '#d4d4d4', paddingLeft: 20, marginTop: 8 }}>
          int safe;
          <span style={{ color: '#6a9955' }}> // 是否为安全迭代器</span>
        </div>
        <div style={{ color: '#d4d4d4', paddingLeft: 20, marginTop: 8 }}>
          dictEntry *entry;
          <span style={{ color: '#6a9955' }}> // 当前节点</span>
        </div>
        <div style={{ color: '#d4d4d4', paddingLeft: 20, marginTop: 8 }}>
          dictEntry *nextEntry;
          <span style={{ color: '#6a9955' }}> // 下一个节点（防rehash用）</span>
        </div>
        <div style={{ color: '#6a9955', marginTop: 8 }}>{'}'} dictIterator;</div>
      </div>

      <div
        style={{
          padding: 20,
          background: 'rgba(255, 152, 0, 0.2)',
          border: '2px solid #ff9800',
          borderRadius: 8,
          color: 'white',
        }}
      >
        <strong style={{ color: '#ff9800' }}>nextEntry 的作用:</strong>
        <p style={{ margin: '12px 0 0 0', color: '#a0a0a0' }}>
          在迭代过程中，如果节点被 rehash 迁移到 ht[1]，通过保存 nextEntry，
          仍然可以继续遍历完整个冲突链，防止节点丢失。
        </p>
      </div>
    </div>
  );
}

function ScanProcess() {
  const frame = useCurrentFrame();
  const showHt1 = frame >= 150;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 24 }}>迭代过程中的 Rehash 处理</h2>

      <p style={{ color: '#a0a0a0', marginBottom: 24 }}>
        在 rehash 期间，迭代器需要同时遍历 ht[0] 和 ht[1]。
      </p>

      <div style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
        {/* ht[0] */}
        <div
          style={{
            flex: 1,
            padding: 20,
            background: 'rgba(33, 150, 243, 0.1)',
            border: '2px solid #2196f3',
            borderRadius: 12,
            opacity: showHt1 ? 0.6 : 1,
            transition: 'opacity 0.3s ease',
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#2196f3', marginBottom: 12 }}>
            ht[0]
          </div>
          <div style={{ color: '#a0a0a0', fontSize: 14 }}>
            先遍历 ht[0] 的所有桶
          </div>
          <div style={{ color: '#666', fontSize: 12, marginTop: 8 }}>
            {showHt1 ? '已遍历完成' : '正在遍历...'}
          </div>
        </div>

        {/* ht[1] */}
        <div
          style={{
            flex: 1,
            padding: 20,
            background: showHt1 ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 255, 255, 0.02)',
            border: `2px solid ${showHt1 ? '#ff9800' : '#444'}`,
            borderRadius: 12,
            opacity: showHt1 ? 1 : 0.5,
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 'bold', color: showHt1 ? '#ff9800' : '#666', marginBottom: 12 }}>
            ht[1]
          </div>
          <div style={{ color: '#a0a0a0', fontSize: 14 }}>
            {showHt1 ? '继续遍历 ht[1]' : '等待 ht[0] 完成'}
          </div>
        </div>
      </div>

      <div
        style={{
          background: '#1e1e1e',
          borderRadius: 8,
          padding: 20,
          fontFamily: "'Courier New', monospace",
          fontSize: 14,
        }}
      >
        <div style={{ color: '#6a9955' }}>// dictScan 函数的核心逻辑（简化版）</div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>dictht *t0 = &d-&gt;ht[0];</div>
        <div style={{ color: '#6a9955', marginTop: 12, marginBottom: 8 }}>// 第一步：遍历 ht[0]</div>
        <div style={{ color: '#d4d4d4' }}>do {'{'}</div>
        <div style={{ color: '#dcdcaa', paddingLeft: 20, marginTop: 8 }}>...</div>
        <div style={{ color: '#d4d4d4', paddingLeft: 20, marginTop: 8 }}>while (t0-&gt;size {'>'} v);</div>
        <div style={{ color: '#6a9955', marginTop: 12, marginBottom: 8 }}>// 第二步：如果有 ht[1]，遍历它</div>
        <div style={{ color: '#d4d4d4' }}>if (d-&gt;ht[1].size {'>'} 0) {'{'}</div>
        <div style={{ color: '#dcdcaa', paddingLeft: 20, marginTop: 8 }}>...</div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>{'}'}</div>
      </div>
    </div>
  );
}

export const IteratorMechanism: React.FC = () => {
  const frame = useCurrentFrame();
  const section = Math.floor(frame / 540);

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="迭代器机制"
          subtitle="遍历与 Rehash 的协调"
        />
      </Sequence>

      {/* 第二段: 数据结构 */}
      <Sequence from={90} durationInFrames={630}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <IteratorStructure />
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 遍历过程 */}
      <Sequence from={720} durationInFrames={630}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <ScanProcess />
        </AbsoluteFill>
      </Sequence>

      {/* 第四段: 总结 */}
      <Sequence from={1350} durationInFrames={300}>
        <SceneNarrator
          title="迭代器设计精妙"
          subtitle="保证遍历的完整性与一致性"
          text="通过 iterators 计数和 nextEntry 指针，Redis 保证了即使在 Rehash 期间，迭代器也能完整遍历所有元素，不会遗漏也不会重复。"
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export default IteratorMechanism;

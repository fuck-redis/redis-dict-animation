/**
 * Dict 数据结构详解
 * 视频时长: 50秒 (1500帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const FPS = 30;
const TOTAL_FRAMES = 1500; // 50秒

function CodeBlock({ code, title }: { code: string; title?: string }) {
  return (
    <div
      style={{
        background: '#1e1e1e',
        borderRadius: 8,
        overflow: 'hidden',
        fontFamily: "'Courier New', monospace",
      }}
    >
      {title && (
        <div
          style={{
            padding: '12px 16px',
            background: '#2d2d2d',
            borderBottom: '1px solid #3d3d3d',
            fontSize: 14,
            color: '#a0a0a0',
          }}
        >
          {title}
        </div>
      )}
      <pre
        style={{
          margin: 0,
          padding: 20,
          fontSize: 15,
          lineHeight: 1.6,
          color: '#d4d4d4',
          overflow: 'auto',
        }}
      >
        {code}
      </pre>
    </div>
  );
}

function DualTableDiagram() {
  const frame = useCurrentFrame();
  const showHt1 = frame >= 180;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 32 }}>双哈希表结构</h2>

      <div style={{ display: 'flex', gap: 48, marginBottom: 40 }}>
        {/* ht[0] */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 280,
              padding: 24,
              background: frame < 120 ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.4)',
              border: '3px solid #2196f3',
              borderRadius: 12,
              transition: 'all 0.5s ease',
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#2196f3', marginBottom: 16 }}>
              ht[0]
            </div>
            <div style={{ fontSize: 16, color: '#a0a0a0' }}>主哈希表</div>
            <div style={{ fontSize: 14, color: '#666', marginTop: 8 }}>
              正常操作在这里进行
            </div>
          </div>
        </div>

        {/* ht[1] */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 280,
              padding: 24,
              background: showHt1 ? 'rgba(255, 152, 0, 0.4)' : 'rgba(255, 152, 0, 0.1)',
              border: `3px solid ${showHt1 ? '#ff9800' : '#666'}`,
              borderRadius: 12,
              transition: 'all 0.5s ease',
              opacity: showHt1 ? 1 : 0.5,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#ff9800', marginBottom: 16 }}>
              ht[1]
            </div>
            <div style={{ fontSize: 16, color: '#a0a0a0' }}>辅助哈希表</div>
            <div style={{ fontSize: 14, color: '#666', marginTop: 8 }}>
              {showHt1 ? 'Rehash 时使用' : '仅在 Rehash 时激活'}
            </div>
          </div>
        </div>
      </div>

      {/* dict 结构 */}
      <CodeBlock
        title="dict 结构体"
        code={`struct dict {
    dictType *type;      // 类型特定函数
    dictht ht[2];        // 两个哈希表
    long rehashidx;      // rehash 进度索引
    int iterators;       // 当前迭代器数量
};`}
      />

      {frame >= 300 && (
        <div
          style={{
            marginTop: 32,
            padding: 20,
            background: 'rgba(76, 175, 80, 0.2)',
            border: '2px solid #4caf50',
            borderRadius: 8,
            color: 'white',
          }}
        >
          <strong>为什么需要两个表？</strong>
          <p style={{ margin: '12px 0 0 0', color: '#a0a0a0' }}>
            通过双表设计，可以将数据从 ht[0] 逐步迁移到 ht[1]，
            在迁移过程中两个表同时工作，保证服务不中断。
          </p>
        </div>
      )}
    </div>
  );
}

function EntryStructure() {
  const frame = useCurrentFrame();
  const highlight = Math.floor(frame / 60) % 3;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 32 }}>dictEntry 节点结构</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 40, marginBottom: 40 }}>
        {/* 节点图示 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: 20,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 12,
          }}
        >
          {/* key */}
          <div
            style={{
              padding: '12px 20px',
              background: highlight === 0 ? '#e3f2fd' : 'white',
              border: `2px solid ${highlight === 0 ? '#2196f3' : '#ccc'}`,
              borderRadius: 8,
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>key</div>
            <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 600 }}>"name"</div>
          </div>

          {/* v */}
          <div
            style={{
              padding: '12px 20px',
              background: highlight === 1 ? '#fff3e0' : 'white',
              border: `2px solid ${highlight === 1 ? '#ff9800' : '#ccc'}`,
              borderRadius: 8,
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>v (union)</div>
            <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 600 }}>"Alice"</div>
          </div>

          {/* next */}
          <div
            style={{
              padding: '12px 20px',
              background: highlight === 2 ? '#e8f5e9' : 'white',
              border: `2px solid ${highlight === 2 ? '#4caf50' : '#ccc'}`,
              borderRadius: 8,
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>next</div>
            <div style={{ fontFamily: "'Courier New', monospace", color: '#4caf50' }}>→</div>
          </div>
        </div>
      </div>

      <CodeBlock
        code={`typedef struct dictEntry {
    void *key;              // 键
    union {                 // 值可以是多种类型
        void *val;
        uint64_t u64;
        int64_t s64;
        double d;
    } v;
    struct dictEntry *next; // 链地址法
} dictEntry;`}
      />

      <div style={{ marginTop: 32, color: '#a0a0a0', fontSize: 16 }}>
        <p>
          <strong style={{ color: '#2196f3' }}>key:</strong> 指向键对象的指针
        </p>
        <p style={{ marginTop: 8 }}>
          <strong style={{ color: '#ff9800' }}>v:</strong> 联合体，可存储指针、64位整数或浮点数
        </p>
        <p style={{ marginTop: 8 }}>
          <strong style={{ color: '#4caf50' }}>next:</strong> 指向下一个节点，实现链地址法
        </p>
      </div>
    </div>
  );
}

export const DictStructure: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="Dict 数据结构"
          subtitle="双哈希表与节点结构"
        />
      </Sequence>

      {/* 第二段: 双哈希表结构 */}
      <Sequence from={90} durationInFrames={570}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <DualTableDiagram />
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: dictEntry 节点 */}
      <Sequence from={660} durationInFrames={540}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <EntryStructure />
        </AbsoluteFill>
      </Sequence>

      {/* 第四段: 总结 */}
      <Sequence from={1200} durationInFrames={300}>
        <SceneNarrator
          title="Dict 设计精妙"
          subtitle="渐进式 Rehash 的基础"
          text="双哈希表结构是 Redis 实现渐进式 Rehash 的关键，使得扩容操作可以分散到多次请求中完成，保证服务持续可用。"
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export default DictStructure;

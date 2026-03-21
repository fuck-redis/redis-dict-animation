/**
 * 链地址法详解
 * 视频时长: 60秒 (1800帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';
import type { DictEntry } from '@/remotion/types';

const FPS = 30;
const TOTAL_FRAMES = 1800; // 60秒

function HashBucket({
  index,
  entries,
  highlighted,
  x,
  y,
}: {
  index: number;
  entries: { key: string; value: string }[];
  highlighted: boolean;
  x: number;
  y: number;
}) {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 180,
        minHeight: 120,
        background: highlighted ? '#fff9c4' : entries.length === 0 ? '#fafafa' : '#e8f5e9',
        border: `2px solid ${highlighted ? '#ffc107' : entries.length === 0 ? '#e0e0e0' : '#4caf50'}`,
        borderRadius: 8,
        padding: 12,
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          background: '#2196f3',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: 16,
          marginBottom: 8,
        }}
      >
        {index}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {entries.map((entry, i) => (
          <React.Fragment key={entry.key}>
            <div
              style={{
                padding: '6px 10px',
                background: 'white',
                border: '2px solid #2196f3',
                borderRadius: 4,
                fontSize: 13,
                fontFamily: "'Courier New', monospace",
              }}
            >
              <span style={{ color: '#1976d2', fontWeight: 600 }}>{entry.key}</span>
              <span style={{ color: '#999', margin: '0 4px' }}>:</span>
              <span style={{ color: '#388e3c' }}>{entry.value}</span>
            </div>
            {i < entries.length - 1 && (
              <div style={{ textAlign: 'center', color: '#666', fontSize: 12 }}>
                ↓
              </div>
            )}
          </React.Fragment>
        ))}
        {entries.length === 0 && (
          <div style={{ color: '#999', fontSize: 13, fontStyle: 'italic' }}>空</div>
        )}
      </div>

      {entries.length > 1 && (
        <div
          style={{
            position: 'absolute',
            top: -12,
            right: -12,
            background: '#ff5722',
            color: 'white',
            width: 24,
            height: 24,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 'bold',
          }}
        >
          {entries.length}
        </div>
      )}
    </div>
  );
}

function CollisionDemo() {
  const frame = useCurrentFrame();

  // 哈希冲突演示
  // h(key) = key.length % 4
  const buckets = [
    { index: 0, entries: [{ key: 'user', value: 'u1' }] },
    { index: 1, entries: [{ key: 'name', value: 'n1' }] },
    { index: 2, entries: [] },
    { index: 3, entries: [{ key: 'age', value: 'a1' }, { key: 'key', value: 'k1' }, { key: 'id', value: 'i1' }] },
  ];

  const showBucket = Math.floor(frame / 60);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 32 }}>链地址法解决哈希冲突</h2>
      <p style={{ color: '#a0a0a0', marginBottom: 40, fontSize: 18 }}>
        哈希函数: h(key) = key.length % 4
      </p>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {buckets.slice(0, showBucket + 1).map((bucket, i) => (
          <HashBucket
            key={bucket.index}
            index={bucket.index}
            entries={bucket.entries}
            highlighted={bucket.entries.length > 1}
            x={i * 200}
            y={100}
          />
        ))}
      </div>

      {showBucket >= 3 && (
        <div
          style={{
            marginTop: 40,
            padding: 20,
            background: 'rgba(255, 87, 34, 0.2)',
            border: '2px solid #ff5722',
            borderRadius: 8,
            color: 'white',
            fontSize: 18,
          }}
        >
          <strong>桶3 发生冲突!</strong> age, key, id 三个键都映射到同一个桶，
          通过链表连接起来。
        </div>
      )}
    </div>
  );
}

function InsertAnimation() {
  const frame = useCurrentFrame();

  const insertKey = frame >= 120 && frame < 240;
  const showNewEntry = frame >= 240;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 32 }}>插入操作 - 头插法</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 40, marginBottom: 40 }}>
        <div
          style={{
            padding: '20px 30px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 8,
            fontSize: 18,
            color: 'white',
          }}
        >
          <div style={{ marginBottom: 8 }}>
            插入 <span style={{ color: '#e94560', fontWeight: 'bold' }}>"email"</span>
          </div>
          <div style={{ color: '#a0a0a0', fontSize: 14 }}>
            h("email") = 6 % 4 = <span style={{ color: '#ff9800', fontWeight: 'bold' }}>2</span>
          </div>
        </div>

        {insertKey && (
          <div
            style={{
              padding: '16px 24px',
              background: '#e8f5e9',
              border: '3px solid #4caf50',
              borderRadius: 8,
              fontSize: 20,
              fontFamily: "'Courier New', monospace",
              animation: 'pulse 0.5s infinite',
            }}
          >
            <span style={{ color: '#1976d2', fontWeight: 600 }}>"email"</span>
            <span style={{ color: '#999', margin: '0 8px' }}>:</span>
            <span style={{ color: '#388e3c' }}>"e@test.com"</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* 桶2 原状态 */}
        <div
          style={{
            width: 200,
            minHeight: 150,
            background: '#fff3e0',
            border: '2px solid #ff9800',
            borderRadius: 8,
            padding: 16,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: '#ff9800',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              marginBottom: 12,
            }}
          >
            2
          </div>
          <div
            style={{
              padding: '8px 12px',
              background: 'white',
              border: '2px solid #2196f3',
              borderRadius: 4,
              fontSize: 14,
              fontFamily: "'Courier New', monospace",
            }}
          >
            <span style={{ color: '#1976d2' }}>"city"</span>
            <span style={{ color: '#999', margin: '0 4px' }}>:</span>
            <span style={{ color: '#388e3c' }}>"NYC"</span>
          </div>
        </div>

        {/* 箭头 */}
        <div style={{ display: 'flex', alignItems: 'center', color: '#4caf50', fontSize: 32 }}>
          →
        </div>

        {/* 桶2 新状态 */}
        <div
          style={{
            width: 200,
            minHeight: 150,
            background: '#e8f5e9',
            border: '3px solid #4caf50',
            borderRadius: 8,
            padding: 16,
            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: '#4caf50',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              marginBottom: 12,
            }}
          >
            2
          </div>
          {showNewEntry && (
            <div
              style={{
                padding: '8px 12px',
                background: '#c8e6c9',
                border: '2px solid #4caf50',
                borderRadius: 4,
                fontSize: 14,
                fontFamily: "'Courier New', monospace",
                marginBottom: 8,
                animation: 'slideIn 0.5s ease-out',
              }}
            >
              <span style={{ color: '#1976d2', fontWeight: 600 }}>"email"</span>
              <span style={{ color: '#999', margin: '0 4px' }}>:</span>
              <span style={{ color: '#388e3c' }}>"e@test.com"</span>
              <span style={{ marginLeft: 8, color: '#4caf50', fontSize: 12 }}>新!</span>
            </div>
          )}
          <div
            style={{
              padding: '8px 12px',
              background: 'white',
              border: '2px solid #2196f3',
              borderRadius: 4,
              fontSize: 14,
              fontFamily: "'Courier New', monospace",
              opacity: showNewEntry ? 1 : 0,
            }}
          >
            <span style={{ color: '#1976d2' }}>"city"</span>
            <span style={{ color: '#999', margin: '0 4px' }}>:</span>
            <span style={{ color: '#388e3c' }}>"NYC"</span>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 40,
          padding: 20,
          background: 'rgba(76, 175, 80, 0.2)',
          border: '2px solid #4caf50',
          borderRadius: 8,
          color: 'white',
        }}
      >
        <strong>新节点插入到链表头部</strong>，原有节点依次向后连接。
        这是 O(1) 时间复杂度的操作！
      </div>
    </div>
  );
}

export const SeparateChaining: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="链地址法"
          subtitle="解决哈希冲突的核心策略"
        />
      </Sequence>

      {/* 第二段: 什么是哈希冲突 */}
      <Sequence from={90} durationInFrames={210}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h1 style={{ fontSize: 48, color: '#e94560', margin: '0 0 24px 0' }}>
            哈希冲突
          </h1>
          <p style={{ fontSize: 26, color: '#ffffff', lineHeight: 1.6, maxWidth: 900 }}>
            不同的键经过哈希函数计算后，可能得到<strong style={{ color: '#ff9800' }}>相同的哈希值</strong>，
            这时就需要解决冲突。
          </p>
          <div
            style={{
              marginTop: 40,
              padding: 24,
              background: 'rgba(255, 152, 0, 0.2)',
              border: '2px solid #ff9800',
              borderRadius: 12,
            }}
          >
            <p style={{ color: 'white', fontSize: 20, margin: 0 }}>
              <strong>示例:</strong> 如果 h(key) = key.length % 4
            </p>
            <p style={{ color: '#a0a0a0', fontSize: 18, margin: '16px 0 0 0' }}>
              "age"(3) 和 "key"(3) 都会映射到<strong style={{ color: '#ff9800' }}>桶3</strong>
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 链地址法图示 */}
      <Sequence from={300} durationInFrames={540}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <CollisionDemo />
        </AbsoluteFill>
      </Sequence>

      {/* 第四段: 插入操作 */}
      <Sequence from={840} durationInFrames={540}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <InsertAnimation />
        </AbsoluteFill>
      </Sequence>

      {/* 第五段: 链地址法优势 */}
      <Sequence from={1380} durationInFrames={420}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ fontSize: 40, color: '#4caf50', marginBottom: 40 }}>链地址法的优势</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900 }}>
            {[
              { icon: '⚡', title: 'O(1) 插入', desc: '头插法直接插入链表头部' },
              { icon: '🎯', title: '删除简单', desc: '直接操作链表节点，无需探测' },
              { icon: '📈', title: '无负载限制', desc: '负载因子可以超过 1，不像开放地址法' },
              { icon: '💾', title: '内存效率', desc: '只在有冲突时才分配节点' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  padding: 20,
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 12,
                }}
              >
                <span style={{ fontSize: 36 }}>{item.icon}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 22, color: '#ffffff' }}>{item.title}</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: 16, color: '#a0a0a0' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default SeparateChaining;

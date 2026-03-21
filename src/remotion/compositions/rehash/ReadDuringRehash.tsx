/**
 * ReadDuringRehash
 * 视频时长: 10秒 (300帧 @ 30fps)
 * Rehash期间读操作 - 展示查找同时检查两个表
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 300;

function HashTableVisual({ label, color, buckets, highlightedBucket }: {
  label: string;
  color: string;
  buckets: number[];
  highlightedBucket: number | null;
}) {
  return (
    <div
      style={{
        padding: 20,
        background: 'rgba(255, 255, 255, 0.05)',
        border: `2px solid ${color}`,
        borderRadius: 12,
        minWidth: 200,
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: color,
          marginBottom: 16,
          textAlign: 'center',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {buckets.map((count, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              background: highlightedBucket === i ? `${color}40` : '#2a2a4a',
              border: highlightedBucket === i ? `2px solid ${color}` : '2px solid transparent',
              borderRadius: 4,
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ color: '#888', fontSize: 12 }}>桶 {i}</span>
            <span style={{ color: '#fff', fontSize: 14 }}>
              {count > 0 ? `${count} 个` : '空'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchPath({ step }: { step: number }) {
  const steps = [
    { text: '计算 hash(key)', color: '#2196f3' },
    { text: '查找 ht[0]', color: '#2196f3' },
    { text: '未找到 → 查找 ht[1]', color: '#ff9800' },
    { text: '找到! 返回结果', color: '#4caf50' },
  ];

  return (
    <div
      style={{
        padding: 20,
        background: '#1a1a2e',
        border: '2px solid #444',
        borderRadius: 8,
        minWidth: 220,
      }}
    >
      <div style={{ fontSize: 14, color: '#888', marginBottom: 12 }}>查找路径:</div>
      {steps.map((s, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: i < steps.length - 1 ? 12 : 0,
            opacity: i <= step ? 1 : 0.3,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: i <= step ? s.color : '#444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              color: 'white',
              fontWeight: 'bold',
              flexShrink: 0,
            }}
          >
            {i + 1}
          </div>
          <span
            style={{
              fontSize: 14,
              color: i <= step ? '#ffffff' : '#666',
            }}
          >
            {s.text}
          </span>
        </div>
      ))}
    </div>
  );
}

function AnimatedComponent() {
  const frame = useCurrentFrame();

  // 动画阶段:
  // 0-75: 开始查找，显示搜索路径步骤1
  // 75-150: 检查ht[0]步骤2
  // 150-225: 检查ht[1]步骤3
  // 225-300: 找到结果步骤4

  const phase = Math.floor(frame / 75);
  const highlightBucket = phase < 2 ? 2 : phase < 3 ? 5 : 2;

  // ht[0] 有数据，ht[1] 正在rehash
  const ht0Buckets = [0, 2, 1, 0, 3, 1, 0, 0];
  const ht1Buckets = [0, 0, 0, 0, 0, 2, 1, 0];

  return (
    <div style={{ padding: 48 }}>
      <h2 style={{ color: 'white', marginBottom: 32, fontSize: 28 }}>Rehash 期间的读操作</h2>

      <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginBottom: 32 }}>
        {/* ht[0] */}
        <HashTableVisual
          label="ht[0]"
          color="#2196f3"
          buckets={ht0Buckets}
          highlightedBucket={phase >= 1 && phase < 3 ? highlightBucket : null}
        />

        {/* Search path */}
        <SearchPath step={phase} />

        {/* ht[1] */}
        <HashTableVisual
          label="ht[1]"
          color="#ff9800"
          buckets={ht1Buckets}
          highlightedBucket={phase >= 2 ? highlightBucket : null}
        />
      </div>

      {/* Result */}
      <div
        style={{
          padding: 24,
          background: phase >= 3 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.05)',
          border: `2px solid ${phase >= 3 ? '#4caf50' : '#444'}`,
          borderRadius: 12,
          textAlign: 'center',
          margin: '0 auto',
          maxWidth: 400,
        }}
      >
        {phase < 3 ? (
          <div style={{ fontSize: 16, color: '#888' }}>查找中...</div>
        ) : (
          <div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#4caf50',
                marginBottom: 8,
              }}
            >
              找到键 "k5"
            </div>
            <div style={{ fontSize: 16, color: '#a0a0a0' }}>
              值: "value_5" (来自 ht[1])
            </div>
          </div>
        )}
      </div>

      {/* Explanation */}
      <div
        style={{
          marginTop: 32,
          padding: 20,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 8,
          maxWidth: 600,
          margin: '32px auto 0',
        }}
      >
        <div style={{ fontSize: 16, color: '#a0a0a0', lineHeight: 1.6, textAlign: 'center' }}>
          渐进式 Rehash 期间，读操作需要检查两个表，直到 Rehash 完成
        </div>
      </div>
    </div>
  );
}

export const ReadDuringRehash: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator title="Rehash期间读操作" subtitle="双重查找保证一致性" />
      </Sequence>
      <Sequence from={60} durationInFrames={TOTAL_FRAMES - 60}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <AnimatedComponent />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default ReadDuringRehash;

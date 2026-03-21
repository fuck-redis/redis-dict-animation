/**
 * WriteDuringRehash
 * 视频时长: 10秒 (300帧 @ 30fps)
 * Rehash期间写操作 - 展示写入操作如何写入ht[1]
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 300;

function HashTableVisual({ label, color, buckets, isTarget }: {
  label: string;
  color: string;
  buckets: number[];
  isTarget: boolean;
}) {
  return (
    <div
      style={{
        padding: 20,
        background: isTarget ? `${color}15` : 'rgba(255, 255, 255, 0.05)',
        border: `3px solid ${isTarget ? color : '#444'}`,
        borderRadius: 12,
        minWidth: 200,
        boxShadow: isTarget ? `0 0 20px ${color}40` : 'none',
        transition: 'all 0.3s ease',
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
        {isTarget && ' ⭐'}
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
              background: '#2a2a4a',
              borderRadius: 4,
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

function WriteProcess({ step, newKey, newValue }: {
  step: number;
  newKey: string;
  newValue: string;
}) {
  const steps = [
    { text: '计算 hash(key)', color: '#2196f3' },
    { text: '判断: 正在 Rehash', color: '#ff9800' },
    { text: '直接写入 ht[1]', color: '#4caf50' },
    { text: '写入成功!', color: '#4caf50' },
  ];

  return (
    <div
      style={{
        padding: 20,
        background: '#1a1a2e',
        border: '2px solid #444',
        borderRadius: 8,
        minWidth: 240,
      }}
    >
      <div style={{ fontSize: 14, color: '#888', marginBottom: 12 }}>写入过程:</div>
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

      {/* New entry preview */}
      {step >= 2 && (
        <div
          style={{
            marginTop: 16,
            padding: '12px 16px',
            background: 'rgba(76, 175, 80, 0.2)',
            border: '2px solid #4caf50',
            borderRadius: 6,
            fontFamily: "'Courier New', monospace",
            fontSize: 13,
          }}
        >
          <span style={{ color: '#1976d2' }}>"{newKey}"</span>
          <span style={{ color: '#888' }}>: </span>
          <span style={{ color: '#388e3c' }}>"{newValue}"</span>
        </div>
      )}
    </div>
  );
}

function AnimatedComponent() {
  const frame = useCurrentFrame();

  // 动画阶段:
  // 0-75: 开始写入
  // 75-150: 判断rehash状态
  // 150-225: 执行写入ht[1]
  // 225-300: 完成

  const phase = Math.floor(frame / 75);
  const newKey = 'k9';
  const newValue = 'value_9';

  // ht[0] 有数据，ht[1] 正在接收新写入
  const ht0Buckets = [0, 2, 1, 0, 3, 1, 0, 0];
  const ht1BucketsWithNew = [0, 0, 0, 0, 0, 2, 1, 1]; // 桶7多了新写入

  return (
    <div style={{ padding: 48 }}>
      <h2 style={{ color: 'white', marginBottom: 32, fontSize: 28 }}>Rehash 期间的写操作</h2>

      <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginBottom: 32 }}>
        {/* ht[0] - read only during rehash */}
        <HashTableVisual
          label="ht[0]"
          color="#2196f3"
          buckets={ht0Buckets}
          isTarget={false}
        />

        {/* Write process */}
        <WriteProcess step={phase} newKey={newKey} newValue={newValue} />

        {/* ht[1] - write target */}
        <HashTableVisual
          label="ht[1]"
          color="#ff9800"
          buckets={phase >= 3 ? ht1BucketsWithNew : ht0Buckets}
          isTarget={true}
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
          maxWidth: 500,
        }}
      >
        {phase < 3 ? (
          <div style={{ fontSize: 16, color: '#888' }}>写入中...</div>
        ) : (
          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#4caf50',
                marginBottom: 8,
              }}
            >
              写入成功!
            </div>
            <div style={{ fontSize: 14, color: '#a0a0a0' }}>
              新键 "{newKey}" 已直接写入 ht[1]
            </div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
              Rehash 期间的新写入总是进入 ht[1]
            </div>
          </div>
        )}
      </div>

      {/* Key insight */}
      <div
        style={{
          marginTop: 32,
          padding: 20,
          background: 'rgba(255, 152, 0, 0.1)',
          border: '2px solid #ff9800',
          borderRadius: 8,
          maxWidth: 600,
          margin: '32px auto 0',
        }}
      >
        <div style={{ fontSize: 16, color: '#ff9800', fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
          关键设计
        </div>
        <div style={{ fontSize: 14, color: '#a0a0a0', lineHeight: 1.6, textAlign: 'center' }}>
          Rehash 期间所有新写入都写入 ht[1]，而 ht[0] 只负责迁出数据
        </div>
      </div>
    </div>
  );
}

export const WriteDuringRehash: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator title="Rehash期间写操作" subtitle="新写入写入ht[1]" />
      </Sequence>
      <Sequence from={60} durationInFrames={TOTAL_FRAMES - 60}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <AnimatedComponent />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default WriteDuringRehash;

/**
 * NewTableAllocation
 * 视频时长: 8秒 (240帧 @ 30fps)
 * 创建新哈希表动画 - 展示ht[1]分配及大小为ht[0]的2倍
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 240;

function HashTableVisual({ size, label, color, isActive, entries }: {
  size: number;
  label: string;
  color: string;
  isActive: boolean;
  entries: string[];
}) {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        padding: 20,
        background: isActive ? `${color}20` : 'rgba(255,255,255,0.05)',
        border: `3px solid ${isActive ? color : '#444'}`,
        borderRadius: 12,
        opacity: isActive ? 1 : 0.5,
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: color,
          marginBottom: 16,
          textAlign: 'center',
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
        }}
      >
        {Array.from({ length: size }).map((_, i) => (
          <div
            key={i}
            style={{
              padding: '12px 8px',
              background: '#2a2a4a',
              borderRadius: 4,
              textAlign: 'center',
              fontSize: 12,
              color: '#888',
              fontFamily: "'Courier New', monospace",
            }}
          >
            {i}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: 14,
          color: '#a0a0a0',
          textAlign: 'center',
        }}
      >
        桶数量: {size}
      </div>
    </div>
  );
}

function AnimatedComponent() {
  const frame = useCurrentFrame();

  // Animation phases:
  // 0-60: Show ht[0] with 4 buckets
  // 60-120: Show new ht[1] allocation with 8 buckets
  // 120-180: Highlight the 2x relationship
  // 180-240: Summary

  const phase = Math.floor(frame / 60);
  const ht0Size = 4;
  const ht1Size = phase >= 1 ? 8 : 0;

  return (
    <div style={{ padding: 48 }}>
      <h2 style={{ color: 'white', marginBottom: 40, fontSize: 28 }}>创建新哈希表</h2>

      <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginBottom: 40 }}>
        {/* ht[0] */}
        <HashTableVisual
          size={ht0Size}
          label="ht[0] (源表)"
          color="#2196f3"
          isActive={true}
          entries={['k1', 'k2', 'k3', 'k4']}
        />

        {/* Arrow or relationship */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {phase >= 1 ? (
            <>
              <div style={{ fontSize: 48, color: '#4caf50' }}>→</div>
              <div
                style={{
                  padding: '8px 16px',
                  background: 'rgba(76, 175, 80, 0.2)',
                  borderRadius: 8,
                  fontSize: 14,
                  color: '#4caf50',
                }}
              >
                分配 ht[1]
              </div>
            </>
          ) : (
            <div style={{ fontSize: 14, color: '#666' }}>等待分配...</div>
          )}
        </div>

        {/* ht[1] */}
        <HashTableVisual
          size={ht1Size}
          label="ht[1] (目标表)"
          color="#ff9800"
          isActive={phase >= 1}
          entries={[]}
        />
      </div>

      {/* Size comparison */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 40,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            padding: '16px 32px',
            background: 'rgba(33, 150, 243, 0.2)',
            borderRadius: 8,
          }}
        >
          <div style={{ fontSize: 14, color: '#a0a0a0' }}>ht[0] 大小</div>
          <div style={{ fontSize: 28, fontWeight: 'bold', color: '#2196f3' }}>{ht0Size} 桶</div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 32,
            color: '#4caf50',
          }}
        >
          ×2
        </div>

        <div
          style={{
            padding: '16px 32px',
            background: phase >= 1 ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255,255,255,0.05)',
            borderRadius: 8,
            border: phase >= 1 ? '2px solid #ff9800' : '2px solid #444',
          }}
        >
          <div style={{ fontSize: 14, color: '#a0a0a0' }}>ht[1] 大小</div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: phase >= 1 ? '#ff9800' : '#666',
            }}
          >
            {ht1Size > 0 ? `${ht1Size} 桶` : '?'}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div
        style={{
          padding: 20,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 8,
          maxWidth: 700,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 18, color: '#ffffff', marginBottom: 8 }}>
          为什么是 2 倍?
        </div>
        <div style={{ fontSize: 14, color: '#a0a0a0', lineHeight: 1.6 }}>
          更大的扩展减少未来 rehash 次数，摊销每次扩容的成本
        </div>
      </div>
    </div>
  );
}

export const NewTableAllocation: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator title="创建新哈希表" subtitle="ht[1] 分配动画" />
      </Sequence>
      <Sequence from={60} durationInFrames={TOTAL_FRAMES - 60}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <AnimatedComponent />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default NewTableAllocation;

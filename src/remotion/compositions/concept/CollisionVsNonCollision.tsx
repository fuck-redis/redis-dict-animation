/**
 * CollisionVsNonCollision
 * 视频时长: 10秒 (300帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 300; // 10秒 * 30fps

function BucketDisplay({
  label,
  entries,
  highlight,
  delay,
}: {
  label: string;
  entries: { key: string; value: string; inChain: boolean }[];
  highlight: boolean;
  delay: number;
}) {
  const frame = useCurrentFrame();
  const opacity = interpolate(Math.max(0, frame - delay), [0, 20], [0, 1], { extrapolateLeft: 'clamp' });
  const scale = interpolate(Math.max(0, frame - delay), [0, 15], [0.8, 1], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        padding: 24,
        background: highlight ? 'rgba(244, 67, 54, 0.1)' : 'rgba(76, 175, 80, 0.1)',
        border: `3px solid ${highlight ? '#f44336' : '#4caf50'}`,
        borderRadius: 16,
        minWidth: 200,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: highlight ? '#f44336' : '#4caf50',
          marginBottom: 16,
          textAlign: 'center',
        }}
      >
        {label}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {entries.map((entry, i) => {
          const entryDelay = delay + 30 + i * 20;
          const entryOpacity = interpolate(Math.max(0, frame - entryDelay), [0, 15], [0, 1], { extrapolateLeft: 'clamp' });
          const entryTranslateX = interpolate(Math.max(0, frame - entryDelay), [0, 15], [-20, 0], { extrapolateLeft: 'clamp' });

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                opacity: entryOpacity,
                transform: `translateX(${entryTranslateX}px)`,
              }}
            >
              <div
                style={{
                  padding: '8px 12px',
                  background: entry.inChain ? 'rgba(255, 152, 0, 0.3)' : 'rgba(33, 150, 243, 0.3)',
                  border: `2px solid ${entry.inChain ? '#ff9800' : '#2196f3'}`,
                  borderRadius: 8,
                  fontFamily: "'Courier New', monospace",
                  fontSize: 13,
                }}
              >
                <span style={{ color: '#2196f3' }}>"{entry.key}"</span>
                <span style={{ color: '#888', margin: '0 4px' }}>→</span>
                <span style={{ color: '#4caf50' }}>"{entry.value}"</span>
              </div>
              {entry.inChain && (
                <div style={{ fontSize: 14, color: '#ff9800' }}>→</div>
              )}
            </div>
          );
        })}
      </div>

      {entries.length === 0 && (
        <div style={{ fontSize: 14, color: '#666', textAlign: 'center', fontStyle: 'italic' }}>
          (空桶)
        </div>
      )}
    </div>
  );
}

function PerformanceComparison({
  type,
  delay,
}: {
  type: 'collision' | 'no-collision';
  delay: number;
}) {
  const frame = useCurrentFrame();
  const opacity = interpolate(Math.max(0, frame - delay), [0, 20], [0, 1], { extrapolateLeft: 'clamp' });

  const isCollision = type === 'collision';
  const probeCount = isCollision ? '平均 2-3 次' : '1 次';
  const probeStyle = isCollision ? '#ff9800' : '#4caf50';

  return (
    <div
      style={{
        padding: 20,
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        opacity,
        minWidth: 180,
      }}
    >
      <div style={{ fontSize: 14, color: '#888', marginBottom: 12 }}>查找复杂度</div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: probeStyle,
          marginBottom: 8,
        }}
      >
        {probeCount}
      </div>
      <div
        style={{
          fontSize: 12,
          color: '#666',
          padding: '4px 8px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: 4,
          display: 'inline-block',
        }}
      >
        {isCollision ? 'O(n) 最坏情况' : 'O(1) 平均'}
      </div>
    </div>
  );
}

function SideBySideComparison() {
  const frame = useCurrentFrame();

  // 无冲突情况
  const noCollisionData = [
    { bucketIndex: 0, entries: [{ key: 'name', value: 'Alice', inChain: false }] },
    { bucketIndex: 1, entries: [] },
    { bucketIndex: 2, entries: [{ key: 'age', value: '30', inChain: false }] },
    { bucketIndex: 3, entries: [] },
    { bucketIndex: 4, entries: [{ key: 'city', value: 'NYC', inChain: false }] },
    { bucketIndex: 5, entries: [] },
    { bucketIndex: 6, entries: [] },
    { bucketIndex: 7, entries: [] },
  ];

  // 有冲突情况
  const collisionData = [
    { bucketIndex: 0, entries: [] },
    { bucketIndex: 1, entries: [{ key: 'name', value: 'Alice', inChain: false }] },
    { bucketIndex: 2, entries: [] },
    { bucketIndex: 3, entries: [{ key: 'age', value: '30', inChain: false }] },
    { bucketIndex: 4, entries: [{ key: 'name2', value: 'Bob', inChain: true }] },
    { bucketIndex: 5, entries: [] },
    { bucketIndex: 6, entries: [] },
    { bucketIndex: 7, entries: [] },
  ];

  return (
    <div style={{ display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap' }}>
      {/* 左侧：无冲突 */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(76, 175, 80, 0.2)',
            borderRadius: 8,
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 'bold', color: '#4caf50' }}>
            无冲突情况
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {noCollisionData.map((bucket) => (
            <BucketDisplay
              key={`no-${bucket.bucketIndex}`}
              label={`[${bucket.bucketIndex}]`}
              entries={bucket.entries}
              highlight={false}
              delay={bucket.bucketIndex * 15}
            />
          ))}
        </div>

        <PerformanceComparison type="no-collision" delay={120} />
      </div>

      {/* 右侧：有冲突 */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(244, 67, 54, 0.2)',
            borderRadius: 8,
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 'bold', color: '#f44336' }}>
            有冲突情况
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {collisionData.map((bucket) => (
            <BucketDisplay
              key={`col-${bucket.bucketIndex}`}
              label={`[${bucket.bucketIndex}]`}
              entries={bucket.entries}
              highlight={bucket.entries.some((e) => e.inChain)}
              delay={bucket.bucketIndex * 15}
            />
          ))}
        </div>

        <PerformanceComparison type="collision" delay={120} />
      </div>
    </div>
  );
}

function ChainVisualization() {
  const frame = useCurrentFrame();

  const entries = [
    { key: 'user:1', value: 'Alice' },
    { key: 'user:9', value: 'Bob' },
    { key: 'user:17', value: 'Charlie' },
  ];

  const bucketIndex = 1;

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          padding: '12px 24px',
          background: 'rgba(255, 152, 0, 0.2)',
          borderRadius: 8,
          marginBottom: 24,
          display: 'inline-block',
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 'bold', color: '#ff9800' }}>
          冲突链表示例
        </span>
      </div>

      <div style={{ marginBottom: 16, fontSize: 14, color: '#888' }}>
        桶 [{bucketIndex}] 中的冲突节点通过 next 指针链接
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        {entries.map((entry, i) => {
          const delay = i * 40;
          const opacity = interpolate(Math.max(0, frame - delay), [0, 20], [0, 1], { extrapolateLeft: 'clamp' });
          const translateX = interpolate(Math.max(0, frame - delay), [0, 20], [-30, 0], { extrapolateLeft: 'clamp' });

          return (
            <React.Fragment key={entry.key}>
              <div
                style={{
                  padding: '16px 20px',
                  background: 'rgba(255, 152, 0, 0.2)',
                  border: '2px solid #ff9800',
                  borderRadius: 12,
                  opacity,
                  transform: `translateX(${translateX}px)`,
                }}
              >
                <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>key</div>
                <div style={{ fontSize: 16, fontFamily: "'Courier New', monospace", color: '#2196f3' }}>
                  "{entry.key}"
                </div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 8, marginBottom: 4 }}>value</div>
                <div style={{ fontSize: 16, fontFamily: "'Courier New', monospace", color: '#4caf50' }}>
                  "{entry.value}"
                </div>
                {i < entries.length - 1 && (
                  <div style={{ fontSize: 12, color: '#ff9800', marginTop: 8 }}>
                    next →
                  </div>
                )}
              </div>
              {i < entries.length - 1 && (
                <div
                  style={{
                    fontSize: 32,
                    color: '#ff9800',
                    opacity: interpolate(frame - delay - 20, [0, 10], [0, 1], { extrapolateLeft: 'clamp' }),
                  }}
                >
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 24,
          padding: 16,
          background: 'rgba(76, 175, 80, 0.2)',
          borderRadius: 8,
          fontSize: 14,
          color: '#4caf50',
        }}
      >
        通过链表解决冲突：新元素插入到链表头部
      </div>
    </div>
  );
}

export const CollisionVsNonCollision: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* Sequence 1: Title */}
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="冲突 vs 无冲突"
          subtitle="哈希表性能的关键差异"
        />
      </Sequence>

      {/* Sequence 2: Side by Side Comparison */}
      <Sequence from={60} durationInFrames={150}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: '#ffffff', marginBottom: 32, fontSize: 28, textAlign: 'center' }}>
            同一哈希表，不同命运
          </h2>
          <SideBySideComparison />
        </AbsoluteFill>
      </Sequence>

      {/* Sequence 3: Chain Visualization */}
      <Sequence from={210} durationInFrames={90}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChainVisualization />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default CollisionVsNonCollision;

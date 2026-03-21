/**
 * 分布均匀性演示
 * 视频时长: 20秒 (600帧 @ 30fps)
 * 展示好哈希 vs 坏哈希的分布差异
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const TOTAL_FRAMES = 600; // 20秒

// 模拟数据
const TEST_KEYS = [
  'apple', 'banana', 'cherry', 'date', 'elderberry',
  'fig', 'grape', 'honeydew', 'kiwi', 'lemon',
  'mango', 'nectarine', 'orange', 'papaya', 'quince',
  'raspberry', 'strawberry', 'tangerine', 'watermelon', 'zucchini',
];

// 坏哈希函数: 只使用长度
function badHash(key: string, size: number): number {
  return key.length % size;
}

// 好哈希函数: DJB2
function goodHash(key: string, size: number): number {
  let hash = 5381;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) + hash) + key.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash) % size;
}

function BucketBar({
  count,
  maxCount,
  label,
  isHighlighted,
  color,
}: {
  count: number;
  maxCount: number;
  label: string;
  isHighlighted: boolean;
  color: string;
}) {
  const frame = useCurrentFrame();
  const heightPercent = interpolate(
    Math.min(frame / 20, 1),
    [0, 1],
    [0, count / maxCount],
    { extrapolateLeft: 'clamp' }
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 60,
      }}
    >
      <div
        style={{
          width: 40,
          height: 150,
          background: '#222',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${heightPercent * 100}%`,
            background: isHighlighted
              ? 'linear-gradient(180deg, #f44336, #ff5722)'
              : `linear-gradient(180deg, ${color}, ${color}88)`,
            transition: 'height 0.3s ease',
          }}
        />
        {isHighlighted && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              border: '3px solid #f44336',
              borderRadius: 4,
              animation: 'pulse 0.5s ease infinite',
            }}
          />
        )}
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 12,
          fontFamily: "'Courier New', monospace",
          color: isHighlighted ? '#f44336' : '#888',
          fontWeight: isHighlighted ? 'bold' : 'normal',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 11,
          color: isHighlighted ? '#f44336' : '#666',
        }}
      >
        {count} items
      </div>
    </div>
  );
}

function DistributionChart({
  type,
  phase,
}: {
  type: 'bad' | 'good';
  phase: number;
}) {
  const size = 8;
  const counts = Array.from({ length: size }, () => 0);
  const hashFunc = type === 'bad' ? badHash : goodHash;

  TEST_KEYS.forEach((key) => {
    const bucket = hashFunc(key, size);
    counts[bucket]++;
  });

  const maxCount = Math.max(...counts);
  const maxInPhase = phase < 2 ? 1 : maxCount;

  // 找出过载的桶
  const overloadedBuckets = counts
    .map((c, i) => ({ count: c, index: i }))
    .filter((x) => x.count > 2)
    .map((x) => x.index);

  return (
    <div
      style={{
        padding: 24,
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 12,
        border: `2px solid ${type === 'bad' ? '#f44336' : '#4caf50'}`,
      }}
    >
      <h3
        style={{
          margin: '0 0 24px 0',
          color: type === 'bad' ? '#f44336' : '#4caf50',
          fontSize: 22,
        }}
      >
        {type === 'bad' ? 'Bad Hash (length only)' : 'Good Hash (DJB2)'}
      </h3>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        {counts.map((count, i) => (
          <BucketBar
            key={i}
            count={phase >= 2 ? count : 0}
            maxCount={maxInPhase}
            label={`[${i}]`}
            isHighlighted={overloadedBuckets.includes(i)}
            color={type === 'bad' ? '#f44336' : '#4caf50'}
          />
        ))}
      </div>

      {type === 'bad' && (
        <div
          style={{
            marginTop: 20,
            padding: 12,
            background: 'rgba(244, 67, 54, 0.2)',
            border: '2px solid #f44336',
            borderRadius: 8,
            color: 'white',
            textAlign: 'center',
          }}
        >
          <strong>Clustering detected!</strong>
          <div style={{ fontSize: 12, color: '#a0a0a0', marginTop: 4 }}>
            Multiple keys in buckets 2, 4, 6
          </div>
        </div>
      )}

      {type === 'good' && (
        <div
          style={{
            marginTop: 20,
            padding: 12,
            background: 'rgba(76, 175, 80, 0.2)',
            border: '2px solid #4caf50',
            borderRadius: 8,
            color: 'white',
            textAlign: 'center',
          }}
        >
          <strong>Uniform distribution!</strong>
          <div style={{ fontSize: 12, color: '#a0a0a0', marginTop: 4 }}>
            Keys evenly spread across buckets
          </div>
        </div>
      )}
    </div>
  );
}

function MetricsPanel({ type }: { type: 'bad' | 'good' }) {
  const frame = useCurrentFrame();
  const showMetrics = frame >= 120;

  const metrics = type === 'bad'
    ? { variance: 'High (9.2)', collision: '60%', performance: 'O(N)' }
    : { variance: 'Low (1.8)', collision: '10%', performance: 'O(1)' };

  const opacity = interpolate(showMetrics ? Math.min((frame - 120) / 30, 1) : 0, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
        opacity,
        transition: 'opacity 0.3s ease',
      }}
    >
      {[
        { label: 'Variance', value: metrics.variance, color: type === 'bad' ? '#f44336' : '#4caf50' },
        { label: 'Collision Rate', value: metrics.collision, color: type === 'bad' ? '#f44336' : '#4caf50' },
        { label: 'Lookup', value: metrics.performance, color: type === 'bad' ? '#f44336' : '#4caf50' },
      ].map((metric) => (
        <div
          key={metric.label}
          style={{
            padding: 16,
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{metric.label}</div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: metric.color,
              fontFamily: "'Courier New', monospace",
            }}
          >
            {metric.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export const DistributionUniformityDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const phase = Math.floor(frame / 150);

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="分布均匀性"
          subtitle="好哈希 vs 坏哈希"
        />
      </Sequence>

      {/* 第二段: 坏哈希函数 */}
      <Sequence from={90} durationInFrames={210}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: '#f44336', marginBottom: 16 }}>坏哈希函数的问题</h2>
          <p style={{ color: '#a0a0a0', marginBottom: 24, fontSize: 16 }}>
            h(key) = key.length % size
          </p>

          <DistributionChart type="bad" phase={phase} />

          <div style={{ marginTop: 24 }}>
            <MetricsPanel type="bad" />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 好哈希函数 */}
      <Sequence from={300} durationInFrames={210}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: '#4caf50', marginBottom: 16 }}>好哈希函数的分布</h2>
          <p style={{ color: '#a0a0a0', marginBottom: 24, fontSize: 16 }}>
            DJB2 - 使用所有字符计算哈希值
          </p>

          <DistributionChart type="good" phase={phase >= 2 ? 2 : 1} />

          <div style={{ marginTop: 24 }}>
            <MetricsPanel type="good" />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第四段: 总结 */}
      <Sequence from={510} durationInFrames={90}>
        <SceneNarrator
          title="选择好的哈希函数"
          subtitle="Redis 使用 SipHash 保证分布均匀"
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export default DistributionUniformityDemo;

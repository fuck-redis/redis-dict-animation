/**
 * 自动扩容与收缩
 * 视频时长: 15秒 (450帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const FPS = 30;
const TOTAL_FRAMES = 450; // 15秒

interface BucketVisualProps {
  index: number;
  entryCount: number;
  x: number;
  y: number;
  isHighlighted: boolean;
}

function BucketVisual({ index, entryCount, x, y, isHighlighted }: BucketVisualProps) {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 60,
        height: 60,
        background: isHighlighted
          ? '#fff9c4'
          : entryCount === 0
          ? 'rgba(250, 250, 250, 0.1)'
          : entryCount === 1
          ? 'rgba(76, 175, 80, 0.3)'
          : entryCount >= 2
          ? 'rgba(255, 87, 34, 0.3)'
          : 'rgba(33, 150, 243, 0.3)',
        border: `2px solid ${
          isHighlighted ? '#ffc107' : entryCount === 0 ? '#666' : entryCount === 1 ? '#4caf50' : '#ff5722'
        }`,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 'bold',
          color: isHighlighted ? '#ffc107' : '#fff',
          marginBottom: 2,
        }}
      >
        {index}
      </div>
      {entryCount > 0 && (
        <div
          style={{
            fontSize: 14,
            fontWeight: 'bold',
            color: entryCount >= 2 ? '#ff5722' : '#4caf50',
          }}
        >
          {entryCount}
        </div>
      )}
    </div>
  );
}

function LoadFactorBar({ loadFactor, threshold }: { loadFactor: number; threshold: number }) {
  const frame = useCurrentFrame();

  const getColor = (lf: number) => {
    if (lf < 0.5) return '#4caf50';
    if (lf < threshold) return '#ff9800';
    return '#f44336';
  };

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ color: '#a0a0a0', fontSize: 16 }}>负载因子 (Load Factor)</span>
        <span style={{ color: getColor(loadFactor), fontSize: 18, fontWeight: 'bold' }}>
          {(loadFactor * 100).toFixed(0)}%
        </span>
      </div>
      <div
        style={{
          height: 24,
          background: '#333',
          borderRadius: 12,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${loadFactor * 100}%`,
            background: getColor(loadFactor),
            transition: 'width 0.5s ease',
          }}
        />
        {/* 阈值线 */}
        <div
          style={{
            position: 'absolute',
            left: `${threshold * 100}%`,
            top: 0,
            bottom: 0,
            width: 3,
            background: '#fff',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <span style={{ color: '#666', fontSize: 12 }}>0%</span>
        <span style={{ color: '#666', fontSize: 12 }}>阈值: {(threshold * 100).toFixed(0)}%</span>
        <span style={{ color: '#666', fontSize: 12 }}>100%</span>
      </div>
    </div>
  );
}

function ExpandDemo() {
  const frame = useCurrentFrame();

  // 扩容演示
  // 从 4 个桶开始，随着负载因子升高，扩容到 8 个桶

  const phase = Math.floor(frame / 90);

  const getStats = () => {
    switch (phase) {
      case 0:
        return { size: 4, used: 1, capacity: 4 };
      case 1:
        return { size: 4, used: 2, capacity: 4 };
      case 2:
        return { size: 4, used: 3, capacity: 4 };
      case 3:
        return { size: 8, used: 4, capacity: 8 };
      default:
        return { size: 8, used: 4, capacity: 8 };
    }
  };

  const stats = getStats();
  const loadFactor = stats.used / stats.capacity;

  // 模拟数据分布
  const getBuckets = () => {
    if (phase === 0) {
      return [1, 0, 0, 0];
    } else if (phase === 1) {
      return [1, 1, 0, 0];
    } else if (phase === 2) {
      return [1, 1, 1, 0];
    } else {
      return [1, 1, 1, 1, 0, 0, 0, 0];
    }
  };

  const buckets = getBuckets();
  const isExpanding = phase === 3;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: '#4caf50', marginBottom: 24 }}>扩容 (Expand)</h2>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            padding: '12px 20px',
            background: 'rgba(76, 175, 80, 0.2)',
            border: '2px solid #4caf50',
            borderRadius: 8,
            color: 'white',
            fontSize: 16,
          }}
        >
          条件: 负载因子 {'>'} 100%
        </div>

        {isExpanding && (
          <div
            style={{
              padding: '12px 20px',
              background: 'rgba(255, 152, 0, 0.2)',
              border: '2px solid #ff9800',
              borderRadius: 8,
              color: '#ff9800',
              fontSize: 16,
              animation: 'pulse 0.5s infinite',
            }}
          >
            扩容中! 容量: 4 → 8
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 32 }}>
        <div>
          <div style={{ color: '#a0a0a0', marginBottom: 12 }}>
            容量: <span style={{ color: '#fff', fontWeight: 'bold' }}>{stats.capacity}</span>
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              width: phase >= 3 ? 320 : 280,
              transition: 'width 0.5s ease',
            }}
          >
            {buckets.map((count, i) => (
              <BucketVisual
                key={i}
                index={i}
                entryCount={count}
                x={0}
                y={0}
                isHighlighted={false}
              />
            ))}
          </div>
        </div>
      </div>

      <LoadFactorBar loadFactor={loadFactor} threshold={1.0} />
    </div>
  );
}

function ShrinkDemo() {
  const frame = useCurrentFrame();

  // 收缩演示
  // 从 8 个桶开始，随着负载因子降低，收缩到 4 个桶

  const phase = Math.floor((frame - 60) / 90);

  const getStats = () => {
    switch (phase) {
      case 0:
        return { size: 8, used: 1, capacity: 8 };
      case 1:
        return { size: 8, used: 2, capacity: 8 };
      case 2:
        return { size: 8, used: 1, capacity: 8 };
      case 3:
        return { size: 4, used: 1, capacity: 4 };
      default:
        return { size: 4, used: 1, capacity: 4 };
    }
  };

  const stats = getStats();
  const loadFactor = stats.used / stats.capacity;

  const getBuckets = () => {
    if (phase <= 1) {
      return [1, 0, 0, 0, 0, 0, 0, 0];
    } else if (phase === 2) {
      return [1, 0, 0, 0, 0, 0, 0, 0];
    } else {
      return [1, 0, 0, 0];
    }
  };

  const buckets = getBuckets();
  const isShrinking = phase === 3;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: '#2196f3', marginBottom: 24 }}>收缩 (Shrink)</h2>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            padding: '12px 20px',
            background: 'rgba(33, 150, 243, 0.2)',
            border: '2px solid #2196f3',
            borderRadius: 8,
            color: 'white',
            fontSize: 16,
          }}
        >
          条件: 负载因子 {'<'} 10% 且 容量 {'>'} 4
        </div>

        {isShrinking && (
          <div
            style={{
              padding: '12px 20px',
              background: 'rgba(255, 152, 0, 0.2)',
              border: '2px solid #ff9800',
              borderRadius: 8,
              color: '#ff9800',
              fontSize: 16,
              animation: 'pulse 0.5s infinite',
            }}
          >
            收缩中! 容量: 8 → 4
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 32 }}>
        <div>
          <div style={{ color: '#a0a0a0', marginBottom: 12 }}>
            容量: <span style={{ color: '#fff', fontWeight: 'bold' }}>{stats.capacity}</span>
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              width: phase >= 3 ? 280 : 560,
              transition: 'width 0.5s ease',
            }}
          >
            {buckets.map((count, i) => (
              <BucketVisual
                key={i}
                index={i}
                entryCount={count}
                x={0}
                y={0}
                isHighlighted={false}
              />
            ))}
          </div>
        </div>
      </div>

      <LoadFactorBar loadFactor={loadFactor} threshold={0.1} />
    </div>
  );
}

export const AutoResizeFeature: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="自动扩容与收缩"
          subtitle="负载因子驱动的动态调整"
        />
      </Sequence>

      {/* 第二段: 扩容演示 */}
      <Sequence from={90} durationInFrames={180}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <ExpandDemo />
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 收缩演示 */}
      <Sequence from={270} durationInFrames={180}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <ShrinkDemo />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default AutoResizeFeature;

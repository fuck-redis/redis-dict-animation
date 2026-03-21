/**
 * 为什么需要 Rehash
 * 视频时长: 45秒 (1350帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const FPS = 30;
const TOTAL_FRAMES = 1350; // 45秒

function LoadFactorDemo() {
  const frame = useCurrentFrame();
  const loadFactor = interpolate(frame, [0, 300], [0.3, 1.2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const buckets = 8;
  const filledBuckets = Math.floor(loadFactor * buckets);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 32 }}>负载因子与性能</h2>

      {/* 负载因子显示 */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 72, fontWeight: 'bold', color: loadFactor > 1 ? '#f44336' : '#4caf50' }}>
            {(loadFactor * 100).toFixed(0)}%
          </span>
          <span style={{ fontSize: 24, color: '#a0a0a0' }}>负载因子</span>
        </div>
        <div style={{ fontSize: 18, color: '#a0a0a0', marginTop: 8 }}>
          已使用 / 哈希表大小 = {Math.floor(loadFactor * buckets)} / {buckets}
        </div>
      </div>

      {/* 哈希表可视化 */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
        {Array.from({ length: buckets }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 60,
              height: 60,
              background: i < filledBuckets ? '#2196f3' : '#333',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              transition: 'background 0.3s ease',
              boxShadow: i < filledBuckets ? '0 4px 12px rgba(33, 150, 243, 0.4)' : 'none',
            }}
          >
            {i}
          </div>
        ))}
      </div>

      {/* 性能指示器 */}
      <div
        style={{
          padding: 20,
          background: loadFactor > 1 ? 'rgba(244, 67, 54, 0.2)' : 'rgba(76, 175, 80, 0.2)',
          border: `2px solid ${loadFactor > 1 ? '#f44336' : '#4caf50'}`,
          borderRadius: 8,
          color: 'white',
        }}
      >
        <strong style={{ fontSize: 20 }}>
          {loadFactor < 0.5 && '性能优秀 - 平均查找次数 < 1.2'}
          {loadFactor >= 0.5 && loadFactor < 0.75 && '性能良好 - 平均查找次数 1.2-1.5'}
          {loadFactor >= 0.75 && loadFactor < 1 && '性能一般 - 平均查找次数 1.5-2'}
          {loadFactor >= 1 && '性能下降 - 平均查找次数 > 2'}
        </strong>
      </div>
    </div>
  );
}

function ProblemDemo() {
  const frame = useCurrentFrame();
  const showProblem = frame >= 180;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: '#f44336', marginBottom: 32 }}>一次性 Rehash 的问题</h2>

      <div style={{ display: 'flex', gap: 32, marginBottom: 40 }}>
        {/* 大数据量 */}
        <div
          style={{
            padding: 24,
            background: 'rgba(244, 67, 54, 0.1)',
            border: '2px solid #f44336',
            borderRadius: 12,
            width: 300,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <div style={{ fontSize: 24, color: 'white', marginBottom: 8 }}>百万级键值对</div>
          <div style={{ color: '#a0a0a0' }}>
            大型 Redis 实例可能拥有数百万个键
          </div>
        </div>

        {/* 箭头 */}
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 48, color: '#f44336' }}>
          →
        </div>

        {/* 阻塞 */}
        <div
          style={{
            padding: 24,
            background: 'rgba(244, 67, 54, 0.2)',
            border: '3px solid #f44336',
            borderRadius: 12,
            width: 300,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏰</div>
          <div style={{ fontSize: 24, color: 'white', marginBottom: 8 }}>长时间阻塞</div>
          <div style={{ color: '#a0a0a0' }}>
            一次性迁移可能导致秒级甚至分钟级阻塞
          </div>
        </div>
      </div>

      {showProblem && (
        <div
          style={{
            padding: 24,
            background: 'rgba(255, 152, 0, 0.2)',
            border: '2px solid #ff9800',
            borderRadius: 8,
            color: 'white',
            fontSize: 18,
          }}
        >
          <strong style={{ color: '#ff9800' }}>对于需要 7x24 运行的服务来说</strong>
          <p style={{ margin: '12px 0 0 0', color: '#a0a0a0' }}>
            这是不可接受的。用户请求会堆积，服务可能完全无响应。
          </p>
        </div>
      )}
    </div>
  );
}

export const WhyRehash: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="为什么需要 Rehash？"
          subtitle="理解哈希表扩容的必要性"
        />
      </Sequence>

      {/* 第二段: 负载因子 */}
      <Sequence from={90} durationInFrames={390}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <LoadFactorDemo />
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 问题 */}
      <Sequence from={480} durationInFrames={540}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <ProblemDemo />
        </AbsoluteFill>
      </Sequence>

      {/* 第四段: 解决方案预览 */}
      <Sequence from={1020} durationInFrames={330}>
        <SceneNarrator
          title="渐进式 Rehash"
          subtitle="Redis 的解决方案"
          text="Redis 采用渐进式 Rehash，将迁移工作分散到多次操作中，保证服务始终可用，用户感知不到 rehash 过程。"
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export default WhyRehash;

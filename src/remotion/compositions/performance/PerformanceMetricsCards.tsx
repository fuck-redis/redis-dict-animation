/**
 * Performance Metrics Cards
 * 视频时长: 15秒 (450帧 @ 30fps)
 * 显示4个关键性能指标的动画卡片
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const TOTAL_FRAMES = 450; // 15秒

const METRICS = [
  {
    id: 'throughput',
    label: '吞吐量',
    unit: 'ops/sec',
    value: 125000,
    displayValue: '125K',
    color: '#4caf50',
    description: '每秒操作数',
    icon: '\u26A1',
  },
  {
    id: 'latency',
    label: '延迟',
    unit: 'ms',
    value: 0.35,
    displayValue: '0.35',
    color: '#2196f3',
    description: '平均响应时间',
    icon: '\u23F1',
  },
  {
    id: 'memory',
    label: '内存',
    unit: 'MB',
    value: 64,
    displayValue: '64',
    color: '#ff9800',
    description: '已使用内存',
    icon: '\u{1F4BE}',
  },
  {
    id: 'loadFactor',
    label: '负载因子',
    unit: '',
    value: 0.65,
    displayValue: '0.65',
    color: '#9c27b0',
    description: '填充程度',
    icon: '\u{1F4CA}',
  },
];

function MetricCard({ metric, index }: { metric: typeof METRICS[0]; index: number }) {
  const frame = useCurrentFrame();
  const delay = index * 60;
  const opacity = interpolate(Math.max(0, frame - delay), [0, 30], [0, 1], { extrapolateLeft: 'clamp' });
  const scale = interpolate(Math.max(0, frame - delay), [0, 30], [0.8, 1], { extrapolateLeft: 'clamp' });
  const translateY = interpolate(Math.max(0, frame - delay), [0, 30], [30, 0], { extrapolateLeft: 'clamp' });

  // Animate the value counting up
  const valueProgress = interpolate(Math.max(0, frame - delay - 30), [0, 60], [0, 1], { extrapolateLeft: 'clamp' });

  const animatedValue = metric.id === 'throughput'
    ? Math.round(metric.value * valueProgress).toLocaleString()
    : metric.id === 'memory'
      ? Math.round(metric.value * valueProgress)
      : (metric.value * valueProgress).toFixed(2);

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 28,
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        border: `2px solid ${metric.color}40`,
        boxShadow: `0 8px 32px ${metric.color}20`,
      }}
    >
      {/* Icon and Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <span style={{ fontSize: 28 }}>{metric.icon}</span>
        <span style={{ fontSize: 16, color: '#a0a0a0', fontWeight: 500 }}>{metric.label}</span>
      </div>

      {/* Value Display */}
      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 48, fontWeight: 'bold', color: metric.color, fontFamily: "'Courier New', monospace" }}>
          {animatedValue}
        </span>
        <span style={{ fontSize: 20, color: '#a0a0a0', marginLeft: 8 }}>{metric.unit}</span>
      </div>

      {/* Description */}
      <div style={{ fontSize: 14, color: '#666' }}>{metric.description}</div>

      {/* Decorative bottom bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 16,
          right: 16,
          height: 4,
          background: `linear-gradient(90deg, ${metric.color}, ${metric.color}40)`,
          borderRadius: '0 0 8px 8px',
        }}
      />
    </div>
  );
}

function AnimatedBackground() {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
      }}
    >
      {/* Animated gradient orbs */}
      {[...Array(3)].map((_, i) => {
        const delay = i * 100;
        const x = interpolate(Math.max(0, frame - delay), [0, 300], [0, 1920], { extrapolateLeft: 'clamp' }) % 1920;
        const y = interpolate(Math.max(0, frame - delay), [0, 400], [0, 1080], { extrapolateLeft: 'clamp' }) % 1080;
        const opacity = interpolate(Math.max(0, frame - delay), [0, 150, 300], [0, 0.1, 0], { extrapolateLeft: 'clamp' });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - 200,
              top: y - 200,
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${
                i === 0 ? '#4caf5020' : i === 1 ? '#2196f320' : '#ff980020'
              } 0%, transparent 70%)`,
              opacity,
            }}
          />
        );
      })}
    </div>
  );
}

export const PerformanceMetricsCards: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <AnimatedBackground />

      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="性能指标"
          subtitle="Redis Dict 核心监控指标"
        />
      </Sequence>

      {/* 第二段: 指标卡片 */}
      <Sequence from={90} durationInFrames={360}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ fontSize: 32, color: 'white', margin: '0 0 40px 0' }}>关键性能指标</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 24,
              maxWidth: 1000,
              margin: '0 auto',
            }}
          >
            {METRICS.map((metric, i) => (
              <div key={metric.id} style={{ position: 'relative' }}>
                <MetricCard metric={metric} index={i} />
              </div>
            ))}
          </div>

          {/* Summary footer */}
          <div
            style={{
              marginTop: 40,
              padding: 20,
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 12,
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: 16, color: '#a0a0a0' }}>
              这些指标共同决定了 Redis Dict 的整体性能表现
            </span>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default PerformanceMetricsCards;

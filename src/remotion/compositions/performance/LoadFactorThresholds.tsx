/**
 * Load Factor Thresholds
 * 视频时长: 20秒 (600帧 @ 30fps)
 * 展示4个负载因子阈值状态
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const TOTAL_FRAMES = 600; // 20秒

const THRESHOLDS = [
  {
    range: '0 - 0.5',
    label: '安全',
    color: '#4caf50',
    status: '优秀',
    probes: '< 1.2',
    collisionRate: '< 10%',
    description: '负载较低，性能最佳',
    recommendation: '继续监控，无需操作',
  },
  {
    range: '0.5 - 0.75',
    label: '正常',
    color: '#2196f3',
    status: '良好',
    probes: '1.2 - 1.5',
    collisionRate: '10% - 20%',
    description: '负载正常，运行稳定',
    recommendation: '保持监控，准备扩展',
  },
  {
    range: '0.75 - 1.0',
    label: '警告',
    color: '#ff9800',
    status: '一般',
    probes: '1.5 - 2.0',
    collisionRate: '20% - 35%',
    description: '负载较高，需要关注',
    recommendation: '开始准备 Rehash',
  },
  {
    range: '> 1.0',
    label: '危险',
    color: '#f44336',
    status: '严重',
    probes: '> 2.0',
    collisionRate: '> 35%',
    description: '负载过高，性能下降',
    recommendation: '立即执行 Rehash',
  },
];

function ThresholdMeter({ activeIndex }: { activeIndex: number }) {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 32,
        marginBottom: 32,
      }}
    >
      <h3 style={{ color: 'white', margin: '0 0 24px 0', fontSize: 20 }}>负载因子状态</h3>

      {/* Meter bar */}
      <div style={{ position: 'relative', height: 40, marginBottom: 16 }}>
        {/* Background gradient bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 20,
            borderRadius: 10,
            background: `linear-gradient(90deg,
              ${THRESHOLDS[0].color} 0%,
              ${THRESHOLDS[1].color} 33%,
              ${THRESHOLDS[2].color} 66%,
              ${THRESHOLDS[3].color} 100%)`,
            opacity: 0.3,
          }}
        />

        {/* Active indicator */}
        {THRESHOLDS.map((threshold, i) => {
          const position = (i / 3) * 100;
          const isActive = i === activeIndex;
          const opacity = isActive ? 1 : 0.3;
          const scale = isActive ? 1.2 : 1;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${position}%`,
                top: 0,
                width: 4,
                height: 20,
                background: threshold.color,
                opacity,
                transform: `scaleX(${scale})`,
                transition: 'all 0.3s ease',
              }}
            />
          );
        })}

        {/* Threshold labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 12, color: '#a0a0a0' }}>0</span>
          <span style={{ fontSize: 12, color: '#a0a0a0' }}>0.5</span>
          <span style={{ fontSize: 12, color: '#a0a0a0' }}>0.75</span>
          <span style={{ fontSize: 12, color: '#a0a0a0' }}>1.0</span>
          <span style={{ fontSize: 12, color: '#a0a0a0' }}>1.5+</span>
        </div>
      </div>

      {/* Active state label */}
      <div
        style={{
          textAlign: 'center',
          padding: '12px 24px',
          background: THRESHOLDS[activeIndex].color,
          borderRadius: 8,
          display: 'inline-block',
          width: '100%',
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
          {THRESHOLDS[activeIndex].label} - {THRESHOLDS[activeIndex].status}
        </span>
      </div>
    </div>
  );
}

function ThresholdCard({ threshold, index, isActive }: { threshold: typeof THRESHOLDS[0]; index: number; isActive: boolean }) {
  const frame = useCurrentFrame();
  const delay = index * 40;
  const opacity = interpolate(Math.max(0, frame - delay), [0, 25], [0, 1], { extrapolateLeft: 'clamp' });
  const translateX = interpolate(Math.max(0, frame - delay), [0, 25], [30, 0], { extrapolateLeft: 'clamp' });
  const borderWidth = isActive ? 3 : 0;

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 20,
        opacity,
        transform: `translateX(${translateX}px)`,
        border: `${borderWidth}px solid ${threshold.color}`,
        boxShadow: isActive ? `0 0 20px ${threshold.color}40` : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h4 style={{ margin: 0, fontSize: 18, color: threshold.color }}>{threshold.label}</h4>
          <span style={{ fontSize: 14, color: '#a0a0a0' }}>{threshold.range}</span>
        </div>
        <div
          style={{
            padding: '4px 12px',
            background: `${threshold.color}33`,
            borderRadius: 12,
            fontSize: 12,
            color: threshold.color,
            fontWeight: 'bold',
          }}
        >
          {threshold.status}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>查找次数</div>
          <div style={{ fontSize: 18, color: threshold.color, fontWeight: 'bold' }}>{threshold.probes}</div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>冲突率</div>
          <div style={{ fontSize: 18, color: threshold.color, fontWeight: 'bold' }}>{threshold.collisionRate}</div>
        </div>
      </div>

      <div style={{ marginTop: 12, fontSize: 13, color: '#a0a0a0' }}>
        {threshold.description}
      </div>

      <div
        style={{
          marginTop: 12,
          padding: '8px 12px',
          background: `${threshold.color}15`,
          borderRadius: 6,
          fontSize: 13,
          color: threshold.color,
        }}
      >
        \u2192 {threshold.recommendation}
      </div>
    </div>
  );
}

export const LoadFactorThresholds: React.FC = () => {
  const frame = useCurrentFrame();

  // Determine which threshold is active based on frame
  const activeIndex = Math.min(3, Math.floor(frame / 150));

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="负载因子阈值"
          subtitle="性能状态的晴雨表"
        />
      </Sequence>

      {/* 第二段: 阈值概览 */}
      <Sequence from={90} durationInFrames={150}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ fontSize: 36, color: '#e94560', margin: '0 0 32px 0' }}>负载因子阈值分析</h2>

          <ThresholdMeter activeIndex={activeIndex} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {THRESHOLDS.map((threshold, i) => (
              <ThresholdCard key={i} threshold={threshold} index={i} isActive={i === activeIndex} />
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 详细说明 */}
      <Sequence from={240} durationInFrames={360}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ fontSize: 32, color: 'white', margin: '0 0 32px 0' }}>各阈值详解</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            {THRESHOLDS.map((threshold, i) => (
              <ThresholdCard key={i} threshold={threshold} index={i} isActive={true} />
            ))}
          </div>

          <div
            style={{
              marginTop: 32,
              padding: 24,
              background: 'rgba(233, 69, 96, 0.1)',
              border: '2px solid #e94560',
              borderRadius: 12,
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', color: '#e94560', fontSize: 20 }}>关键结论</h3>
            <p style={{ margin: 0, fontSize: 16, color: '#ffffff', lineHeight: 1.6 }}>
              负载因子是衡量哈希表性能的核心指标。保持负载因子在 <strong style={{ color: '#4caf50' }}>0.5 以下</strong>
              可以获得最佳性能，但考虑到内存效率，<strong style={{ color: '#2196f3' }}>0.5 - 0.75</strong>
              是生产环境的推荐范围。一旦负载因子超过 <strong style={{ color: '#ff9800' }}>0.75</strong>，
             就应该开始准备 Rehash 操作。
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default LoadFactorThresholds;

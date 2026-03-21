/**
 * LoadFactorGauge
 * 视频时长: 10秒 (300帧 @ 30fps)
 * 负载因子仪表盘动画 - 展示负载因子从0到1+的变化过程
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 300;

function GaugeNeedle({ angle }: { angle: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        width: 4,
        height: 120,
        background: 'linear-gradient(180deg, #e94560 0%, #ff6b6b 100%)',
        borderRadius: 2,
        left: '50%',
        bottom: '50%',
        transformOrigin: 'bottom center',
        transform: `translateX(-50%) rotate(${angle}deg)`,
      }}
    />
  );
}

function Gauge() {
  const frame = useCurrentFrame();
  const loadFactor = interpolate(frame, [0, 300], [0, 1.2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 将负载因子映射到角度 (-90度到90度)
  const angle = interpolate(loadFactor, [0, 1.5], [-90, 90], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 颜色变化
  const getColor = (lf: number) => {
    if (lf < 0.5) return colors.success;
    if (lf < 0.75) return colors.primary;
    if (lf < 1.0) return colors.warning;
    return colors.danger;
  };

  const gaugeColor = getColor(loadFactor);

  // 刻度
  const ticks = [
    { value: 0, label: '0' },
    { value: 0.25, label: '0.25' },
    { value: 0.5, label: '0.5' },
    { value: 0.75, label: '0.75' },
    { value: 1.0, label: '1.0' },
    { value: 1.25, label: '1.25' },
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: 300,
        height: 180,
      }}
    >
      {/* 弧形背景 */}
      <svg width="300" height="180" viewBox="0 0 300 180">
        {/* 背景弧 */}
        <path
          d="M 30 150 A 120 120 0 0 1 270 150"
          fill="none"
          stroke="#2a2a4a"
          strokeWidth="20"
          strokeLinecap="round"
        />
        {/* 彩色弧 */}
        <path
          d="M 30 150 A 120 120 0 0 1 270 150"
          fill="none"
          stroke={`url(#gaugeGradient)`}
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={`${(loadFactor / 1.5) * 188} 188`}
        />
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.success} />
            <stop offset="40%" stopColor={colors.primary} />
            <stop offset="70%" stopColor={colors.warning} />
            <stop offset="100%" stopColor={colors.danger} />
          </linearGradient>
        </defs>
      </svg>

      {/* 刻度线和标签 */}
      {ticks.map((tick, i) => {
        const tickAngle = -90 + (tick.value / 1.5) * 180;
        const rad = (tickAngle * Math.PI) / 180;
        const x = 150 + 100 * Math.cos(rad);
        const y = 150 + 100 * Math.sin(rad);
        const labelX = 150 + 130 * Math.cos(rad);
        const labelY = 150 + 130 * Math.sin(rad);

        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute',
                width: 2,
                height: 10,
                background: tick.value <= loadFactor ? gaugeColor : '#666',
                left: x - 1,
                top: y - 5,
                transform: `rotate(${tickAngle + 90}deg)`,
                transformOrigin: 'center center',
              }}
            />
            <div
              style={{
                position: 'absolute',
                fontSize: 10,
                color: '#a0a0a0',
                left: labelX - 10,
                top: labelY - 5,
              }}
            >
              {tick.label}
            </div>
          </React.Fragment>
        );
      })}

      {/* 指针 */}
      <GaugeNeedle angle={angle} />

      {/* 中心圆 */}
      <div
        style={{
          position: 'absolute',
          width: 20,
          height: 20,
          background: gaugeColor,
          borderRadius: '50%',
          left: 140,
          top: 140,
        }}
      />

      {/* 数值显示 */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 32,
          fontWeight: 'bold',
          color: gaugeColor,
        }}
      >
        {loadFactor.toFixed(2)}
      </div>
    </div>
  );
}

function HashTableBuckets({ fillLevel }: { fillLevel: number }) {
  const frame = useCurrentFrame();
  const totalBuckets = 20;
  const filledBuckets = Math.floor(totalBuckets * fillLevel);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <div style={{ fontSize: 16, color: '#a0a0a0', marginBottom: 8 }}>哈希表示例</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: 440, justifyContent: 'center' }}>
        {Array.from({ length: totalBuckets }, (_, i) => {
          const isFilled = i < filledBuckets;
          const isAnimating = i === filledBuckets - 1;

          return (
            <div
              key={i}
              style={{
                width: 18,
                height: 18,
                background: isFilled
                  ? interpolate(frame, [i * 10, i * 10 + 15], [0, 1], { extrapolateLeft: 'clamp' }) > 0.5
                    ? colors.primary
                    : colors.primaryLight
                  : colors.bucketEmpty,
                border: `1px solid ${isFilled ? colors.primary : colors.border}`,
                borderRadius: 4,
                transition: 'background 0.3s ease',
              }}
            />
          );
        })}
      </div>
      <div style={{ fontSize: 14, color: '#a0a0a0', marginTop: 8 }}>
        {filledBuckets} / {totalBuckets} 个桶已使用
      </div>
    </div>
  );
}

function StatusIndicators() {
  const frame = useCurrentFrame();
  const loadFactor = interpolate(frame, [0, 300], [0, 1.2], { extrapolateLeft: 'clamp' });

  const indicators = [
    { label: '冲突概率', value: `${Math.min(100, Math.round(loadFactor * 80))}%`, color: loadFactor > 0.75 ? colors.danger : colors.warning },
    { label: '平均链长度', value: loadFactor.toFixed(2), color: colors.primary },
    { label: '查找复杂度', value: loadFactor < 0.5 ? 'O(1)' : loadFactor < 1.0 ? 'O(1)~O(N)' : 'O(N)', color: loadFactor > 1.0 ? colors.danger : colors.success },
  ];

  return (
    <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
      {indicators.map((item, i) => (
        <div
          key={i}
          style={{
            padding: 16,
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 12,
            minWidth: 140,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 14, color: '#a0a0a0' }}>{item.label}</div>
          <div style={{ fontSize: 24, color: item.color, fontWeight: 'bold', marginTop: 4 }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}

function AnimatedComponent() {
  const frame = useCurrentFrame();
  const loadFactor = interpolate(frame, [0, 300], [0, 1.2], { extrapolateLeft: 'clamp' });

  return (
    <div style={{ padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ fontSize: 36, color: colors.primary, textAlign: 'center', marginBottom: 8 }}>
        负载因子仪表盘
      </h2>
      <p style={{ fontSize: 20, color: '#a0a0a0', textAlign: 'center', marginBottom: 32 }}>
        实时监控哈希表的填充程度
      </p>

      <Gauge />

      <div
        style={{
          marginTop: 32,
          padding: 24,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 12,
          width: '100%',
          maxWidth: 500,
        }}
      >
        <div style={{ fontSize: 18, color: colors.primary, marginBottom: 16, textAlign: 'center' }}>
          负载因子 = 已使用槽位数 / 总槽位数
        </div>
        <div style={{ fontSize: 16, color: '#a0a0a0', textAlign: 'center' }}>
          当前: {Math.round(loadFactor * 100)}% 填充
        </div>
      </div>

      <HashTableBuckets fillLevel={loadFactor} />
      <StatusIndicators />

      <div
        style={{
          marginTop: 32,
          padding: 16,
          background: loadFactor > 1.0 ? 'rgba(244, 67, 54, 0.2)' : loadFactor > 0.75 ? 'rgba(255, 152, 0, 0.2)' : 'rgba(76, 175, 80, 0.2)',
          border: `2px solid ${loadFactor > 1.0 ? colors.danger : loadFactor > 0.75 ? colors.warning : colors.success}`,
          borderRadius: 12,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 18, color: loadFactor > 1.0 ? colors.danger : loadFactor > 0.75 ? colors.warning : colors.success, fontWeight: 'bold' }}>
          {loadFactor < 0.5
            ? '状态: 优秀 - 低冲突，高性能'
            : loadFactor < 0.75
            ? '状态: 良好 - 正常运行'
            : loadFactor < 1.0
            ? '状态: 警告 - 准备扩展'
            : '状态: 危险 - 必须立即扩展!'}
        </div>
      </div>
    </div>
  );
}

export const LoadFactorGauge: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="负载因子"
          subtitle="哈希表健康的晴雨表"
        />
      </Sequence>
      <Sequence from={60} durationInFrames={TOTAL_FRAMES - 60}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <AnimatedComponent />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default LoadFactorGauge;

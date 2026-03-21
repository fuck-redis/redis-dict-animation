/**
 * OptimalLoadFactor
 * 视频时长: 8秒 (240帧 @ 30fps)
 * 最佳负载因子选择 - 展示为什么1.0是最佳平衡点
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 240;

function TradeoffChart() {
  const frame = useCurrentFrame();

  // 模拟不同负载因子下的内存使用和速度
  const loadFactors = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5];
  const memoryUsage = loadFactors.map(lf => lf * 100); // 内存使用百分比
  const speed = loadFactors.map(lf => Math.max(20, 100 - lf * 50)); // 速度百分比

  return (
    <div
      style={{
        display: 'flex',
        gap: 32,
        justifyContent: 'center',
        marginTop: 24,
      }}
    >
      {/* 内存使用 */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 16, color: colors.primary, marginBottom: 12, fontWeight: 'bold' }}>
          内存使用
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
          {loadFactors.map((lf, i) => {
            const delay = i * 20;
            const height = interpolate(Math.max(0, frame - delay), [0, 30], [0, memoryUsage[i]], { extrapolateLeft: 'clamp' });
            const isOptimal = lf === 1.0;

            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: 36,
                    height: `${height}%`,
                    background: isOptimal
                      ? `linear-gradient(180deg, ${colors.success} 0%, ${colors.success}88 100%)`
                      : `linear-gradient(180deg, ${colors.primary} 0%, ${colors.primary}88 100%)`,
                    borderRadius: '4px 4px 0 0',
                    minHeight: 4,
                    border: isOptimal ? `2px solid ${colors.success}` : 'none',
                  }}
                />
                <div style={{ fontSize: 10, color: '#a0a0a0', marginTop: 4 }}>{lf}</div>
                <div style={{ fontSize: 9, color: isOptimal ? colors.success : '#666' }}>{memoryUsage[i]}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 速度 */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 16, color: colors.success, marginBottom: 12, fontWeight: 'bold' }}>
          查找速度
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
          {loadFactors.map((lf, i) => {
            const delay = i * 20;
            const height = interpolate(Math.max(0, frame - delay), [0, 30], [0, speed[i]], { extrapolateLeft: 'clamp' });
            const isOptimal = lf === 1.0;

            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: 36,
                    height: `${height}%`,
                    background: isOptimal
                      ? `linear-gradient(180deg, ${colors.success} 0%, ${colors.success}88 100%)`
                      : `linear-gradient(180deg, ${colors.success}88 0%, ${colors.success}44 100%)`,
                    borderRadius: '4px 4px 0 0',
                    minHeight: 4,
                    border: isOptimal ? `2px solid ${colors.success}` : 'none',
                  }}
                />
                <div style={{ fontSize: 10, color: '#a0a0a0', marginTop: 4 }}>{lf}</div>
                <div style={{ fontSize: 9, color: isOptimal ? colors.success : '#666' }}>{speed[i]}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LoadFactorComparison() {
  const frame = useCurrentFrame();

  const comparisons = [
    {
      lf: '0.5',
      memory: '50%',
      speed: '高',
      collisions: '低',
      verdict: '浪费内存',
      color: colors.primary,
    },
    {
      lf: '1.0',
      memory: '100%',
      speed: '最佳',
      collisions: '中等',
      verdict: '最佳平衡点!',
      color: colors.success,
    },
    {
      lf: '1.5',
      memory: '150%',
      speed: '低',
      collisions: '高',
      verdict: '性能严重下降',
      color: colors.danger,
    },
  ];

  const activeIndex = Math.min(2, Math.floor(frame / 70));

  return (
    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 32 }}>
      {comparisons.map((comp, i) => {
        const isActive = i === activeIndex;
        const showVerdict = i === activeIndex && frame % 70 > 50;

        return (
          <div
            key={i}
            style={{
              padding: 20,
              background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
              border: `2px solid ${isActive ? comp.color : 'transparent'}`,
              borderRadius: 12,
              minWidth: 140,
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ fontSize: 24, color: comp.color, fontWeight: 'bold', textAlign: 'center' }}>
              LF = {comp.lf}
            </div>
            <div style={{ marginTop: 12, fontSize: 13, color: '#a0a0a0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>内存:</span>
                <span style={{ color: 'white' }}>{comp.memory}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>速度:</span>
                <span style={{ color: comp.speed === '最佳' ? colors.success : comp.speed === '高' ? colors.primary : colors.danger }}>
                  {comp.speed}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>冲突:</span>
                <span style={{ color: comp.collisions === '低' ? colors.success : comp.collisions === '中等' ? colors.warning : colors.danger }}>
                  {comp.collisions}
                </span>
              </div>
            </div>
            {showVerdict && (
              <div
                style={{
                  marginTop: 12,
                  padding: '8px 12px',
                  background: `${comp.color}22`,
                  borderRadius: 6,
                  textAlign: 'center',
                  fontSize: 14,
                  color: comp.color,
                  fontWeight: 'bold',
                }}
              >
                {comp.verdict}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function OptimalExplanation() {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [180, 200], [0, 1], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        marginTop: 32,
        padding: 24,
        background: 'rgba(76, 175, 80, 0.2)',
        border: `2px solid ${colors.success}`,
        borderRadius: 12,
        textAlign: 'center',
        opacity,
      }}
    >
      <div style={{ fontSize: 24, color: colors.success, fontWeight: 'bold', marginBottom: 8 }}>
        为什么选择 LF = 1.0?
      </div>
      <div style={{ fontSize: 16, color: '#a0a0a0', lineHeight: 1.6 }}>
        <div>• 充分利用内存，避免空间浪费</div>
        <div>• 保持查找性能在可接受范围</div>
        <div>• 平衡内存效率和查找速度</div>
        <div style={{ marginTop: 8, color: colors.warning }}>
          Redis 默认使用 LF = 1.0 作为触发 rehash 的阈值
        </div>
      </div>
    </div>
  );
}

function AnimatedComponent() {
  const frame = useCurrentFrame();

  return (
    <div style={{ padding: 48 }}>
      <h2 style={{ fontSize: 36, color: colors.success, textAlign: 'center', marginBottom: 8 }}>
        最佳负载因子选择
      </h2>
      <p style={{ fontSize: 20, color: '#a0a0a0', textAlign: 'center', marginBottom: 24 }}>
        在内存使用和查找速度之间找到平衡点
      </p>

      {/* 负载因子范围指示 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(33, 150, 243, 0.2)',
            border: `2px solid ${colors.primary}`,
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 14, color: colors.primary }}>低 (0.5)</div>
          <div style={{ fontSize: 12, color: '#a0a0a0' }}>省内存</div>
        </div>
        <div style={{ fontSize: 24, color: '#666', display: 'flex', alignItems: 'center' }}>→</div>
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(76, 175, 80, 0.2)',
            border: `3px solid ${colors.success}`,
            borderRadius: 8,
            textAlign: 'center',
            transform: 'scale(1.1)',
          }}
        >
          <div style={{ fontSize: 14, color: colors.success, fontWeight: 'bold' }}>1.0</div>
          <div style={{ fontSize: 12, color: colors.success }}>最佳平衡</div>
        </div>
        <div style={{ fontSize: 24, color: '#666', display: 'flex', alignItems: 'center' }}>→</div>
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(244, 67, 54, 0.2)',
            border: `2px solid ${colors.danger}`,
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 14, color: colors.danger }}>高 (1.5+)</div>
          <div style={{ fontSize: 12, color: '#a0a0a0' }}>高性能下降</div>
        </div>
      </div>

      <TradeoffChart />
      <LoadFactorComparison />

      {frame > 180 && <OptimalExplanation />}
    </div>
  );
}

export const OptimalLoadFactor: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="最佳负载因子"
          subtitle="内存与速度的权衡"
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

export default OptimalLoadFactor;

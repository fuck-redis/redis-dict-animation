/**
 * RehashTriggerCondition
 * 视频时长: 10秒 (300帧 @ 30fps)
 * 触发条件判断动画 - 展示负载因子如何触发rehash
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 300;

function LoadFactorMeter({ value, label }: { value: number; label: string }) {
  const frame = useCurrentFrame();
  const animatedValue = interpolate(frame, [0, 60], [0, value], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const isHigh = animatedValue > 1;

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 18, color: '#a0a0a0', marginBottom: 12 }}>{label}</div>
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: '#2a2a4a',
          border: `4px solid ${isHigh ? '#f44336' : '#2196f3'}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          boxShadow: isHigh ? '0 0 20px rgba(244, 67, 54, 0.5)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 'bold', color: isHigh ? '#f44336' : '#ffffff' }}>
          {animatedValue.toFixed(2)}
        </div>
        <div style={{ fontSize: 12, color: '#888' }}>负载因子</div>
      </div>
    </div>
  );
}

function ConditionCheck({ isTriggered }: { isTriggered: boolean }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        opacity,
        padding: '20px 32px',
        background: isTriggered ? 'rgba(244, 67, 54, 0.2)' : 'rgba(76, 175, 80, 0.2)',
        border: `2px solid ${isTriggered ? '#f44336' : '#4caf50'}`,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: isTriggered ? '#f44336' : '#4caf50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
        }}
      >
        {isTriggered ? '!' : '✓'}
      </div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 'bold', color: isTriggered ? '#f44336' : '#4caf50' }}>
          {isTriggered ? '触发 Rehash!' : '无需 Rehash'}
        </div>
        <div style={{ fontSize: 14, color: '#a0a0a0' }}>
          {isTriggered ? '负载因子 > 1.0，需要扩容' : '负载因子 <= 1.0'}
        </div>
      </div>
    </div>
  );
}

function AnimatedComponent() {
  const frame = useCurrentFrame();

  // Phase 1: 0-90 frames - 负载因子上升
  // Phase 2: 90-180 frames - 超过阈值触发
  // Phase 3: 180-240 frames - 稳定在触发状态

  const phase = Math.floor(frame / 90);
  const loadFactorValue = phase === 0 ? 0.5 + (frame / 90) * 0.5 : phase === 1 ? 1 + ((frame - 90) / 90) * 0.5 : 1.5;
  const isTriggered = loadFactorValue > 1;

  return (
    <div style={{ padding: 48 }}>
      <h2 style={{ color: 'white', marginBottom: 40, fontSize: 28 }}>Rehash 触发条件</h2>

      <div style={{ display: 'flex', gap: 60, justifyContent: 'center', alignItems: 'flex-start' }}>
        {/* 负载因子仪表 */}
        <LoadFactorMeter value={loadFactorValue} label="当前负载因子" />

        {/* 阈值指示器 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              padding: '16px 24px',
              background: 'rgba(33, 150, 243, 0.2)',
              border: '2px solid #2196f3',
              borderRadius: 8,
            }}
          >
            <div style={{ fontSize: 14, color: '#a0a0a0' }}>扩容阈值</div>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#2196f3' }}>load_factor {'>'} 1</div>
          </div>

          <div
            style={{
              padding: '16px 24px',
              background: 'rgba(255, 152, 0, 0.2)',
              border: '2px solid #ff9800',
              borderRadius: 8,
            }}
          >
            <div style={{ fontSize: 14, color: '#a0a0a0' }}>缩容阈值</div>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff9800' }}>load_factor {'<'} 0.1</div>
          </div>
        </div>

        {/* 条件判断结果 */}
        <ConditionCheck isTriggered={isTriggered} />
      </div>

      {/* 底部说明 */}
      <div
        style={{
          marginTop: 48,
          padding: 20,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 8,
          maxWidth: 800,
          margin: '48px auto 0',
        }}
      >
        <div style={{ fontSize: 16, color: '#a0a0a0', lineHeight: 1.6 }}>
          负载因子 = 键数量 / 桶数量
          <br />
          当负载因子超过1.0时，说明平均每个桶超过1个键，冲突增多，需要扩容到更大的哈希表
        </div>
      </div>
    </div>
  );
}

export const RehashTriggerCondition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator title="触发条件判断" subtitle="何时需要扩容？" />
      </Sequence>
      <Sequence from={60} durationInFrames={TOTAL_FRAMES - 60}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <AnimatedComponent />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default RehashTriggerCondition;

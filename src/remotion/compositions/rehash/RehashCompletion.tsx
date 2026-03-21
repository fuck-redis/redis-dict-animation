/**
 * RehashCompletion
 * 视频时长: 10秒 (300帧 @ 30fps)
 * 完成并切换动画 - 展示ht[1]成为ht[0]，新的ht[1]=NULL
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 300;

function PointerBox({ label, pointsTo, color }: {
  label: string;
  pointsTo: string;
  color: string;
}) {
  const frame = useCurrentFrame();
  const isNull = pointsTo === 'NULL';

  return (
    <div
      style={{
        padding: 16,
        background: '#2a2a4a',
        border: `2px solid ${color}`,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          padding: '4px 12px',
          background: color,
          borderRadius: 4,
          fontSize: 14,
          fontWeight: 'bold',
          color: 'white',
        }}
      >
        {label}
      </div>
      <div style={{ color: '#888' }}>→</div>
      <div
        style={{
          padding: '4px 12px',
          background: isNull ? 'rgba(244, 67, 54, 0.2)' : `${color}30`,
          border: `2px solid ${isNull ? '#f44336' : color}`,
          borderRadius: 4,
          fontSize: 14,
          fontWeight: 'bold',
          color: isNull ? '#f44336' : '#ffffff',
          fontFamily: "'Courier New', monospace",
        }}
      >
        {pointsTo}
      </div>
    </div>
  );
}

function DictStructure() {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        padding: 24,
        background: '#1a1a2e',
        border: '2px solid #444',
        borderRadius: 12,
        display: 'inline-block',
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 16, textAlign: 'center' }}>
        dict 结构
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <PointerBox label="ht[0]" pointsTo="哈希表对象" color="#2196f3" />
        <PointerBox label="ht[1]" pointsTo="NULL" color="#ff9800" />
        <div
          style={{
            padding: '8px 12px',
            background: '#333',
            borderRadius: 4,
            fontSize: 13,
            color: '#888',
          }}
        >
          rehashidx: 0 → -1
        </div>
      </div>
    </div>
  );
}

function SwapAnimation() {
  const frame = useCurrentFrame();
  const swapProgress = interpolate(frame, [60, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 32,
        opacity: swapProgress > 0 && swapProgress < 1 ? 1 : 0,
        transform: `scale(${0.9 + swapProgress * 0.1})`,
        transition: 'opacity 0.3s ease',
      }}
    >
      <div
        style={{
          padding: '16px 24px',
          background: 'rgba(33, 150, 243, 0.2)',
          border: '2px solid #2196f3',
          borderRadius: 8,
          fontSize: 16,
          color: '#2196f3',
          fontWeight: 'bold',
        }}
      >
        旧 ht[1]
      </div>
      <div style={{ fontSize: 36, color: '#4caf50' }}>↔</div>
      <div
        style={{
          padding: '16px 24px',
          background: 'rgba(76, 175, 80, 0.2)',
          border: '2px solid #4caf50',
          borderRadius: 8,
          fontSize: 16,
          color: '#4caf50',
          fontWeight: 'bold',
        }}
      >
        新 ht[0]
      </div>
    </div>
  );
}

function AnimatedComponent() {
  const frame = useCurrentFrame();

  // 阶段划分:
  // 0-60: 展示完成迁移后的状态
  // 60-150: 交换动画
  // 150-240: 释放旧ht[0]
  // 240-300: 最终状态

  const phase = Math.floor(frame / 75);

  return (
    <div style={{ padding: 48 }}>
      <h2 style={{ color: 'white', marginBottom: 40, fontSize: 28 }}>Rehash 完成与切换</h2>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
        {/* 交换动画 */}
        <SwapAnimation />

        {/* 状态展示 */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            alignItems: 'center',
            padding: 32,
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 12,
          }}
        >
          {/* Before */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#a0a0a0',
                marginBottom: 12,
              }}
            >
              {phase < 2 ? '交换前' : '交换后'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  padding: '8px 16px',
                  background: phase >= 2 ? 'rgba(76, 175, 80, 0.3)' : 'rgba(33, 150, 243, 0.3)',
                  border: `2px solid ${phase >= 2 ? '#4caf50' : '#2196f3'}`,
                  borderRadius: 6,
                  fontSize: 14,
                  color: '#ffffff',
                }}
              >
                ht[0]: 4桶 (满)
              </div>
              <div
                style={{
                  padding: '8px 16px',
                  background: phase >= 2 ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.3)',
                  border: `2px solid #ff9800`,
                  borderRadius: 6,
                  fontSize: 14,
                  color: '#ffffff',
                }}
              >
                ht[1]: 8桶 (满)
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div style={{ fontSize: 36, color: '#4caf50' }}>→</div>

          {/* Dict */}
          <DictStructure />

          {/* Arrow */}
          <div style={{ fontSize: 36, color: '#4caf50' }}>→</div>

          {/* Result */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#4caf50',
                marginBottom: 12,
              }}
            >
              最终状态
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  padding: '8px 16px',
                  background: 'rgba(76, 175, 80, 0.3)',
                  border: '2px solid #4caf50',
                  borderRadius: 6,
                  fontSize: 14,
                  color: '#4caf50',
                  fontWeight: 'bold',
                }}
              >
                ht[0]: 8桶 (新)
              </div>
              <div
                style={{
                  padding: '8px 16px',
                  background: 'rgba(244, 67, 54, 0.2)',
                  border: '2px solid #f44336',
                  borderRadius: 6,
                  fontSize: 14,
                  color: '#f44336',
                }}
              >
                ht[1]: NULL
              </div>
            </div>
          </div>
        </div>

        {/* 操作步骤 */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            marginTop: 16,
          }}
        >
          {[
            { step: 1, text: 'ht[1] → ht[0]', active: phase >= 0 },
            { step: 2, text: '释放旧ht[0]', active: phase >= 1 },
            { step: 3, text: '新建空ht[1]', active: phase >= 2 },
            { step: 4, text: 'rehashidx = -1', active: phase >= 3 },
          ].map((item) => (
            <div
              key={item.step}
              style={{
                padding: '12px 20px',
                background: item.active ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${item.active ? '#4caf50' : '#444'}`,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: item.active ? '#4caf50' : '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {item.step}
              </div>
              <span
                style={{
                  fontSize: 14,
                  color: item.active ? '#4caf50' : '#888',
                }}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const RehashCompletion: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator title="完成并切换" subtitle="Rehash 收尾步骤" />
      </Sequence>
      <Sequence from={60} durationInFrames={TOTAL_FRAMES - 60}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <AnimatedComponent />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default RehashCompletion;

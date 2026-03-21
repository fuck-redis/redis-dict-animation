/**
 * HashFunctionDeterminism
 * 视频时长: 8秒 (240帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 240; // 8秒 * 30fps

// 模拟哈希函数
function simulateHash(input: string, seed: number = 0): number {
  let hash = 5381 + seed;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash) + input.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function HashBox({
  label,
  value,
  hashResult,
  color,
  delay,
  showHash,
}: {
  label: string;
  value: string;
  hashResult: string;
  color: string;
  delay: number;
  showHash: boolean;
}) {
  const frame = useCurrentFrame();

  const opacity = interpolate(Math.max(0, frame - delay), [0, 20], [0, 1], { extrapolateLeft: 'clamp' });
  const translateY = interpolate(Math.max(0, frame - delay), [0, 20], [20, 0], { extrapolateLeft: 'clamp' });
  const hashOpacity = showHash ? interpolate(frame - delay, [30, 50], [0, 1], { extrapolateLeft: 'clamp' }) : 0;

  return (
    <div
      style={{
        padding: '20px 28px',
        background: `rgba(${color}, 0.15)`,
        border: `3px solid ${color}`,
        borderRadius: 12,
        textAlign: 'center',
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>{label}</div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          fontFamily: "'Courier New', monospace",
          color: 'white',
          marginBottom: 8,
        }}
      >
        "{value}"
      </div>
      {showHash && (
        <div
          style={{
            fontSize: 14,
            color: color,
            fontFamily: "'Courier New', monospace",
            opacity: hashOpacity,
            padding: '8px 12px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 6,
          }}
        >
          hash → {hashResult}
        </div>
      )}
    </div>
  );
}

function SameInputArrow() {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: '16px 24px',
        background: 'rgba(76, 175, 80, 0.2)',
        borderRadius: 12,
        border: '2px solid #4caf50',
      }}
    >
      <div style={{ fontSize: 18, color: '#4caf50', fontWeight: 'bold' }}>
        相同输入
      </div>
      <div style={{ fontSize: 32, color: '#4caf50' }}>➜</div>
      <div style={{ fontSize: 18, color: '#4caf50', fontWeight: 'bold' }}>
        相同输出
      </div>
    </div>
  );
}

function MultipleCallsDemo() {
  const frame = useCurrentFrame();
  const key = 'username';

  const call1Opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp' });
  const call2Opacity = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: 'clamp' });
  const call3Opacity = interpolate(frame, [120, 150], [0, 1], { extrapolateLeft: 'clamp' });
  const resultOpacity = interpolate(frame, [150, 180], [0, 1], { extrapolateLeft: 'clamp' });

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 24, color: '#e94560', marginBottom: 24, fontWeight: 'bold' }}>
        多次调用，同一结果
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <div style={{ opacity: call1Opacity, transform: `translateY(${interpolate(call1Opacity, [0, 1], [20, 0])}px)` }}>
          <div style={{ fontSize: 16, color: '#888', marginBottom: 8 }}>第 1 次调用</div>
          <div style={{ fontSize: 20, color: 'white', fontFamily: "'Courier New', monospace" }}>
            hash("username") = 0xA3F7
          </div>
        </div>

        <div style={{ opacity: call2Opacity, transform: `translateY(${interpolate(call2Opacity, [0, 1], [20, 0])}px)` }}>
          <div style={{ fontSize: 16, color: '#888', marginBottom: 8 }}>第 2 次调用</div>
          <div style={{ fontSize: 20, color: 'white', fontFamily: "'Courier New', monospace" }}>
            hash("username") = 0xA3F7
          </div>
        </div>

        <div style={{ opacity: call3Opacity, transform: `translateY(${interpolate(call3Opacity, [0, 1], [20, 0])}px)` }}>
          <div style={{ fontSize: 16, color: '#888', marginBottom: 8 }}>第 3 次调用</div>
          <div style={{ fontSize: 20, color: 'white', fontFamily: "'Courier New', monospace" }}>
            hash("username") = 0xA3F7
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 32,
          padding: 16,
          background: 'rgba(76, 175, 80, 0.2)',
          borderRadius: 12,
          opacity: resultOpacity,
          transform: `translateY(${interpolate(resultOpacity, [0, 1], [20, 0])}px)`,
        }}
      >
        <div style={{ fontSize: 18, color: '#4caf50', fontWeight: 'bold' }}>
          确定性 (Determinism)
        </div>
        <div style={{ fontSize: 14, color: '#a0a0a0', marginTop: 8 }}>
          相同的输入永远产生相同的输出，这是哈希表正确性的基础
        </div>
      </div>
    </div>
  );
}

function DifferentKeysDemo() {
  const frame = useCurrentFrame();

  const keys = [
    { key: 'username', hash: '0xA3F7', color: '233, 69, 96' },
    { key: 'password', hash: '0x7E2B', color: '255, 152, 0' },
    { key: 'email', hash: '0xC4D9', color: '76, 175, 80' },
    { key: 'id', hash: '0x1F8A', color: '33, 150, 243' },
  ];

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 24, color: '#ff9800', marginBottom: 24, fontWeight: 'bold' }}>
        不同输入，不同输出
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, maxWidth: 700, margin: '0 auto' }}>
        {keys.map((item, i) => {
          const delay = i * 30;
          const opacity = interpolate(Math.max(0, frame - delay), [0, 20], [0, 1], { extrapolateLeft: 'clamp' });
          const translateY = interpolate(Math.max(0, frame - delay), [0, 20], [30, 0], { extrapolateLeft: 'clamp' });

          return (
            <div
              key={item.key}
              style={{
                padding: '16px 24px',
                background: `rgba(${item.color}, 0.15)`,
                border: `2px solid rgba(${item.color}, 0.6)`,
                borderRadius: 12,
                opacity,
                transform: `translateY(${translateY}px)`,
              }}
            >
              <div style={{ fontSize: 16, color: 'white', fontFamily: "'Courier New', monospace" }}>
                "{item.key}"
              </div>
              <div style={{ fontSize: 14, color: `rgba(${item.color}, 0.9)`, marginTop: 8 }}>
                → {item.hash}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 24,
          padding: 16,
          background: 'rgba(255, 152, 0, 0.2)',
          borderRadius: 12,
        }}
      >
        <div style={{ fontSize: 14, color: '#a0a0a0' }}>
          即使输入相似（如 "user1", "user2"），哈希值也可能完全不同
        </div>
      </div>
    </div>
  );
}

export const HashFunctionDeterminism: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* Sequence 1: Title */}
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="哈希函数确定性"
          subtitle="相同输入 → 相同输出"
        />
      </Sequence>

      {/* Sequence 2: Concept Explanation */}
      <Sequence from={60} durationInFrames={90}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SameInputArrow />

          <div style={{ marginTop: 48 }}>
            <HashBox
              label="输入"
              value="username"
              hashResult="0xA3F7"
              color="233, 69, 96"
              delay={0}
              showHash={true}
            />
          </div>

          <div
            style={{
              marginTop: 32,
              padding: 16,
              background: 'rgba(33, 150, 243, 0.2)',
              borderRadius: 8,
              fontSize: 16,
              color: '#64b5f6',
              maxWidth: 600,
              textAlign: 'center',
            }}
          >
            哈希函数是确定性的，这是哈希表能够正确查找数据的前提
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Sequence 3: Multiple Calls */}
      <Sequence from={150} durationInFrames={90}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <MultipleCallsDemo />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default HashFunctionDeterminism;

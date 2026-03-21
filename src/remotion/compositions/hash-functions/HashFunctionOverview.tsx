/**
 * 哈希函数概述
 * 视频时长: 40秒 (1200帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const FPS = 30;
const TOTAL_FRAMES = 1200; // 40秒

const HASH_FUNCTIONS = [
  { id: 'siphash', name: 'SipHash', desc: 'Redis 默认，抗哈希洪水攻击', speed: 3, security: 5, color: '#4caf50' },
  { id: 'djb2', name: 'DJB2', desc: '简单快速，分布一般', speed: 5, security: 1, color: '#2196f3' },
  { id: 'fnv1a', name: 'FNV-1a', desc: '分布良好，速度快', speed: 5, security: 2, color: '#ff9800' },
  { id: 'murmur3', name: 'MurmurHash3', desc: '分布优秀，非加密', speed: 4, security: 2, color: '#9c27b0' },
];

function RatingBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 16,
            height: 16,
            background: i < value ? color : '#333',
            borderRadius: 2,
            transition: 'background 0.2s ease',
          }}
        />
      ))}
    </div>
  );
}

function HashFunctionCard({ func, index }: { func: typeof HASH_FUNCTIONS[0]; index: number }) {
  const frame = useCurrentFrame();
  const delay = index * 30;
  const opacity = interpolate(Math.max(0, frame - delay), [0, 20], [0, 1], { extrapolateLeft: 'clamp' });
  const translateY = interpolate(Math.max(0, frame - delay), [0, 20], [20, 0], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        padding: 20,
        background: 'rgba(255, 255, 255, 0.05)',
        border: '2px solid #333',
        borderRadius: 12,
        marginBottom: 16,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <span style={{ fontSize: 24, fontWeight: 'bold', color: func.color }}>{func.name}</span>
          <span style={{ marginLeft: 12, fontSize: 12, color: '#666', fontFamily: 'monospace' }}>({func.id})</span>
        </div>
      </div>
      <p style={{ margin: '0 0 16px 0', color: '#a0a0a0', fontSize: 14 }}>{func.desc}</p>
      <div style={{ display: 'flex', gap: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>速度</div>
          <RatingBar value={func.speed} max={5} color="#4caf50" />
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>安全性</div>
          <RatingBar value={func.security} max={5} color="#f44336" />
        </div>
      </div>
    </div>
  );
}

export const HashFunctionOverview: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="哈希函数"
          subtitle="Redis Dict 的核心组件"
        />
      </Sequence>

      {/* 第二段: 什么是哈希函数 */}
      <Sequence from={90} durationInFrames={330}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h1 style={{ fontSize: 48, color: '#e94560', margin: '0 0 24px 0' }}>
            哈希函数
          </h1>
          <p style={{ fontSize: 26, color: '#ffffff', lineHeight: 1.6, maxWidth: 900 }}>
            哈希函数将<strong style={{ color: '#ff9800' }}>任意长度的键</strong>
            映射为<strong style={{ color: '#4caf50' }}>固定长度的哈希值</strong>，
            然后通过<strong style={{ color: '#2196f3' }}>取模运算</strong>确定桶索引。
          </p>
          <div
            style={{
              marginTop: 40,
              padding: 24,
              background: 'rgba(33, 150, 243, 0.2)',
              border: '2px solid #2196f3',
              borderRadius: 12,
              fontFamily: "'Courier New', monospace",
              fontSize: 18,
            }}
          >
            <div style={{ color: '#a0a0a0' }}>index = hash(key) & (size - 1)</div>
            <div style={{ color: '#666', fontSize: 14, marginTop: 8 }}>
              & 是按位与运算，利用 size 必须是 2 的幂次这个特性
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 各种哈希函数 */}
      <Sequence from={420} durationInFrames={690}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: 'white', marginBottom: 32 }}>常见的哈希函数</h2>
          {HASH_FUNCTIONS.map((func, i) => (
            <HashFunctionCard key={func.id} func={func} index={i} />
          ))}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default HashFunctionOverview;

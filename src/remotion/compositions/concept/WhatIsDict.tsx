/**
 * 什么是 Redis Dict
 * 视频时长: 45秒 (1350帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const FPS = 30;
const TOTAL_FRAMES = 1350; // 45秒

// Redis 使用 Dict 的场景
const USE_CASES = [
  { icon: '🗄️', title: '数据库键空间', desc: '存储所有键值对' },
  { icon: '📦', title: '哈希类型 (HASH)', desc: 'HASH 命令的底层实现' },
  { icon: '🎯', title: '集合类型 (SET)', desc: 'SET 命令的底层实现之一' },
  { icon: '📊', title: '有序集合 (ZSET)', desc: 'ZSET 的内部索引' },
];

function UseCaseCard({ icon, title, desc, index }: { icon: string; title: string; desc: string; index: number }) {
  const frame = useCurrentFrame();
  const delay = index * 20;

  const opacity = interpolate(Math.max(0, frame - delay), [0, 20], [0, 1], { extrapolateLeft: 'clamp' });
  const translateY = interpolate(Math.max(0, frame - delay), [0, 20], [30, 0], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: '16px 24px',
        marginBottom: 16,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <span style={{ fontSize: 40 }}>{icon}</span>
      <div>
        <h3 style={{ margin: 0, fontSize: 22, color: '#ffffff' }}>{title}</h3>
        <p style={{ margin: '4px 0 0 0', fontSize: 16, color: '#a0a0a0' }}>{desc}</p>
      </div>
    </div>
  );
}

function DictDiagram() {
  const frame = useCurrentFrame();

  // 中心 Dict
  const dictScale = interpolate(frame, [0, 30, 60, 90], [0.8, 1.1, 1, 1], { extrapolateLeft: 'clamp' });

  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      {/* 中心 Dict */}
      <div
        style={{
          width: 200,
          height: 200,
          background: 'linear-gradient(135deg, #e94560, #ff6b6b)',
          borderRadius: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 40px rgba(233, 69, 96, 0.4)',
          transform: `scale(${dictScale})`,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>📚</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>Dict</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Redis 核心</div>
        </div>
      </div>

      {/* 连接到各个场景 */}
      {USE_CASES.map((uc, i) => {
        const angle = (i / USE_CASES.length) * Math.PI * 2 - Math.PI / 2;
        const distance = 280;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        const opacity = interpolate(frame, [90 + i * 20, 120 + i * 20], [0, 1], { extrapolateLeft: 'clamp' });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
              opacity,
            }}
          >
            <div
              style={{
                background: 'rgba(33, 150, 243, 0.2)',
                border: '2px solid #2196f3',
                borderRadius: 12,
                padding: '12px 20px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 28 }}>{uc.icon}</div>
              <div style={{ fontSize: 14, color: 'white', marginTop: 4 }}>{uc.title}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const WhatIsDict: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="什么是 Redis Dict？"
          subtitle="Redis 最核心的数据结构"
        />
      </Sequence>

      {/* 第二段: Dict 是什么 */}
      <Sequence from={90} durationInFrames={150}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h1 style={{ fontSize: 48, color: '#e94560', margin: '0 0 24px 0' }}>
            Dict（字典）
          </h1>
          <p style={{ fontSize: 28, color: '#ffffff', lineHeight: 1.6, maxWidth: 900 }}>
            Redis Dict 是一个高性能的<strong style={{ color: '#e94560' }}>哈希表</strong>实现，
            它实现了<strong style={{ color: '#4caf50' }}>O(1)</strong>的平均时间复杂度，
            是 Redis 几乎所有数据类型背后的支撑。
          </p>
          <div style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', gap: 24, fontSize: 24, color: '#a0a0a0' }}>
              <span>⚡ 高性能</span>
              <span>🔄 渐进式 Rehash</span>
              <span>🔒 安全哈希</span>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: Dict 的应用场景 */}
      <Sequence from={240} durationInFrames={480}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ fontSize: 40, color: '#ffffff', margin: '0 0 40px 0' }}>
            Dict 在 Redis 中的应用
          </h2>
          <div style={{ maxWidth: 800 }}>
            {USE_CASES.map((uc, i) => (
              <UseCaseCard key={i} {...uc} index={i} />
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第四段: 架构图 */}
      <Sequence from={720} durationInFrames={420}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
          }}
        >
          <DictDiagram />
          <div
            style={{
              position: 'absolute',
              bottom: 48,
              left: 48,
              fontSize: 20,
              color: '#a0a0a0',
            }}
          >
            几乎所有 Redis 数据类型都构建在 Dict 之上
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第五段: 总结 */}
      <Sequence from={1140} durationInFrames={210}>
        <SceneNarrator
          title="Dict 是 Redis 的基石"
          subtitle="理解 Dict 是掌握 Redis 的关键"
          text="在接下来的视频中，我们将深入探讨 Dict 的数据结构、哈希函数、Rehash 机制等核心概念。"
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export default WhatIsDict;

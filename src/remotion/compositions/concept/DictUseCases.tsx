/**
 * DictUseCases
 * 视频时长: 10秒 (300帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 300; // 10秒 * 30fps

// Dict 的主要用途
const USE_CASES = [
  {
    icon: '🗄️',
    title: '数据库键空间',
    desc: '存储 Redis 数据库中所有的键值对',
    example: 'SET mykey "hello" → 存储在 Dict 中',
  },
  {
    icon: '📦',
    title: '哈希类型 (HASH)',
    desc: 'HASH 命令的底层实现',
    example: 'HSET user:1000 name "Alice" → 内部使用 Dict',
  },
  {
    icon: '🎯',
    title: '集合类型 (SET)',
    desc: 'SET 命令的底层实现之一',
    example: 'SADD tags "redis" "dict" → 使用 Dict 存储',
  },
  {
    icon: '📊',
    title: '有序集合 (ZSET)',
    desc: 'ZSET 的内部索引结构',
    example: 'ZADD leaderboard 100 "player1" → Dict 存值',
  },
  {
    icon: '🔍',
    title: 'Pub/Sub 订阅者',
    desc: '存储频道订阅者列表',
    example: 'SUBSCRIBE news → Dict 记录订阅者',
  },
  {
    icon: '⚙️',
    title: '事务状态',
    desc: '存储 MULTI/EXEC 事务状态',
    example: 'WATCH key → Dict 记录监控的键',
  },
];

function UseCaseCard({
  icon,
  title,
  desc,
  example,
  index,
}: {
  icon: string;
  title: string;
  desc: string;
  example: string;
  index: number;
}) {
  const frame = useCurrentFrame();
  const delay = index * 25;

  const opacity = interpolate(Math.max(0, frame - delay), [0, 20], [0, 1], { extrapolateLeft: 'clamp' });
  const translateX = interpolate(Math.max(0, frame - delay), [0, 20], [-50, 0], { extrapolateLeft: 'clamp' });
  const scale = interpolate(Math.max(0, frame - delay), [0, 15], [0.8, 1], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        padding: '16px 24px',
        marginBottom: 12,
        opacity,
        transform: `translateX(${translateX}px) scale(${scale})`,
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <span style={{ fontSize: 36 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: 20, color: '#ffffff' }}>{title}</h3>
        <p style={{ margin: '4px 0 0 0', fontSize: 14, color: '#a0a0a0' }}>{desc}</p>
      </div>
      <div
        style={{
          padding: '8px 12px',
          background: 'rgba(33, 150, 243, 0.2)',
          borderRadius: 8,
          fontSize: 12,
          color: '#64b5f6',
          fontFamily: "'Courier New', monospace",
        }}
      >
        {example}
      </div>
    </div>
  );
}

function CentralDictDiagram() {
  const frame = useCurrentFrame();

  const dictScale = interpolate(frame, [0, 20, 40, 60], [0.5, 1.2, 1, 1], { extrapolateLeft: 'clamp' });
  const dictOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp' });

  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      {/* 中心 Dict */}
      <div
        style={{
          width: 180,
          height: 180,
          background: 'linear-gradient(135deg, #e94560, #ff6b6b)',
          borderRadius: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 40px rgba(233, 69, 96, 0.5)',
          transform: `scale(${dictScale})`,
          opacity: dictOpacity,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 42, marginBottom: 8 }}>📚</div>
          <div style={{ fontSize: 22, fontWeight: 'bold', color: 'white' }}>Dict</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>核心数据结构</div>
        </div>
      </div>

      {/* 连接到各个场景 */}
      {USE_CASES.map((uc, i) => {
        const angle = (i / USE_CASES.length) * Math.PI * 2 - Math.PI / 2;
        const distance = 260;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        const opacity = interpolate(frame, [60 + i * 15, 90 + i * 15], [0, 1], { extrapolateLeft: 'clamp' });

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
                background: 'rgba(33, 150, 243, 0.15)',
                border: '2px solid #2196f3',
                borderRadius: 12,
                padding: '10px 16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 24 }}>{uc.icon}</div>
              <div style={{ fontSize: 12, color: 'white', marginTop: 4 }}>{uc.title}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const DictUseCases: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* Sequence 1: Title */}
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="Dict 主要用途"
          subtitle="Redis 数据结构的基石"
        />
      </Sequence>

      {/* Sequence 2: Use Cases List */}
      <Sequence from={60} durationInFrames={150}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ fontSize: 36, color: '#ffffff', margin: '0 0 32px 0' }}>
            Dict 在 Redis 中的应用场景
          </h2>
          <div style={{ maxWidth: 900 }}>
            {USE_CASES.map((uc, i) => (
              <UseCaseCard key={i} {...uc} index={i} />
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Sequence 3: Diagram */}
      <Sequence from={210} durationInFrames={90}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
          }}
        >
          <CentralDictDiagram />
          <div
            style={{
              position: 'absolute',
              bottom: 48,
              left: 48,
              fontSize: 18,
              color: '#a0a0a0',
            }}
          >
            Dict 是 Redis 几乎所有功能的基础
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default DictUseCases;

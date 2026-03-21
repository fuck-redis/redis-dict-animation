/**
 * 哈希种子生成
 * 视频时长: 15秒 (450帧 @ 30fps)
 * 展示 Redis 启动时如何生成随机种子
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const TOTAL_FRAMES = 450; // 15秒

function TerminalWindow({
  children,
  title,
  opacity,
  translateY,
}: {
  children: React.ReactNode;
  title: string;
  opacity: number;
  translateY: number;
}) {
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        background: '#0d1117',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* 标题栏 */}
      <div
        style={{
          background: '#161b22',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: '1px solid #30363d',
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f44336' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff9800' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#4caf50' }} />
        <span style={{ marginLeft: 8, color: '#8b949e', fontSize: 12, fontFamily: "'Courier New', monospace" }}>
          {title}
        </span>
      </div>

      {/* 内容 */}
      <div
        style={{
          padding: 16,
          fontFamily: "'Courier New', monospace",
          fontSize: 14,
          color: '#c9d1d9',
          lineHeight: 1.6,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function RandomBytesAnimation({
  count,
  visible,
}: {
  count: number;
  visible: boolean;
}) {
  const bytes = Array.from({ length: count }, () =>
    Math.floor(Math.random() * 16).toString(16).toUpperCase()
  );

  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
      {bytes.map((byte, i) => (
        <div
          key={i}
          style={{
            width: 28,
            height: 28,
            background: visible ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${visible ? '#4caf50' : '#333'}`,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontFamily: "'Courier New', monospace",
            color: visible ? '#4caf50' : '#666',
            transition: 'all 0.1s ease',
          }}
        >
          {visible ? byte : '?'}
        </div>
      ))}
    </div>
  );
}

function SeedValueDisplay({
  seed,
  phase,
}: {
  seed: string;
  phase: number;
}) {
  const showSeed = phase >= 2;

  const opacity = interpolate(showSeed ? Math.min((phase * 30 - 60) / 30, 1) : 0, [0, 1], [0, 1]);

  return (
    <div
      style={{
        padding: 24,
        background: 'rgba(33, 150, 243, 0.2)',
        border: '2px solid #2196f3',
        borderRadius: 12,
        opacity,
        transition: 'opacity 0.3s ease',
      }}
    >
      <div style={{ fontSize: 14, color: '#888', marginBottom: 12, textAlign: 'center' }}>
        生成的种子值
      </div>
      <div
        style={{
          fontSize: 20,
          fontFamily: "'Courier New', monospace",
          color: '#2196f3',
          wordBreak: 'break-all',
          textAlign: 'center',
        }}
      >
        {seed}
      </div>
    </div>
  );
}

function TimelineItem({
  label,
  description,
  icon,
  color,
  index,
  isActive,
}: {
  label: string;
  description: string;
  icon: string;
  color: string;
  index: number;
  isActive: boolean;
}) {
  const frame = useCurrentFrame();
  const delay = index * 30;
  const opacity = interpolate(
    isActive ? Math.max(0, frame - delay) : 0,
    [0, 20],
    [0, 1],
    { extrapolateLeft: 'clamp' }
  );
  const translateX = interpolate(
    isActive ? Math.max(0, frame - delay) : 0,
    [0, 20],
    [-20, 0],
    { extrapolateLeft: 'clamp' }
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        opacity,
        transform: `translateX(${translateX}px)`,
        transition: 'opacity 0.3s ease',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          background: isActive ? `rgba(${color}, 0.2)` : 'rgba(255, 255, 255, 0.05)',
          border: `2px solid ${isActive ? `rgb(${color})` : '#333'}`,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: isActive ? `rgb(${color})` : '#888',
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>{description}</div>
      </div>
    </div>
  );
}

export const HashSeedGeneration: React.FC = () => {
  const frame = useCurrentFrame();
  const phase = Math.floor(frame / 150);

  // 生成的种子 (模拟)
  const seed = '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="哈希种子生成"
          subtitle="Redis 启动时的关键步骤"
        />
      </Sequence>

      {/* 第二段: 为什么需要随机种子 */}
      <Sequence from={90} durationInFrames={180}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: '#e94560', marginBottom: 32 }}>为什么需要随机种子？</h2>

          <div style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
            {/* 场景1: 相同种子 */}
            <div
              style={{
                flex: 1,
                padding: 24,
                background: 'rgba(244, 67, 54, 0.1)',
                border: '2px solid #f44336',
                borderRadius: 12,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>☠️</div>
              <div style={{ fontSize: 18, fontWeight: 'bold', color: '#f44336', marginBottom: 12 }}>
                固定种子的问题
              </div>
              <TerminalWindow title="redis-server" opacity={1} translateY={0}>
                <div style={{ color: '#4caf50' }}>hash_seed = 0xDEADBEEF</div>
                <div style={{ color: '#888', marginTop: 8 }}>
                  # 所有 Redis 实例使用相同种子
                </div>
              </TerminalWindow>
              <div
                style={{
                  marginTop: 16,
                  padding: 12,
                  background: 'rgba(244, 67, 54, 0.2)',
                  borderRadius: 8,
                  color: '#f44336',
                  fontSize: 14,
                }}
              >
                攻击者可预测哈希值发动攻击！
              </div>
            </div>

            {/* 场景2: 随机种子 */}
            <div
              style={{
                flex: 1,
                padding: 24,
                background: 'rgba(76, 175, 80, 0.1)',
                border: '2px solid #4caf50',
                borderRadius: 12,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>🛡️</div>
              <div style={{ fontSize: 18, fontWeight: 'bold', color: '#4caf50', marginBottom: 12 }}>
                随机种子的优势
              </div>
              <TerminalWindow title="redis-server" opacity={1} translateY={0}>
                <div style={{ color: '#4caf50' }}>hash_seed = 0x{Date.now().toString(16)}</div>
                <div style={{ color: '#888', marginTop: 8 }}>
                  # 每个实例使用不同种子
                </div>
              </TerminalWindow>
              <div
                style={{
                  marginTop: 16,
                  padding: 12,
                  background: 'rgba(76, 175, 80, 0.2)',
                  borderRadius: 8,
                  color: '#4caf50',
                  fontSize: 14,
                }}
              >
                攻击者无法预测哈希值！
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 种子生成过程 */}
      <Sequence from={270} durationInFrames={180}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: '#2196f3', marginBottom: 32 }}>种子生成过程</h2>

          <div style={{ display: 'flex', gap: 32 }}>
            {/* 左侧: 步骤 */}
            <div style={{ flex: 1 }}>
              <TimelineItem
                label="1. 系统调用 getrandom()"
                description="从操作系统获取随机字节"
                icon="🎲"
                color="76, 175, 80"
                index={0}
                isActive={phase >= 2}
              />
              <div style={{ marginLeft: 24, marginTop: 8, marginBottom: 8, color: '#4caf50' }}>↓</div>
              <TimelineItem
                label="2. 读取 16 字节随机数据"
                description="用于 SipHash 的密钥"
                icon="📊"
                color="33, 150, 243"
                index={1}
                isActive={phase >= 2}
              />
              <div style={{ marginLeft: 24, marginTop: 8, marginBottom: 8, color: '#4caf50' }}>↓</div>
              <TimelineItem
                label="3. 存储到 dict.c 全局变量"
                description="hashSeed 变量"
                icon="💾"
                color="156, 39, 176"
                index={2}
                isActive={phase >= 2}
              />
            </div>

            {/* 右侧: 终端输出 */}
            <div style={{ flex: 1 }}>
              <TerminalWindow title="redis-server" opacity={1} translateY={0}>
                <div style={{ color: '#888' }}>[Start] Redis startup...</div>
                <div style={{ color: '#ff9800' }}>[INFO] Generating hash seed...</div>
                <div style={{ color: '#4caf50' }}>
                  [INFO] hash_seed = 0x
                  {Array.from({ length: 16 }, (_, i) =>
                    i < (phase >= 2 ? 16 : Math.floor(frame % 30))
                      ? Math.floor(Math.random() * 16).toString(16).toUpperCase()
                      : '?'
                  ).join('')}
                </div>
                <div style={{ color: '#888', marginTop: 8 }}>
                  [INFO] Hash function initialized with SipHash-2-4
                </div>
              </TerminalWindow>

              <SeedValueDisplay seed={seed} phase={phase} />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default HashSeedGeneration;

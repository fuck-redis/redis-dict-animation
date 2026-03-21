/**
 * SipHash 防御机制
 * 视频时长: 20秒 (600帧 @ 30fps)
 * 展示 SipHash 如何使用密钥防止攻击
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const TOTAL_FRAMES = 600; // 20秒

function KeyIcon({ opacity, translateY }: { opacity: number; translateY: number }) {
  return (
    <div
      style={{
        width: 80,
        height: 80,
        background: 'linear-gradient(135deg, #ffd700, #ffb300)',
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 40,
        opacity,
        transform: `translateY(${translateY}px)`,
        boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)',
      }}
    >
      🔑
    </div>
  );
}

function LockIcon({ isLocked }: { isLocked: boolean }) {
  return (
    <div
      style={{
        width: 60,
        height: 60,
        background: isLocked ? 'linear-gradient(135deg, #4caf50, #2e7d32)' : '#f44336',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
        boxShadow: isLocked ? '0 4px 15px rgba(76, 175, 80, 0.4)' : '0 4px 15px rgba(244, 67, 54, 0.4)',
      }}
    >
      {isLocked ? '🔒' : '🔓'}
    </div>
  );
}

function AttackComparison({
  phase,
}: {
  phase: number;
}) {
  const frame = useCurrentFrame();
  const showAttack = phase >= 2;

  return (
    <div style={{ display: 'flex', gap: 32 }}>
      {/* 无密钥哈希 */}
      <div
        style={{
          flex: 1,
          padding: 24,
          background: 'rgba(244, 67, 54, 0.1)',
          border: '2px solid #f44336',
          borderRadius: 12,
        }}
      >
        <h3 style={{ color: '#f44336', marginTop: 0 }}>无密钥哈希</h3>
        <p style={{ color: '#a0a0a0', fontSize: 14 }}>攻击者可预测</p>

        <div
          style={{
            padding: 16,
            background: '#222',
            borderRadius: 8,
            fontFamily: "'Courier New', monospace",
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          <div style={{ color: '#888' }}>h("key") = 0xABCD1234</div>
          <div style={{ color: '#888' }}>h("key") = 0xABCD1234</div>
          <div style={{ color: '#888' }}>h("key") = 0xABCD1234</div>
        </div>

        <div style={{ color: '#f44336', fontSize: 14 }}>
          每次都产生相同的哈希值！
        </div>
      </div>

      {/* 有密钥哈希 (SipHash) */}
      <div
        style={{
          flex: 1,
          padding: 24,
          background: 'rgba(76, 175, 80, 0.1)',
          border: '2px solid #4caf50',
          borderRadius: 12,
        }}
      >
        <h3 style={{ color: '#4caf50', marginTop: 0 }}>SipHash (有密钥)</h3>
        <p style={{ color: '#a0a0a0', fontSize: 14 }}>攻击者无法预测</p>

        <div
          style={{
            padding: 16,
            background: '#222',
            borderRadius: 8,
            fontFamily: "'Courier New', monospace",
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          <div style={{ color: '#4caf50' }}>h("key", k1,k2) = 0x1234DEAD</div>
          <div style={{ color: '#ff9800' }}>h("key", k3,k4) = 0x9876BEEF</div>
          <div style={{ color: '#9c27b0' }}>h("key", k5,k6) = 0x5432CAFE</div>
        </div>

        <div style={{ color: '#4caf50', fontSize: 14 }}>
          不同密钥产生不同哈希值！
        </div>
      </div>
    </div>
  );
}

function FlowDiagram({ phase }: { phase: number }) {
  const frame = useCurrentFrame();

  const showKeyGen = frame < 150;
  const showAttackFail = frame >= 150 && frame < 300;
  const showO1Maintained = frame >= 300;

  const keyGenOpacity = interpolate(
    showKeyGen ? frame : frame >= 150 ? Math.max(0, 450 - frame) : 0,
    [0, 30],
    [0, 1],
    { extrapolateLeft: 'clamp' }
  );

  const attackOpacity = interpolate(
    showAttackFail ? frame - 150 : frame >= 300 ? Math.max(0, 600 - frame) : 0,
    [0, 30],
    [0, 1],
    { extrapolateLeft: 'clamp' }
  );

  const o1Opacity = interpolate(showO1Maintained ? frame - 300 : 0, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 第一步: 密钥生成 */}
      <div style={{ opacity: keyGenOpacity, transition: 'opacity 0.3s ease' }}>
        <div
          style={{
            padding: 20,
            background: 'rgba(255, 215, 0, 0.1)',
            border: '2px solid #ffd700',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
          }}
        >
          <KeyIcon opacity={1} translateY={0} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 'bold', color: '#ffd700', marginBottom: 8 }}>
              Redis 启动时生成随机密钥
            </div>
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 14,
                color: '#a0a0a0',
              }}
            >
              k1 = 0x{Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}<br />
              k2 = 0x{Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}
            </div>
          </div>
        </div>
      </div>

      {/* 箭头 */}
      <div style={{ textAlign: 'center', color: '#4caf50', fontSize: 24 }}>⬇</div>

      {/* 第二步: 攻击失败 */}
      <div style={{ opacity: attackOpacity, transition: 'opacity 0.3s ease' }}>
        <div
          style={{
            padding: 20,
            background: 'rgba(244, 67, 54, 0.1)',
            border: '2px solid #f44336',
            borderRadius: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 32 }}>👿</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 'bold', color: '#f44336' }}>
                攻击者尝试构造哈希洪水
              </div>
              <div style={{ color: '#a0a0a0', fontSize: 14 }}>
                发送大量具有相同哈希值的恶意键
              </div>
            </div>
          </div>

          <div
            style={{
              padding: 16,
              background: '#222',
              borderRadius: 8,
              fontFamily: "'Courier New', monospace",
              fontSize: 14,
              color: '#f44336',
            }}
          >
            <div>尝试: h("malicious_key_1") = ???</div>
            <div>尝试: h("malicious_key_2") = ???</div>
            <div style={{ color: '#a0a0a0', marginTop: 8 }}>
              攻击失败: 无法预测正确密钥下的哈希值
            </div>
          </div>
        </div>
      </div>

      {/* 箭头 */}
      <div style={{ textAlign: 'center', color: '#4caf50', fontSize: 24 }}>⬇</div>

      {/* 第三步: O(1) 维持 */}
      <div style={{ opacity: o1Opacity, transition: 'opacity 0.3s ease' }}>
        <div
          style={{
            padding: 20,
            background: 'rgba(76, 175, 80, 0.1)',
            border: '2px solid #4caf50',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <LockIcon isLocked={true} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 'bold', color: '#4caf50' }}>
              O(1) 时间复杂度得以维持
            </div>
            <div style={{ color: '#a0a0a0', fontSize: 14 }}>
              攻击者无法预测哈希值，无法构造有效的哈希洪水攻击
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function O1Diagram({ show }: { show: boolean }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(show ? Math.min((frame - 420) / 30, 1) : 0, [0, 1], [0, 1]);

  const buckets = Array.from({ length: 8 }, (_, i) => ({
    index: i,
    count: show ? (i === 3 ? 2 : Math.floor(Math.random() * 2)) : 0,
  }));

  return (
    <div style={{ opacity, transition: 'opacity 0.3s ease' }}>
      <h3 style={{ color: '#4caf50', marginBottom: 24, textAlign: 'center' }}>
        哈希表保持均匀分布
      </h3>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
        {buckets.map((bucket) => (
          <div
            key={bucket.index}
            style={{
              width: 80,
              minHeight: 100,
              background:
                bucket.count === 0
                  ? 'rgba(255, 255, 255, 0.05)'
                  : bucket.count === 1
                  ? 'rgba(76, 175, 80, 0.3)'
                  : 'rgba(255, 152, 0, 0.3)',
              border: `2px solid ${
                bucket.count === 0 ? '#333' : bucket.count === 1 ? '#4caf50' : '#ff9800'
              }`,
              borderRadius: 8,
              padding: 8,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                background: bucket.count === 0 ? '#444' : '#2196f3',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 12,
                margin: '0 auto 8px',
              }}
            >
              {bucket.index}
            </div>
            <div style={{ fontSize: 12, color: '#666' }}>
              {bucket.count === 0 ? 'empty' : `${bucket.count} item${bucket.count > 1 ? 's' : ''}`}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: 16,
          background: 'rgba(76, 175, 80, 0.2)',
          border: '2px solid #4caf50',
          borderRadius: 8,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#4caf50' }}>
          查找时间: O(1) ✓
        </div>
        <div style={{ color: '#a0a0a0', marginTop: 8 }}>
          每个桶只有少量键，查找快速
        </div>
      </div>
    </div>
  );
}

export const SipHashDefenseMechanism: React.FC = () => {
  const frame = useCurrentFrame();
  const phase = Math.floor(frame / 150);

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="SipHash 防御机制"
          subtitle="密钥保护哈希表安全"
        />
      </Sequence>

      {/* 第二段: 密钥对比 */}
      <Sequence from={90} durationInFrames={210}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: '#ffd700', marginBottom: 32 }}>为什么需要密钥？</h2>

          <AttackComparison phase={phase} />

          <div
            style={{
              marginTop: 24,
              padding: 16,
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 8,
              color: '#a0a0a0',
              textAlign: 'center',
            }}
          >
            <strong style={{ color: '#e94560' }}>核心区别:</strong> 有密钥的哈希函数需要密钥才能计算，
            攻击者不知道密钥就无法预测哈希值。
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 防御流程 */}
      <Sequence from={300} durationInFrames={210}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: '#4caf50', marginBottom: 32 }}>SipHash 防御流程</h2>

          <FlowDiagram phase={phase} />
        </AbsoluteFill>
      </Sequence>

      {/* 第四段: O(1) 维持 */}
      <Sequence from={510} durationInFrames={90}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <O1Diagram show={frame >= 510} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default SipHashDefenseMechanism;

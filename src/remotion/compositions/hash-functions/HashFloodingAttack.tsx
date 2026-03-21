/**
 * 哈希洪水攻击
 * 视频时长: 50秒 (1500帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const FPS = 30;
const TOTAL_FRAMES = 1500; // 50秒

function AttackDemo() {
  const frame = useCurrentFrame();
  const phase = Math.floor(frame / 120);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: '#f44336', marginBottom: 32 }}>哈希洪水攻击</h2>

      <div style={{ display: 'flex', gap: 32, marginBottom: 40 }}>
        {/* 攻击前 */}
        <div
          style={{
            flex: 1,
            padding: 24,
            background: phase < 2 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.2)',
            border: `2px solid ${phase < 2 ? '#4caf50' : '#666'}`,
            borderRadius: 12,
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#4caf50', marginBottom: 16 }}>
            正常情况
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((key) => (
              <div
                key={key}
                style={{
                  padding: '8px 12px',
                  background: '#e8f5e9',
                  border: '2px solid #4caf50',
                  borderRadius: 4,
                  fontSize: 12,
                  fontFamily: "'Courier New', monospace",
                }}
              >
                {key}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, color: '#a0a0a0', fontSize: 14 }}>
            均匀分布，O(1) 查找
          </div>
        </div>

        {/* 攻击后 */}
        <div
          style={{
            flex: 1,
            padding: 24,
            background: phase >= 2 ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.05)',
            border: `2px solid ${phase >= 2 ? '#f44336' : '#666'}`,
            borderRadius: 12,
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#f44336', marginBottom: 16 }}>
            遭受攻击
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div
              style={{
                padding: '12px 16px',
                background: '#ffcdd2',
                border: '2px solid #f44336',
                borderRadius: 4,
                fontSize: 14,
                fontFamily: "'Courier New', monospace",
                textAlign: 'center',
              }}
            >
              桶0: [key1] → [key2] → [key3] → ... → [key1000]
            </div>
            <div style={{ color: '#f44336', fontSize: 12, marginTop: 8 }}>
              所有键都哈希到同一个桶！
            </div>
          </div>
          <div style={{ marginTop: 16, color: '#f44336', fontSize: 14 }}>
            查找退化到 O(N)！
          </div>
        </div>
      </div>

      {phase >= 2 && (
        <div
          style={{
            padding: 20,
            background: 'rgba(255, 152, 0, 0.2)',
            border: '2px solid #ff9800',
            borderRadius: 8,
          }}
        >
          <strong style={{ color: '#ff9800' }}>攻击原理:</strong>
          <p style={{ margin: '12px 0 0 0', color: '#a0a0a0' }}>
            攻击者发现哈希函数后，构造大量具有相同哈希值的键，使哈希表退化为链表。
          </p>
        </div>
      )}
    </div>
  );
}

function DefenseDemo() {
  const frame = useCurrentFrame();
  const showDefense = frame >= 180;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: '#4caf50', marginBottom: 32 }}>Redis 的防御策略</h2>

      {showDefense && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {[
            {
              icon: '🔐',
              title: 'SipHash 算法',
              desc: '使用密钥的哈希函数，攻击者无法预测哈希值。Redis 启动时生成随机种子。',
              color: '#4caf50',
            },
            {
              icon: '🎲',
              title: '随机种子',
              desc: '每个 Redis 实例启动时生成随机种子，相同的键在不同实例中哈希值不同。',
              color: '#2196f3',
            },
            {
              icon: '🔄',
              title: '渐进式 Rehash',
              desc: '即使发生攻击，也能通过 rehash 恢复性能。新键会写入新表。',
              color: '#ff9800',
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                padding: 20,
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 12,
                borderLeft: `4px solid ${item.color}`,
              }}
            >
              <span style={{ fontSize: 32 }}>{item.icon}</span>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, color: 'white' }}>{item.title}</h3>
                <p style={{ margin: '8px 0 0 0', fontSize: 14, color: '#a0a0a0' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const HashFloodingAttack: React.FC = () => {
  const frame = useCurrentFrame();
  const section = Math.floor(frame / 300);

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="哈希洪水攻击"
          subtitle="恶意输入导致的拒绝服务"
        />
      </Sequence>

      {/* 第二段: 攻击演示 */}
      <Sequence from={90} durationInFrames={600}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <AttackDemo />
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 防御策略 */}
      <Sequence from={690} durationInFrames={810}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <DefenseDemo />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default HashFloodingAttack;

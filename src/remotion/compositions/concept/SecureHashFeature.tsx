/**
 * SipHash 安全哈希特性
 * 视频时长: 15秒 (450帧 @ 30fps)
 * 展示 SipHash 如何防御哈希洪水攻击
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const FPS = 30;
const TOTAL_FRAMES = 450; // 15秒

// 模拟不同类型键的哈希时间
interface HashDemoProps {
  type: 'normal' | 'malicious';
  label: string;
  keys: string[];
  color: string;
  highlightColor: string;
}

function HashDemo({ type, label, keys, color, highlightColor }: HashDemoProps) {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 60], [0, 1], { extrapolateLeft: 'clamp' });
  const delay = type === 'malicious' ? 120 : 0;

  const visibleKeys = keys.slice(0, Math.floor(progress * keys.length));

  return (
    <div
      style={{
        flex: 1,
        padding: 24,
        background: 'rgba(255, 255, 255, 0.05)',
        border: `2px solid ${color}`,
        borderRadius: 12,
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 'bold', color: color, marginBottom: 16 }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {visibleKeys.map((key, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 6,
              opacity: interpolate(frame, [delay + i * 5, delay + i * 5 + 10], [0, 1], { extrapolateLeft: 'clamp' }),
              transform: `translateX(${interpolate(frame, [delay + i * 5, delay + i * 5 + 10], [-20, 0], { extrapolateLeft: 'clamp' })}px)`,
            }}
          >
            <span
              style={{
                padding: '2px 8px',
                background: color,
                borderRadius: 4,
                fontSize: 11,
                color: 'white',
                fontFamily: "'Courier New', monospace",
              }}
            >
              hash({key})
            </span>
            <span style={{ color: '#a0a0a0', fontSize: 14 }}>
              → 桶 #{Math.abs(key.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 8}
            </span>
            <span
              style={{
                marginLeft: 'auto',
                color: '#4caf50',
                fontSize: 12,
                fontWeight: 'bold',
              }}
            >
              O(1)
            </span>
          </div>
        ))}
      </div>
      {visibleKeys.length > 0 && (
        <div
          style={{
            marginTop: 16,
            padding: '12px 16px',
            background: 'rgba(76, 175, 80, 0.2)',
            borderRadius: 6,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color: '#a0a0a0', fontSize: 14 }}>
            {visibleKeys.length} 个键已哈希
          </span>
          <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
            均匀分布
          </span>
        </div>
      )}
    </div>
  );
}

function SipHashVisualization() {
  const frame = useCurrentFrame();

  // 显示 SipHash 处理流程
  const showKey = frame >= 180 && frame < 270;
  const showHash = frame >= 270 && frame < 360;
  const showResult = frame >= 360;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: '#4caf50', marginBottom: 32 }}>SipHash 工作原理</h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 32,
          padding: 24,
        }}
      >
        {/* 输入 */}
        <div
          style={{
            opacity: showKey ? 1 : 0.3,
            transform: `scale(${showKey ? 1 : 0.9})`,
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 8, textAlign: 'center' }}>
            输入
          </div>
          <div
            style={{
              padding: '20px 40px',
              background: 'rgba(33, 150, 243, 0.2)',
              border: '2px solid #2196f3',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#a0a0a0', marginBottom: 4 }}>键 (key)</div>
              <div style={{ fontSize: 18, color: 'white', fontFamily: "'Courier New', monospace" }}>
                "user:12345"
              </div>
            </div>
            <div style={{ fontSize: 32, color: '#666' }}>+</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#a0a0a0', marginBottom: 4 }}>密钥 (secret)</div>
              <div style={{ fontSize: 18, color: '#e94560', fontFamily: "'Courier New', monospace" }}>
                0x...随机...
              </div>
            </div>
          </div>
        </div>

        {/* 箭头 */}
        <div
          style={{
            fontSize: 32,
            color: '#4caf50',
            opacity: showKey ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          ↓ SipHash-2-4
        </div>

        {/* 哈希过程 */}
        <div
          style={{
            opacity: showHash ? 1 : 0.3,
            transform: `scale(${showHash ? 1 : 0.9})`,
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 8, textAlign: 'center' }}>
            加密哈希
          </div>
          <div
            style={{
              padding: '20px 40px',
              background: 'rgba(76, 175, 80, 0.2)',
              border: '2px solid #4caf50',
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 18, color: '#4caf50', fontFamily: "'Courier New', monospace" }}>
              h = SipHash(key, secret)
            </div>
          </div>
        </div>

        {/* 箭头 */}
        <div
          style={{
            fontSize: 32,
            color: '#4caf50',
            opacity: showHash ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          ↓ mod table_size
        </div>

        {/* 结果 */}
        <div
          style={{
            opacity: showResult ? 1 : 0.3,
            transform: `scale(${showResult ? 1 : 0.9})`,
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 8, textAlign: 'center' }}>
            哈希表索引
          </div>
          <div
            style={{
              padding: '20px 40px',
              background: 'rgba(255, 152, 0, 0.2)',
              border: '2px solid #ff9800',
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 24, color: '#ff9800', fontFamily: "'Courier New', monospace" }}>
              桶 #5
            </div>
          </div>
        </div>
      </div>

      {/* 密钥重要性说明 */}
      {showResult && (
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            left: 48,
            right: 48,
            padding: 20,
            background: 'rgba(233, 69, 96, 0.2)',
            border: '2px solid #e94560',
            borderRadius: 8,
          }}
        >
          <strong style={{ color: '#e94560' }}>关键:</strong>
          <span style={{ color: '#ffffff', marginLeft: 12 }}>
            攻击者不知道密钥，无法预测哈希值，无法构造恶意键！
          </span>
        </div>
      )}
    </div>
  );
}

function ComparisonPanel() {
  const frame = useCurrentFrame();
  const phase = Math.floor(frame / 150);

  return (
    <div style={{ display: 'flex', gap: 32, marginTop: 32 }}>
      <HashDemo
        type="normal"
        label="普通键"
        keys={['name', 'age', 'email', 'city', 'country', 'lang', 'theme', 'lang']}
        color="#4caf50"
        highlightColor="#81c784"
      />
      <HashDemo
        type="malicious"
        label="恶意构造的键"
        keys={['hash123', 'hash124', 'hash125', 'hash126', 'hash127', 'hash128', 'hash129', 'hash130']}
        color="#2196f3"
        highlightColor="#64b5f6"
      />
    </div>
  );
}

export const SecureHashFeature: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="SipHash 安全哈希"
          subtitle="Redis 的秘密武器"
        />
      </Sequence>

      {/* 第二段: 攻击者视角 - 失败 */}
      <Sequence from={90} durationInFrames={150}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: '#f44336', marginBottom: 24 }}>
            攻击者视角: 不知道密钥 = 无法攻击
          </h2>
          <div
            style={{
              padding: 24,
              background: 'rgba(244, 67, 54, 0.1)',
              border: '2px solid #f44336',
              borderRadius: 12,
              marginBottom: 32,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <span style={{ fontSize: 32 }}>🤔</span>
              <div>
                <div style={{ fontSize: 18, color: 'white' }}>攻击者尝试构造恶意键</div>
                <div style={{ fontSize: 14, color: '#a0a0a0' }}>目标: 让所有键哈希到同一个桶</div>
              </div>
            </div>
            <div
              style={{
                padding: 16,
                background: '#333',
                borderRadius: 8,
                fontFamily: "'Courier New', monospace",
                fontSize: 14,
                color: '#a0a0a0',
              }}
            >
              <div>尝试: key1, key2, key3, ...</div>
              <div style={{ marginTop: 8, color: '#f44336' }}>
                结果: 哈希值完全不可预测！
              </div>
              <div style={{ marginTop: 8, color: '#ff9800' }}>
                原因: 不知道 Redis 的随机密钥
              </div>
            </div>
          </div>
          <div
            style={{
              padding: 20,
              background: 'rgba(76, 175, 80, 0.2)',
              border: '2px solid #4caf50',
              borderRadius: 8,
            }}
          >
            <strong style={{ color: '#4caf50' }}>防御成功:</strong>
            <span style={{ color: '#ffffff', marginLeft: 12 }}>
              即使知道哈希函数，不知道密钥也无法构造有效攻击
            </span>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 正常键和恶意键都 O(1) */}
      <Sequence from={240} durationInFrames={210}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: '#4caf50', marginBottom: 24 }}>
            统一 O(1) 性能: 无论键是否恶意
          </h2>
          <ComparisonPanel />
          <div
            style={{
              marginTop: 32,
              padding: 20,
              background: 'rgba(76, 175, 80, 0.2)',
              border: '2px solid #4caf50',
              borderRadius: 8,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 20, color: '#4caf50', fontWeight: 'bold' }}>
              SipHash 保证: 所有键的查找时间都是 O(1)
            </div>
            <div style={{ fontSize: 14, color: '#a0a0a0', marginTop: 8 }}>
              攻击者无法通过任何方式使哈希表退化
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default SecureHashFeature;

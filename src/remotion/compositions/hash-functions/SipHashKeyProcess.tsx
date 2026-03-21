/**
 * SipHashKeyProcess
 * 视频时长: 10秒 (300帧 @ 30fps)
 * SipHash密钥过程
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 300;

function KeyAnimation() {
  const frame = useCurrentFrame();

  // 阶段1: 显示密钥 (0-60帧)
  // 阶段2: 显示输入 (60-120帧)
  // 阶段3: 显示混合过程 (120-200帧)
  // 阶段4: 显示输出 (200-260帧)

  const keyOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateLeft: 'clamp' });
  const inputOpacity = interpolate(frame, [40, 70], [0, 1], { extrapolateLeft: 'clamp' });
  const mixOpacity = interpolate(frame, [100, 130], [0, 1], { extrapolateLeft: 'clamp' });
  const outputOpacity = interpolate(frame, [180, 210], [0, 1], { extrapolateLeft: 'clamp' });

  // 密钥流动动画
  const keyFlow = interpolate(frame, [20, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    }}>
      {/* 密钥区域 */}
      <div style={{
        opacity: keyOpacity,
        padding: 20,
        background: 'rgba(156, 39, 176, 0.2)',
        border: '3px solid #9c27b0',
        borderRadius: 12,
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 8,
          right: 8,
          fontSize: 10,
          color: '#666',
          background: 'rgba(0,0,0,0.3)',
          padding: '2px 6px',
          borderRadius: 4,
        }}>
          k0, k1
        </div>
        <div style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 8, textAlign: 'center' }}>
          秘密密钥 (Secret Keys)
        </div>
        <div style={{
          fontSize: 22,
          fontFamily: "'Courier New', monospace",
          color: '#9c27b0',
          fontWeight: 'bold',
        }}>
          k0 = 0x0706050403020100
        </div>
        <div style={{
          fontSize: 22,
          fontFamily: "'Courier New', monospace",
          color: '#9c27b0',
          fontWeight: 'bold',
        }}>
          k1 = 0x0f0e0d0c0b0a0908
        </div>
      </div>

      {/* 箭头 */}
      <div style={{
        fontSize: 24,
        color: '#666',
        marginBottom: 16,
        opacity: Math.min(keyOpacity, inputOpacity),
      }}>
        ↓ ↓ ↓
      </div>

      {/* 输入 */}
      <div style={{
        opacity: inputOpacity,
        padding: 16,
        background: 'rgba(255, 152, 0, 0.2)',
        border: '2px solid #ff9800',
        borderRadius: 8,
        marginBottom: 24,
      }}>
        <div style={{ fontSize: 12, color: '#a0a0a0', marginBottom: 4, textAlign: 'center' }}>
          输入消息
        </div>
        <div style={{
          fontSize: 18,
          fontFamily: "'Courier New', monospace",
          color: '#ff9800',
        }}>
          "hello world"
        </div>
      </div>

      {/* 混合过程 */}
      <div style={{
        opacity: mixOpacity,
        padding: 20,
        background: 'rgba(76, 175, 80, 0.2)',
        border: '3px solid #4caf50',
        borderRadius: 12,
        marginBottom: 24,
      }}>
        <div style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 8, textAlign: 'center' }}>
          SipHash 压缩轮次
        </div>
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
        }}>
          {['初始化', 'Mix k0/k1', '压缩', 'Finalize'].map((step, i) => (
            <div
              key={step}
              style={{
                padding: '8px 12px',
                background: 'rgba(76, 175, 80, 0.3)',
                borderRadius: 6,
                fontSize: 12,
                color: '#4caf50',
                fontFamily: "'Courier New', monospace",
              }}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* 箭头 */}
      <div style={{
        fontSize: 24,
        color: '#666',
        marginBottom: 16,
        opacity: mixOpacity,
      }}>
        ↓
      </div>

      {/* 输出 */}
      <div style={{
        opacity: outputOpacity,
        padding: 20,
        background: 'rgba(33, 150, 243, 0.2)',
        border: '3px solid #2196f3',
        borderRadius: 12,
      }}>
        <div style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 8, textAlign: 'center' }}>
          抗篡改的哈希值
        </div>
        <div style={{
          fontSize: 24,
          fontFamily: "'Courier New', monospace",
          color: '#2196f3',
          fontWeight: 'bold',
        }}>
          0xa1b2c3d4e5f60718
        </div>
        <div style={{
          fontSize: 12,
          color: '#666',
          marginTop: 8,
          textAlign: 'center',
        }}>
          攻击者不知道密钥，无法构造哈希洪水攻击
        </div>
      </div>
    </div>
  );
}

export const SipHashKeyProcess: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="SipHash 密钥"
          subtitle="如何使用密钥提供保护"
        />
      </Sequence>
      <Sequence from={60} durationInFrames={TOTAL_FRAMES - 60}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <KeyAnimation />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default SipHashKeyProcess;

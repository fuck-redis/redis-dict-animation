/**
 * 哈希冲突介绍
 * 视频时长: 15秒 (450帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const TOTAL_FRAMES = 450;

function CollisionAnimation() {
  const frame = useCurrentFrame();

  // 动画阶段
  // 0-90: 显示两个不同的键
  // 90-180: 显示哈希函数
  // 180-270: 显示两个键经过哈希计算
  // 270-360: 显示结果相同，发生冲突
  // 360-450: 解释冲突

  const showKeys = frame < 180;
  const showHashFunc = frame >= 60 && frame < 270;
  const showCollision = frame >= 270;

  const key1Opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp' });
  const key2Opacity = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: 'clamp' });
  const collisionScale = interpolate(frame, [270, 330], [0.5, 1.2], { extrapolateLeft: 'clamp' });
  const collisionOpacity = interpolate(frame, [270, 300], [0, 1], { extrapolateLeft: 'clamp' });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ color: 'white', marginBottom: 40, position: 'absolute', top: 40 }}>哈希冲突是如何产生的</h2>

      {/* 两个键 */}
      <div style={{ display: 'flex', gap: 100, marginBottom: 60, opacity: showKeys ? 1 : 0.3 }}>
        {/* 键1 */}
        <div
          style={{
            transform: `scale(${interpolate(frame, [0, 30], [0.8, 1], { extrapolateLeft: 'clamp' })})`,
            opacity: key1Opacity,
          }}
        >
          <div
            style={{
              width: 180,
              height: 100,
              background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
              border: '3px solid #2196f3',
              borderRadius: 12,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
            }}
          >
            <span style={{ fontSize: 14, color: '#666' }}>key</span>
            <span style={{ fontSize: 28, fontWeight: 'bold', color: '#1565c0', fontFamily: "'Courier New', monospace" }}>
              "name"
            </span>
            <span style={{ fontSize: 12, color: '#888' }}>length = 4</span>
          </div>
        </div>

        {/* 键2 */}
        <div
          style={{
            transform: `scale(${interpolate(frame, [60, 90], [0.8, 1], { extrapolateLeft: 'clamp' })})`,
            opacity: key2Opacity,
          }}
        >
          <div
            style={{
              width: 180,
              height: 100,
              background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
              border: '3px solid #ff9800',
              borderRadius: 12,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(255, 152, 0, 0.3)',
            }}
          >
            <span style={{ fontSize: 14, color: '#666' }}>key</span>
            <span style={{ fontSize: 28, fontWeight: 'bold', color: '#e65100', fontFamily: "'Courier New', monospace" }}>
              "city"
            </span>
            <span style={{ fontSize: 12, color: '#888' }}>length = 4</span>
          </div>
        </div>
      </div>

      {/* 哈希函数 */}
      {showHashFunc && (
        <div
          style={{
            position: 'absolute',
            top: 280,
            padding: '16px 32px',
            background: 'rgba(76, 175, 80, 0.2)',
            border: '2px solid #4caf50',
            borderRadius: 8,
            fontSize: 24,
            color: 'white',
            fontFamily: "'Courier New', monospace",
          }}
        >
          h(key) = key.length % 4
        </div>
      )}

      {/* 箭头和结果 */}
      {showCollision && (
        <div style={{ position: 'absolute', top: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
            <div
              style={{
                padding: '12px 24px',
                background: '#e3f2fd',
                border: '2px solid #2196f3',
                borderRadius: 8,
                fontFamily: "'Courier New', monospace",
              }}
            >
              <span style={{ color: '#1565c0' }}>h("name")</span>
              <span style={{ color: '#999', margin: '0 8px' }}>=</span>
              <span style={{ color: '#4caf50', fontWeight: 'bold' }}>0</span>
            </div>

            <div style={{ color: '#666', fontSize: 32 }}>→</div>

            <div
              style={{
                padding: '12px 24px',
                background: '#c8e6c9',
                border: `3px solid #4caf50`,
                borderRadius: 8,
                fontSize: 20,
                fontWeight: 'bold',
                color: '#2e7d32',
              }}
            >
              桶 0
            </div>
          </div>

          <div style={{ color: '#ff9800', fontSize: 48, fontWeight: 'bold' }}>↓</div>

          <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
            <div
              style={{
                padding: '12px 24px',
                background: '#fff3e0',
                border: '2px solid #ff9800',
                borderRadius: 8,
                fontFamily: "'Courier New', monospace",
              }}
            >
              <span style={{ color: '#e65100' }}>h("city")</span>
              <span style={{ color: '#999', margin: '0 8px' }}>=</span>
              <span style={{ color: '#4caf50', fontWeight: 'bold' }}>0</span>
            </div>

            <div style={{ color: '#666', fontSize: 32 }}>→</div>

            <div
              style={{
                padding: '12px 24px',
                background: '#ffccbc',
                border: `3px solid #f44336`,
                borderRadius: 8,
                fontSize: 20,
                fontWeight: 'bold',
                color: '#c62828',
                transform: `scale(${collisionScale})`,
                opacity: collisionOpacity,
              }}
            >
              桶 0 (冲突!)
            </div>
          </div>
        </div>
      )}

      {/* 冲突说明 */}
      {frame >= 360 && (
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            padding: 24,
            background: 'rgba(244, 67, 54, 0.2)',
            border: '2px solid #f44336',
            borderRadius: 12,
            maxWidth: 700,
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'white', fontSize: 22, margin: 0 }}>
            <strong style={{ color: '#f44336' }}>哈希冲突!</strong>
            <span style={{ color: '#a0a0a0', marginLeft: 16 }}>
              两个不同的键，经过哈希函数计算后，得到了相同的桶索引。
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export const HashCollisionIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="哈希冲突"
          subtitle="Hash Collision"
        />
      </Sequence>

      {/* 第二段: 冲突动画 */}
      <Sequence from={60} durationInFrames={390}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
          }}
        >
          <CollisionAnimation />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default HashCollisionIntro;

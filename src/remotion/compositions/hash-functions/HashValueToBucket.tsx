/**
 * HashValueToBucket
 * 视频时长: 10秒 (300帧 @ 30fps)
 * 哈希值到桶索引的映射
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 300;

function ModuloAnimation() {
  const frame = useCurrentFrame();

  // 阶段1: 显示哈希值 (0-60帧)
  // 阶段2: 显示取模运算 (60-150帧)
  // 阶段3: 显示桶索引 (150-240帧)

  const hashValueOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp' });
  const moduloOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: 'clamp' });
  const bucketOpacity = interpolate(frame, [150, 180], [0, 1], { extrapolateLeft: 'clamp' });

  // 运算动画
  const moduloAnimProgress = interpolate(frame, [80, 140], [0, 1], { extrapolateLeft: 'clamp' });

  // 桶数量
  const tableSize = 8;

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
      {/* 哈希值 */}
      <div style={{
        opacity: hashValueOpacity,
        padding: 20,
        background: 'rgba(33, 150, 243, 0.2)',
        border: '3px solid #2196f3',
        borderRadius: 12,
        marginBottom: 24,
      }}>
        <div style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 8, textAlign: 'center' }}>
          哈希值
        </div>
        <div style={{
          fontSize: 24,
          fontFamily: "'Courier New', monospace",
          color: '#2196f3',
          fontWeight: 'bold',
        }}>
          0x7b3c9f2a
        </div>
      </div>

      {/* 向下箭头和取模运算 */}
      <div style={{
        fontSize: 32,
        color: '#4caf50',
        marginBottom: 16,
        opacity: moduloOpacity,
      }}>
        ↓ 取模运算
      </div>

      {/* 取模公式 */}
      <div style={{
        opacity: moduloOpacity,
        padding: 24,
        background: 'rgba(76, 175, 80, 0.2)',
        border: '3px solid #4caf50',
        borderRadius: 12,
        marginBottom: 24,
      }}>
        <div style={{
          fontSize: 28,
          fontFamily: "'Courier New', monospace",
          color: '#4caf50',
          fontWeight: 'bold',
          marginBottom: 12,
        }}>
          index = hash(key) % table_size
        </div>
        <div style={{
          fontSize: 18,
          fontFamily: "'Courier New', monospace",
          color: '#a0a0a0',
        }}>
          0x7b3c9f2a % 8 = <span style={{ color: '#ff9800', fontWeight: 'bold' }}>2</span>
        </div>
      </div>

      {/* 向下箭头 */}
      <div style={{
        fontSize: 32,
        color: '#ff9800',
        marginBottom: 16,
        opacity: bucketOpacity,
      }}>
        ↓
      </div>

      {/* 桶索引结果 */}
      <div style={{
        opacity: bucketOpacity,
        padding: 20,
        background: 'rgba(255, 152, 0, 0.2)',
        border: '3px solid #ff9800',
        borderRadius: 12,
        marginBottom: 32,
      }}>
        <div style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 8, textAlign: 'center' }}>
          桶索引 (Bucket Index)
        </div>
        <div style={{
          fontSize: 36,
          fontFamily: "'Courier New', monospace",
          color: '#ff9800',
          fontWeight: 'bold',
        }}>
          2
        </div>
      </div>

      {/* 简化的桶示意图 */}
      <div style={{
        display: 'flex',
        gap: 8,
        opacity: bucketOpacity,
      }}>
        {Array.from({ length: tableSize }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 60,
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: i === 2 ? '#ff9800' : 'rgba(255, 255, 255, 0.1)',
              border: `2px solid ${i === 2 ? '#ff9800' : '#333'}`,
              borderRadius: 8,
              fontFamily: "'Courier New', monospace",
              fontSize: 18,
              fontWeight: 'bold',
              color: i === 2 ? '#1a1a2e' : '#666',
            }}
          >
            {i}
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 16,
        fontSize: 14,
        color: '#666',
        opacity: bucketOpacity,
      }}>
        table_size = 8 (2³, 2的幂次)
      </div>
    </div>
  );
}

export const HashValueToBucket: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="哈希值到桶"
          subtitle="取模运算确定桶索引"
        />
      </Sequence>
      <Sequence from={60} durationInFrames={TOTAL_FRAMES - 60}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <ModuloAnimation />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default HashValueToBucket;

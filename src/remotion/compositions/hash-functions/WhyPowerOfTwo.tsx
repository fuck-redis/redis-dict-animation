/**
 * WhyPowerOfTwo
 * 视频时长: 10秒 (300帧 @ 30fps)
 * 为什么选择2的幂次大小
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 300;

function PowerOfTwoAnimation() {
  const frame = useCurrentFrame();

  // 阶段1: 介绍问题 (0-60帧)
  // 阶段2: 模运算符方法 (60-120帧)
  // 阶段3: 按位与方法 (120-180帧)
  // 阶段4: 对比演示 (180-260帧)
  // 阶段5: 结论 (260-300帧)

  const modOpacity = interpolate(frame, [50, 80], [0, 1], { extrapolateLeft: 'clamp' });
  const bitwiseOpacity = interpolate(frame, [120, 150], [0, 1], { extrapolateLeft: 'clamp' });
  const compareOpacity = interpolate(frame, [170, 200], [0, 1], { extrapolateLeft: 'clamp' });
  const conclusionOpacity = interpolate(frame, [250, 280], [0, 1], { extrapolateLeft: 'clamp' });

  // 计算示例
  const hashValue = 0x7b3c9f2a;
  const tableSizePowerOfTwo = 8; // 2^3
  const tableSizeNotPower = 7;

  const bucketIndexPower = hashValue % tableSizePowerOfTwo;
  const bucketIndexNotPower = hashValue % tableSizeNotPower;

  // 按位与计算
  const mask = tableSizePowerOfTwo - 1; // 0x07
  const bucketIndexBitwise = hashValue & mask;

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
      {/* 标题 */}
      <div style={{
        fontSize: 28,
        fontWeight: 'bold',
        color: '#e94560',
        marginBottom: 32,
      }}>
        为什么选择 2 的幂次作为表大小?
      </div>

      {/* 问题描述 */}
      <div style={{
        fontSize: 16,
        color: '#a0a0a0',
        marginBottom: 32,
        textAlign: 'center',
        maxWidth: 600,
      }}>
        当 size 是 2 的幂次时，可以用 <span style={{ color: '#4caf50', fontFamily: 'monospace' }}>按位与</span> 替代 <span style={{ color: '#ff9800', fontFamily: 'monospace' }}>取模运算</span>
      </div>

      {/* 哈希值 */}
      <div style={{
        padding: 16,
        background: 'rgba(33, 150, 243, 0.2)',
        border: '2px solid #2196f3',
        borderRadius: 8,
        marginBottom: 24,
      }}>
        <div style={{ fontSize: 12, color: '#a0a0a0', marginBottom: 4, textAlign: 'center' }}>
          哈希值
        </div>
        <div style={{
          fontSize: 20,
          fontFamily: "'Courier New', monospace",
          color: '#2196f3',
          fontWeight: 'bold',
        }}>
          hash = 0x{hashValue.toString(16)}
        </div>
      </div>

      {/* 两种方法对比 */}
      <div style={{
        display: 'flex',
        gap: 40,
        marginBottom: 32,
      }}>
        {/* 取模方法 */}
        <div style={{
          opacity: modOpacity,
          padding: 20,
          background: 'rgba(255, 152, 0, 0.2)',
          border: '3px solid #ff9800',
          borderRadius: 12,
        }}>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: '#ff9800', marginBottom: 12, textAlign: 'center' }}>
            取模运算 (%)
          </div>
          <div style={{
            fontSize: 18,
            fontFamily: "'Courier New', monospace",
            color: '#a0a0a0',
            marginBottom: 8,
          }}>
            index = hash % size
          </div>
          <div style={{
            fontSize: 16,
            fontFamily: "'Courier New', monospace",
            color: '#a0a0a0',
          }}>
            size = <span style={{ color: '#ff9800' }}>{tableSizeNotPower}</span>
          </div>
          <div style={{
            fontSize: 20,
            fontFamily: "'Courier New', monospace",
            color: '#ff9800',
            fontWeight: 'bold',
            marginTop: 8,
          }}>
            {hashValue} % {tableSizeNotPower} = {bucketIndexNotPower}
          </div>
          <div style={{
            fontSize: 12,
            color: '#666',
            marginTop: 8,
            textAlign: 'center',
          }}>
            需要除法指令 (慢)
          </div>
        </div>

        {/* 按位与方法 */}
        <div style={{
          opacity: bitwiseOpacity,
          padding: 20,
          background: 'rgba(76, 175, 80, 0.2)',
          border: '3px solid #4caf50',
          borderRadius: 12,
        }}>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: '#4caf50', marginBottom: 12, textAlign: 'center' }}>
            按位与 (&)
          </div>
          <div style={{
            fontSize: 18,
            fontFamily: "'Courier New', monospace",
            color: '#a0a0a0',
            marginBottom: 8,
          }}>
            index = hash & (size - 1)
          </div>
          <div style={{
            fontSize: 16,
            fontFamily: "'Courier New', monospace",
            color: '#a0a0a0',
          }}>
            size = <span style={{ color: '#4caf50' }}>{tableSizePowerOfTwo}</span> (2³)
          </div>
          <div style={{
            fontSize: 16,
            fontFamily: "'Courier New', monospace",
            color: '#a0a0a0',
            marginTop: 4,
          }}>
            mask = size-1 = <span style={{ color: '#4caf50' }}>0x{mask.toString(16)}</span>
          </div>
          <div style={{
            fontSize: 20,
            fontFamily: "'Courier New', monospace",
            color: '#4caf50',
            fontWeight: 'bold',
            marginTop: 8,
          }}>
            0x{hashValue.toString(16)} & 0x{mask.toString(16)} = {bucketIndexBitwise}
          </div>
          <div style={{
            fontSize: 12,
            color: '#666',
            marginTop: 8,
            textAlign: 'center',
          }}>
            只需要位运算 (极快)
          </div>
        </div>
      </div>

      {/* 性能对比 */}
      <div style={{
        opacity: conclusionOpacity,
        padding: 20,
        background: 'rgba(233, 69, 96, 0.2)',
        border: '2px solid #e94560',
        borderRadius: 12,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 18, fontWeight: 'bold', color: '#e94560', marginBottom: 8 }}>
          性能差异: 按位与比取模快 5-10 倍
        </div>
        <div style={{ fontSize: 14, color: '#a0a0a0' }}>
          在高频哈希表操作中，这是重要的优化
        </div>
      </div>
    </div>
  );
}

export const WhyPowerOfTwo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="2的幂次优势"
          subtitle="按位与替代取模运算"
        />
      </Sequence>
      <Sequence from={60} durationInFrames={TOTAL_FRAMES - 60}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <PowerOfTwoAnimation />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default WhyPowerOfTwo;

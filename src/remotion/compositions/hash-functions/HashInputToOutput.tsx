/**
 * HashInputToOutput
 * 视频时长: 12秒 (360帧 @ 30fps)
 * 哈希函数输入到输出全过程
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 360;

function HashFlowAnimation() {
  const frame = useCurrentFrame();

  // 阶段1: 输入字符串 (0-60帧)
  // 阶段2: 哈希函数处理 (60-180帧)
  // 阶段3: 输出哈希值 (180-300帧)

  const inputOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp' });
  const inputScale = interpolate(frame, [0, 30], [0.5, 1], { extrapolateLeft: 'clamp' });

  const hashProcessOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: 'clamp' });
  const hashProcessScale = interpolate(frame, [60, 90], [0.8, 1], { extrapolateLeft: 'clamp' });

  const outputOpacity = interpolate(frame, [180, 210], [0, 1], { extrapolateLeft: 'clamp' });
  const outputScale = interpolate(frame, [180, 210], [0.8, 1], { extrapolateLeft: 'clamp' });

  // 箭头动画
  const arrow1Progress = interpolate(frame, [50, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const arrow2Progress = interpolate(frame, [170, 200], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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
      {/* 输入阶段 */}
      <div style={{
        opacity: inputOpacity,
        transform: `scale(${inputScale})`,
        padding: 24,
        background: 'rgba(255, 152, 0, 0.2)',
        border: '3px solid #ff9800',
        borderRadius: 12,
        marginBottom: 20,
      }}>
        <div style={{
          fontSize: 14,
          color: '#a0a0a0',
          marginBottom: 8,
          textAlign: 'center',
        }}>
          输入 (Input)
        </div>
        <div style={{
          fontSize: 32,
          fontFamily: "'Courier New', monospace",
          color: '#ff9800',
          fontWeight: 'bold',
        }}>
          "username"
        </div>
      </div>

      {/* 箭头1 */}
      <div style={{
        width: 200,
        height: 4,
        background: '#333',
        position: 'relative',
        opacity: arrow1Progress,
      }}>
        <div style={{
          position: 'absolute',
          right: -8,
          top: -6,
          width: 0,
          height: 0,
          borderLeft: '16px solid #4caf50',
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
        }} />
        <div style={{
          position: 'absolute',
          top: -24,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 12,
          color: '#4caf50',
          whiteSpace: 'nowrap',
        }}>
          hash()
        </div>
      </div>

      {/* 哈希函数处理阶段 */}
      <div style={{
        opacity: hashProcessOpacity,
        transform: `scale(${hashProcessScale})`,
        padding: 24,
        background: 'rgba(76, 175, 80, 0.2)',
        border: '3px solid #4caf50',
        borderRadius: 12,
        marginTop: 20,
        marginBottom: 20,
      }}>
        <div style={{
          fontSize: 14,
          color: '#a0a0a0',
          marginBottom: 8,
          textAlign: 'center',
        }}>
          哈希函数 (SipHash)
        </div>
        <div style={{
          fontSize: 18,
          fontFamily: "'Courier New', monospace",
          color: '#4caf50',
        }}>
          将任意长度输入
        </div>
        <div style={{
          fontSize: 14,
          color: '#666',
          textAlign: 'center',
          marginTop: 8,
        }}>
          ↓
        </div>
        <div style={{
          fontSize: 18,
          fontFamily: "'Courier New', monospace",
          color: '#4caf50',
        }}>
          转换为固定长度输出
        </div>
      </div>

      {/* 箭头2 */}
      <div style={{
        width: 200,
        height: 4,
        background: '#333',
        position: 'relative',
        opacity: arrow2Progress,
      }}>
        <div style={{
          position: 'absolute',
          right: -8,
          top: -6,
          width: 0,
          height: 0,
          borderLeft: '16px solid #2196f3',
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
        }} />
      </div>

      {/* 输出阶段 */}
      <div style={{
        opacity: outputOpacity,
        transform: `scale(${outputScale})`,
        padding: 24,
        background: 'rgba(33, 150, 243, 0.2)',
        border: '3px solid #2196f3',
        borderRadius: 12,
        marginTop: 20,
      }}>
        <div style={{
          fontSize: 14,
          color: '#a0a0a0',
          marginBottom: 8,
          textAlign: 'center',
        }}>
          哈希值 (Hash Value)
        </div>
        <div style={{
          fontSize: 28,
          fontFamily: "'Courier New', monospace",
          color: '#2196f3',
          fontWeight: 'bold',
          wordBreak: 'break-all',
        }}>
          0x7b3c9f2a4e1d8b5c
        </div>
        <div style={{
          fontSize: 12,
          color: '#666',
          marginTop: 8,
          textAlign: 'center',
        }}>
          64位整数
        </div>
      </div>
    </div>
  );
}

export const HashInputToOutput: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="哈希函数"
          subtitle="输入到输出的映射过程"
        />
      </Sequence>
      <Sequence from={60} durationInFrames={TOTAL_FRAMES - 60}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <HashFlowAnimation />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default HashInputToOutput;

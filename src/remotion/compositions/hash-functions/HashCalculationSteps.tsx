/**
 * 哈希计算步骤演示
 * 视频时长: 15秒 (450帧 @ 30fps)
 * 展示一个键如何被哈希并映射到桶索引
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const TOTAL_FRAMES = 450; // 15秒

// 模拟 DJB2 哈希函数
function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash; // 转换为32位整数
  }
  return Math.abs(hash);
}

function StepBox({
  label,
  value,
  color,
  opacity,
  translateY,
}: {
  label: string;
  value: string;
  color: string;
  opacity: number;
  translateY: number;
}) {
  return (
    <div
      style={{
        padding: 20,
        background: `rgba(${color}, 0.15)`,
        border: `3px solid ${color}`,
        borderRadius: 12,
        minWidth: 200,
        textAlign: 'center',
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>{label}</div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          fontFamily: "'Courier New', monospace",
          color: 'white',
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Arrow({ opacity }: { opacity: number }) {
  return (
    <div
      style={{
        fontSize: 36,
        color: '#4caf50',
        opacity,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      ➜
    </div>
  );
}

function BucketVisualization({
  bucketIndex,
  tableSize,
  highlightedBuckets,
}: {
  bucketIndex: number;
  tableSize: number;
  highlightedBuckets: number[];
}) {
  const buckets = Array.from({ length: tableSize }, (_, i) => i);

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
      {buckets.map((i) => {
        const isHighlighted = highlightedBuckets.includes(i);
        const isTarget = i === bucketIndex;

        return (
          <div
            key={i}
            style={{
              width: 70,
              height: 60,
              background: isTarget
                ? '#4caf50'
                : isHighlighted
                ? 'rgba(255, 152, 0, 0.3)'
                : 'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${
                isTarget ? '#4caf50' : isHighlighted ? '#ff9800' : '#333'
              }`,
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: isTarget ? 'white' : '#666',
                fontFamily: "'Courier New', monospace",
              }}
            >
              [{i}]
            </div>
            {isTarget && (
              <div style={{ fontSize: 10, color: 'white', marginTop: 2 }}>target</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export const HashCalculationSteps: React.FC = () => {
  const frame = useCurrentFrame();

  // 各阶段时间
  const phase1End = 90;   // 标题
  const phase2End = 210;  // 输入键
  const phase3End = 330;  // 哈希计算
  const phase4End = 450; // 桶索引

  // 计算哈希值
  const key = 'username';
  const hash = djb2Hash(key);
  const tableSize = 8;
  const bucketIndex = hash & (tableSize - 1);

  // 阶段控制
  const showKey = frame >= 90 && frame < 210;
  const showHash = frame >= 210 && frame < 330;
  const showBucket = frame >= 330;

  const keyOpacity = interpolate(
    showKey ? frame - 90 : frame >= 210 ? Math.max(0, 330 - frame) : 0,
    [0, 20],
    [0, 1],
    { extrapolateLeft: 'clamp' }
  );
  const keyTranslateY = interpolate(
    showKey ? frame - 90 : frame >= 210 ? Math.max(0, 330 - frame) : 0,
    [0, 20],
    [20, 0],
    { extrapolateLeft: 'clamp' }
  );

  const hashOpacity = interpolate(
    showHash ? frame - 210 : frame >= 330 ? Math.max(0, 450 - frame) : 0,
    [0, 20],
    [0, 1],
    { extrapolateLeft: 'clamp' }
  );
  const hashTranslateY = interpolate(
    showHash ? frame - 210 : frame >= 330 ? Math.max(0, 450 - frame) : 0,
    [0, 20],
    [20, 0],
    { extrapolateLeft: 'clamp' }
  );

  const bucketOpacity = interpolate(showBucket ? frame - 330 : 0, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
  });
  const bucketTranslateY = interpolate(showBucket ? frame - 330 : 0, [0, 20], [20, 0], {
    extrapolateLeft: 'clamp',
  });

  const arrow1Opacity = showHash || (frame >= 210 && frame < 330) ? 1 : 0;
  const arrow2Opacity = showBucket || (frame >= 330 && frame < 450) ? 1 : 0;

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={phase1End}>
        <SceneNarrator
          title="哈希计算步骤"
          subtitle="从键到桶索引的旅程"
        />
      </Sequence>

      {/* 第二段: 键输入 */}
      <Sequence from={90} durationInFrames={120}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: '#e94560', marginBottom: 32 }}>步骤 1: 输入键</h2>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
            <StepBox
              label="输入键 (Key)"
              value={key}
              color="233, 69, 96"
              opacity={keyOpacity}
              translateY={keyTranslateY}
            />
          </div>

          <div
            style={{
              padding: 24,
              background: 'rgba(33, 150, 243, 0.2)',
              border: '2px solid #2196f3',
              borderRadius: 12,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 18, color: '#a0a0a0', marginBottom: 8 }}>
              键可以是任意字符串:
            </div>
            <div style={{ fontSize: 20, color: 'white', fontFamily: "'Courier New', monospace" }}>
              "username", "user:1000:name", "session:abc123"
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 哈希计算 */}
      <Sequence from={210} durationInFrames={120}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: '#ff9800', marginBottom: 32 }}>步骤 2: 哈希函数</h2>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
            <StepBox
              label="输入键"
              value={key}
              color="233, 69, 96"
              opacity={hashOpacity}
              translateY={hashTranslateY}
            />
            <Arrow opacity={arrow1Opacity} />
            <StepBox
              label="哈希值 (Hash)"
              value={`0x${hash.toString(16).toUpperCase()}`}
              color="255, 152, 0"
              opacity={hashOpacity}
              translateY={hashTranslateY}
            />
          </div>

          <div
            style={{
              marginTop: 32,
              padding: 20,
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 8,
              fontFamily: "'Courier New', monospace",
              fontSize: 16,
            }}
          >
            <div style={{ color: '#4caf50' }}>// DJB2 哈希函数</div>
            <div style={{ color: '#a0a0a0' }}>
              hash = 5381;{'\n'}
              for each char in key:{'{'} {'\n'}
              {'  '}hash = ((hash &lt;&lt; 5) + hash) + char;{'\n'}
              {'}'}
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第四段: 取模计算桶索引 */}
      <Sequence from={330} durationInFrames={120}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: '#4caf50', marginBottom: 24 }}>步骤 3: 计算桶索引</h2>

          <div
            style={{
              padding: 20,
              background: 'rgba(76, 175, 80, 0.2)',
              border: '2px solid #4caf50',
              borderRadius: 12,
              marginBottom: 24,
              fontFamily: "'Courier New', monospace",
              fontSize: 18,
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#a0a0a0', marginBottom: 8 }}>index = hash & (size - 1)</div>
            <div style={{ color: 'white' }}>
              index = 0x{hash.toString(16).toUpperCase()} & (8 - 1)
            </div>
            <div style={{ color: '#4caf50', fontSize: 24, marginTop: 8, fontWeight: 'bold' }}>
              = {bucketIndex}
            </div>
          </div>

          <div style={{ opacity: bucketOpacity, transform: `translateY(${bucketTranslateY}px)` }}>
            <div style={{ color: '#a0a0a0', marginBottom: 16, textAlign: 'center' }}>
              桶表大小: {tableSize} (必须是 2 的幂次)
            </div>
            <BucketVisualization
              bucketIndex={bucketIndex}
              tableSize={tableSize}
              highlightedBuckets={[]}
            />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default HashCalculationSteps;

/**
 * BucketIndexCalculation
 * 视频时长: 10秒 (300帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 300; // 10秒 * 30fps

// 模拟 DJB2 哈希函数
function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function StepBox({
  label,
  value,
  color,
  opacity,
  translateY,
  subValue,
}: {
  label: string;
  value: string;
  color: string;
  opacity: number;
  translateY: number;
  subValue?: string;
}) {
  return (
    <div
      style={{
        padding: '20px 32px',
        background: `rgba(${color}, 0.15)`,
        border: `3px solid ${color}`,
        borderRadius: 12,
        minWidth: 220,
        textAlign: 'center',
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>{label}</div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 'bold',
          fontFamily: "'Courier New', monospace",
          color: 'white',
        }}
      >
        {value}
      </div>
      {subValue && (
        <div style={{ fontSize: 14, color: '#a0a0a0', marginTop: 8 }}>{subValue}</div>
      )}
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
  highlightIndex,
}: {
  bucketIndex: number;
  tableSize: number;
  highlightIndex: boolean;
}) {
  const frame = useCurrentFrame();
  const buckets = Array.from({ length: tableSize }, (_, i) => i);

  const showAnimation = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp' });

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
      {buckets.map((i) => {
        const isTarget = i === bucketIndex;
        const isHighlighted = highlightIndex && (frame > 150);

        const scale = isTarget ? interpolate(Math.max(0, frame - 150), [0, 20], [1, 1.15], { extrapolateLeft: 'clamp' }) : 1;

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
              transform: `scale(${scale})`,
              transition: 'transform 0.2s ease',
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

function FormulaBox({
  formula,
  variables,
  highlight,
}: {
  formula: string;
  variables: { name: string; value: string; desc: string }[];
  highlight: boolean;
}) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp' });
  const glowIntensity = highlight ? interpolate(frame, [0, 30, 60], [0, 1, 0], { extrapolateLeft: 'clamp' }) : 0;

  return (
    <div
      style={{
        padding: 24,
        background: 'rgba(76, 175, 80, 0.15)',
        border: `3px solid #4caf50`,
        borderRadius: 12,
        opacity,
        boxShadow: `0 0 ${20 * glowIntensity}px rgba(76, 175, 80, 0.5)`,
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontFamily: "'Courier New', monospace",
          color: '#4caf50',
          textAlign: 'center',
          marginBottom: 20,
        }}
      >
        {formula}
      </div>
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
        {variables.map((v) => (
          <div
            key={v.name}
            style={{
              padding: '8px 16px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 8,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 16, color: '#4caf50', fontWeight: 'bold' }}>{v.name}</div>
            <div style={{ fontSize: 14, color: 'white' }}>= {v.value}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{v.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const BucketIndexCalculation: React.FC = () => {
  const frame = useCurrentFrame();

  // 计算示例
  const key = 'name';
  const hash = djb2Hash(key);
  const tableSize = 8;
  const bucketIndex = hash & (tableSize - 1);

  // 阶段控制
  const phase1End = 60;
  const phase2End = 150;
  const phase3End = 240;
  const phase4End = 300;

  const showKey = frame >= 60 && frame < 150;
  const showHash = frame >= 150 && frame < 240;
  const showBucket = frame >= 240;

  // 动画数值
  const keyOpacity = interpolate(showKey ? frame - 60 : 0, [0, 20], [0, 1], { extrapolateLeft: 'clamp' });
  const keyTranslateY = interpolate(showKey ? frame - 60 : 0, [0, 20], [20, 0], { extrapolateLeft: 'clamp' });

  const hashOpacity = interpolate(showHash ? frame - 150 : 0, [0, 20], [0, 1], { extrapolateLeft: 'clamp' });
  const hashTranslateY = interpolate(showHash ? frame - 150 : 0, [0, 20], [20, 0], { extrapolateLeft: 'clamp' });

  const bucketOpacity = interpolate(showBucket ? frame - 240 : 0, [0, 20], [0, 1], { extrapolateLeft: 'clamp' });
  const bucketTranslateY = interpolate(showBucket ? frame - 240 : 0, [0, 20], [20, 0], { extrapolateLeft: 'clamp' });

  const arrow1Opacity = showHash ? 1 : 0;
  const arrow2Opacity = showBucket ? 1 : 0;

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* Sequence 1: Title */}
      <Sequence from={0} durationInFrames={phase1End}>
        <SceneNarrator
          title="桶索引计算过程"
          subtitle="从哈希值到桶位置的映射"
        />
      </Sequence>

      {/* Sequence 2: Key Input */}
      <Sequence from={60} durationInFrames={90}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h2 style={{ color: '#e94560', marginBottom: 40, fontSize: 36 }}>步骤 1: 输入键</h2>

          <StepBox
            label="输入键 (Key)"
            value={key}
            color="233, 69, 96"
            opacity={keyOpacity}
            translateY={keyTranslateY}
            subValue="字符串类型"
          />

          <div
            style={{
              marginTop: 40,
              padding: 20,
              background: 'rgba(33, 150, 243, 0.2)',
              border: '2px solid #2196f3',
              borderRadius: 12,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 16, color: '#a0a0a0', marginBottom: 8 }}>
              键可以是任意字符串
            </div>
            <div style={{ fontSize: 18, color: 'white', fontFamily: "'Courier New', monospace" }}>
              "name", "user:1000", "session:abc123"
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Sequence 3: Hash Calculation */}
      <Sequence from={150} durationInFrames={90}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h2 style={{ color: '#ff9800', marginBottom: 40, fontSize: 36 }}>步骤 2: 计算哈希值</h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
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
              subValue="32位整数"
            />
          </div>

          <div
            style={{
              marginTop: 32,
              padding: 20,
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 8,
              fontFamily: "'Courier New', monospace",
              fontSize: 15,
              color: '#a0a0a0',
            }}
          >
            <div style={{ color: '#4caf50', marginBottom: 8 }}>// DJB2 哈希函数</div>
            hash = 5381;
            {'\n'}for each char in key: hash = ((hash &lt;&lt; 5) + hash) + char;
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Sequence 4: Bucket Index */}
      <Sequence from={240} durationInFrames={60}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h2 style={{ color: '#4caf50', marginBottom: 24, fontSize: 36 }}>步骤 3: 计算桶索引</h2>

          <div style={{ opacity: bucketOpacity, transform: `translateY(${bucketTranslateY}px)` }}>
            <FormulaBox
              formula="index = hash & (size - 1)"
              variables={[
                { name: 'hash', value: `0x${hash.toString(16).toUpperCase()}`, desc: '哈希值' },
                { name: 'size', value: String(tableSize), desc: '桶大小(2^n)' },
                { name: 'index', value: String(bucketIndex), desc: '桶索引' },
              ]}
              highlight={true}
            />
          </div>

          <div style={{ marginTop: 32, opacity: bucketOpacity }}>
            <BucketVisualization
              bucketIndex={bucketIndex}
              tableSize={tableSize}
              highlightIndex={true}
            />
          </div>

          <div
            style={{
              marginTop: 24,
              padding: 16,
              background: 'rgba(76, 175, 80, 0.2)',
              borderRadius: 8,
              fontSize: 16,
              color: '#4caf50',
            }}
          >
            使用 & (size-1) 而不是 %，因为 size 必须是 2 的幂次
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default BucketIndexCalculation;

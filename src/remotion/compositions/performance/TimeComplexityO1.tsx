/**
 * TimeComplexityO1
 * 视频时长: 10秒 (300帧 @ 30fps)
 * O(1)时间复杂度演示 - 无论数据规模如何，查找时间保持恒定
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 300;

function HashTableVisual({ size, highlightIndex, showSearch }: { size: number; highlightIndex: number; showSearch: boolean }) {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {/* 哈希表桶 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          justifyContent: 'center',
          maxWidth: 600,
        }}
      >
        {Array.from({ length: size }, (_, i) => {
          const isHighlighted = showSearch && i === highlightIndex;
          const isFound = isHighlighted && frame > 60;

          return (
            <div
              key={i}
              style={{
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isFound
                  ? colors.entryNewBg
                  : isHighlighted
                  ? colors.entryHighlightedBg
                  : i < size / 2
                  ? colors.bucketEmpty
                  : colors.bucketSingle,
                border: `2px solid ${
                  isFound
                    ? colors.entryNewBorder
                    : isHighlighted
                    ? colors.entryHighlightedBorder
                    : colors.border
                }`,
                borderRadius: 8,
                fontFamily: "'Courier New', monospace",
                fontSize: 14,
                color: colors.textSecondary,
                transition: 'all 0.3s ease',
                transform: isHighlighted ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {i}
            </div>
          );
        })}
      </div>

      {/* 指针指示 */}
      {showSearch && (
        <div
          style={{
            marginTop: 16,
            fontSize: 18,
            color: '#e94560',
            fontWeight: 'bold',
          }}
        >
          一步定位! 直接访问索引 {highlightIndex}
        </div>
      )}
    </div>
  );
}

function TimeComplexityChart() {
  const frame = useCurrentFrame();

  const dataSizes = [10, 50, 100, 500, 1000];
  const o1Times = [1, 1, 1, 1, 1]; // O(1) 恒定时间
  const onTimes = [1, 5, 10, 50, 100]; // O(N) 线性时间

  return (
    <div
      style={{
        display: 'flex',
        gap: 32,
        marginTop: 32,
        justifyContent: 'center',
      }}
    >
      {/* O(1) 图表 */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 20, color: colors.success, marginBottom: 16, fontWeight: 'bold' }}>
          O(1) 恒定时间
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
          {dataSizes.map((size, i) => {
            const delay = i * 20;
            const height = interpolate(Math.max(0, frame - delay), [0, 30], [0, 100], { extrapolateLeft: 'clamp' });

            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: 40,
                    height: `${height}%`,
                    background: `linear-gradient(180deg, ${colors.success} 0%, ${colors.success}88 100%)`,
                    borderRadius: '4px 4px 0 0',
                    minHeight: 4,
                  }}
                />
                <div style={{ fontSize: 10, color: '#a0a0a0', marginTop: 4 }}>{size}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* O(N) 图表 */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 20, color: colors.warning, marginBottom: 16, fontWeight: 'bold' }}>
          O(N) 线性时间
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
          {dataSizes.map((size, i) => {
            const delay = i * 20;
            const normalizedTime = (onTimes[i] / 100) * 100;
            const height = interpolate(Math.max(0, frame - delay), [0, 30], [0, normalizedTime], { extrapolateLeft: 'clamp' });

            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: 40,
                    height: `${height}%`,
                    background: `linear-gradient(180deg, ${colors.warning} 0%, ${colors.warning}88 100%)`,
                    borderRadius: '4px 4px 0 0',
                    minHeight: 4,
                  }}
                />
                <div style={{ fontSize: 10, color: '#a0a0a0', marginTop: 4 }}>{size}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AnimatedComponent() {
  const frame = useCurrentFrame();

  // 不同阶段的演示
  const stages = [
    { size: 16, searchIndex: 7, duration: 90, title: '小规模数据 (16个桶)' },
    { size: 64, searchIndex: 23, duration: 90, title: '中等规模 (64个桶)' },
    { size: 256, searchIndex: 127, duration: 120, title: '大规模数据 (256个桶)' },
  ];

  let currentStage = 0;
  let accumulatedFrames = 0;

  for (let i = 0; i < stages.length; i++) {
    if (frame < accumulatedFrames + stages[i].duration) {
      currentStage = i;
      break;
    }
    accumulatedFrames += stages[i].duration;
  }

  const stage = stages[currentStage];
  const localFrame = frame - accumulatedFrames;
  const showSearch = localFrame > 30;

  return (
    <div style={{ padding: 48 }}>
      <h2 style={{ fontSize: 36, color: colors.primary, textAlign: 'center', marginBottom: 8 }}>
        O(1) 时间复杂度
      </h2>
      <p style={{ fontSize: 20, color: '#a0a0a0', textAlign: 'center', marginBottom: 32 }}>
        哈希表查找只需一次计算，无论数据规模多大
      </p>

      <HashTableVisual size={stage.size} highlightIndex={stage.searchIndex} showSearch={showSearch} />

      <div
        style={{
          marginTop: 24,
          padding: 16,
          background: 'rgba(33, 150, 243, 0.2)',
          border: `2px solid ${colors.primary}`,
          borderRadius: 12,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 24, color: 'white', fontFamily: "'Courier New', monospace" }}>
          index = hash(key) % {stage.size}
        </div>
        <div style={{ fontSize: 18, color: '#a0a0a0', marginTop: 8 }}>
          计算: hash("{stage.searchIndex}") = {stage.searchIndex} % {stage.size} = {stage.searchIndex}
        </div>
      </div>

      {currentStage === stages.length - 1 && (
        <TimeComplexityChart />
      )}

      <div
        style={{
          marginTop: 32,
          fontSize: 18,
          color: colors.success,
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        查找次数: O(1) = 1次!
      </div>
    </div>
  );
}

export const TimeComplexityO1: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="O(1) 时间复杂度"
          subtitle="哈希表的最理想性能"
        />
      </Sequence>
      <Sequence from={60} durationInFrames={TOTAL_FRAMES - 60}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <AnimatedComponent />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default TimeComplexityO1;

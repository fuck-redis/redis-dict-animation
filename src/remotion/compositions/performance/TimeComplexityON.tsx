/**
 * TimeComplexityON
 * 视频时长: 10秒 (300帧 @ 30fps)
 * O(N)时间复杂度演示 - 线性时间增长作为冲突链长度增加
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 300;

function CollisionChain({ chainLength, highlightIndex }: { chainLength: number; highlightIndex: number }) {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      {/* 桶 */}
      <div
        style={{
          width: 120,
          height: 80,
          background: chainLength > 3 ? colors.bucketConflictHigh : chainLength > 2 ? colors.bucketConflict3 : colors.bucketConflict2,
          border: `3px solid ${colors.entryBorder}`,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          color: colors.textPrimary,
          fontWeight: 'bold',
        }}
      >
        Bucket [{highlightIndex}]
      </div>

      {/* 链箭头 */}
      {chainLength > 0 && (
        <div style={{ fontSize: 24, color: colors.arrowColor }}>↓</div>
      )}

      {/* 链上的节点 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        {Array.from({ length: chainLength }, (_, i) => {
          const isHighlighted = frame >= 60 + i * 30;
          const isLast = i === chainLength - 1;

          return (
            <React.Fragment key={i}>
              <div
                style={{
                  padding: '12px 24px',
                  background: isHighlighted ? colors.entryHighlightedBg : colors.entryBg,
                  border: `2px solid ${isHighlighted ? colors.entryHighlightedBorder : colors.entryBorder}`,
                  borderRadius: 8,
                  fontFamily: "'Courier New', monospace",
                  fontSize: 14,
                  color: colors.keyColor,
                  transform: isHighlighted ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                }}
              >
                key_{i + 1}
              </div>
              {i < chainLength - 1 && (
                <div style={{ fontSize: 20, color: colors.arrowColor }}>↓</div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* NULL 结束 */}
      {chainLength > 0 && (
        <>
          <div style={{ fontSize: 20, color: colors.arrowColor }}>↓</div>
          <div
            style={{
              padding: '8px 16px',
              color: colors.textMuted,
              fontStyle: 'italic',
            }}
          >
            NULL
          </div>
        </>
      )}
    </div>
  );
}

function SearchAnimation({ chainLength }: { chainLength: number }) {
  const frame = useCurrentFrame();
  const searchSteps = [];

  for (let i = 0; i < chainLength; i++) {
    searchSteps.push(
      interpolate(frame, [60 + i * 30, 80 + i * 30], [0, 1], { extrapolateLeft: 'clamp' })
    );
  }

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ fontSize: 18, color: '#a0a0a0', marginBottom: 16 }}>搜索过程:</div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {searchSteps.map((progress, i) => (
          <div
            key={i}
            style={{
              padding: '8px 16px',
              background: progress > 0 ? colors.entryHighlightedBg : 'rgba(255,255,255,0.05)',
              border: `2px solid ${progress > 0 ? colors.entryHighlightedBorder : 'transparent'}`,
              borderRadius: 8,
              color: progress > 0 ? colors.textPrimary : '#666',
              transition: 'all 0.3s ease',
            }}
          >
            比较 #{i + 1}
          </div>
        ))}
      </div>
      {frame > 60 + chainLength * 30 && (
        <div
          style={{
            marginTop: 16,
            fontSize: 20,
            color: colors.danger,
            fontWeight: 'bold',
          }}
        >
          未找到! 需要遍历整个链
        </div>
      )}
    </div>
  );
}

function ComplexityGraph() {
  const frame = useCurrentFrame();

  const chainLengths = [1, 2, 3, 4, 5, 6];
  const times = [1, 2, 3, 4, 5, 6];

  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ fontSize: 20, color: 'white', marginBottom: 16, textAlign: 'center' }}>
        时间复杂度: O(N)
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, justifyContent: 'center', height: 150 }}>
        {chainLengths.map((length, i) => {
          const delay = i * 25;
          const height = interpolate(Math.max(0, frame - delay), [0, 30], [0, (length / 6) * 100], { extrapolateLeft: 'clamp' });

          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: 50,
                  height: `${height}%`,
                  background: `linear-gradient(180deg, ${colors.danger} 0%, ${colors.danger}88 100%)`,
                  borderRadius: '4px 4px 0 0',
                  minHeight: 4,
                }}
              />
              <div style={{ fontSize: 12, color: '#a0a0a0', marginTop: 4 }}>{length}</div>
              <div style={{ fontSize: 10, color: colors.danger }}>{times[i]}步</div>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: 'center', fontSize: 14, color: '#a0a0a0', marginTop: 8 }}>
        链长度 (N)
      </div>
    </div>
  );
}

function AnimatedComponent() {
  const frame = useCurrentFrame();

  // 链长度随时间增长
  const chainLength = Math.min(6, Math.floor(frame / 40) + 1);
  const highlightIndex = 0;

  return (
    <div style={{ padding: 48 }}>
      <h2 style={{ fontSize: 36, color: colors.danger, textAlign: 'center', marginBottom: 8 }}>
        O(N) 时间复杂度
      </h2>
      <p style={{ fontSize: 20, color: '#a0a0a0', textAlign: 'center', marginBottom: 32 }}>
        当发生哈希冲突时，最坏情况需要遍历整个链
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 48 }}>
        <CollisionChain chainLength={chainLength} highlightIndex={highlightIndex} />

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 200 }}>
          <div
            style={{
              padding: 24,
              background: 'rgba(244, 67, 54, 0.2)',
              border: `2px solid ${colors.danger}`,
              borderRadius: 12,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 18, color: '#a0a0a0', marginBottom: 8 }}>当前链长度</div>
            <div style={{ fontSize: 48, color: colors.danger, fontWeight: 'bold' }}>{chainLength}</div>
            <div style={{ fontSize: 16, color: '#a0a0a0', marginTop: 8 }}>
              查找需要 {chainLength} 次比较
            </div>
          </div>

          {chainLength >= 4 && <ComplexityGraph />}
        </div>
      </div>

      <SearchAnimation chainLength={chainLength} />

      <div
        style={{
          marginTop: 32,
          padding: 16,
          background: 'rgba(255, 152, 0, 0.2)',
          border: `2px solid ${colors.warning}`,
          borderRadius: 12,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 18, color: colors.warning, fontWeight: 'bold' }}>
          警告: 链越长，性能越差!
        </div>
        <div style={{ fontSize: 14, color: '#a0a0a0', marginTop: 4 }}>
          高负载因子会导致长链，降低查找效率
        </div>
      </div>
    </div>
  );
}

export const TimeComplexityON: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="O(N) 时间复杂度"
          subtitle="哈希冲突带来的性能挑战"
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

export default TimeComplexityON;

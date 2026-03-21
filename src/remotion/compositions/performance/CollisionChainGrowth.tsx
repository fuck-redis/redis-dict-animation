/**
 * CollisionChainGrowth
 * 视频时长: 12秒 (360帧 @ 30fps)
 * 冲突链增长动画 - 展示随着更多冲突发生，链如何增长
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 360;

function BucketVisualization({ chainData }: { chainData: Array<{ key: string; value: number }> }) {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      {/* 桶 */}
      <div
        style={{
          width: 140,
          height: 60,
          background: chainData.length > 4 ? colors.bucketConflictHigh : chainData.length > 2 ? colors.bucketConflict3 : colors.bucketConflict2,
          border: `3px solid ${colors.entryBorder}`,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 'bold',
          color: colors.textPrimary,
        }}
      >
        Bucket [hash]
      </div>

      {/* 链 */}
      {chainData.length > 0 && (
        <>
          <div style={{ fontSize: 24, color: colors.arrowColor }}>↓</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
            {chainData.map((item, i) => {
              const isNew = i === chainData.length - 1;
              const showProgress = isNew && frame % 30 < 15;

              return (
                <React.Fragment key={i}>
                  <div
                    style={{
                      padding: '10px 20px',
                      background: isNew ? colors.entryNewBg : colors.entryBg,
                      border: `2px solid ${isNew ? colors.entryNewBorder : colors.entryBorder}`,
                      borderRadius: 6,
                      fontFamily: "'Courier New', monospace",
                      fontSize: 13,
                      color: colors.keyColor,
                      transform: isNew ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: isNew ? '0 0 10px rgba(76, 175, 80, 0.5)' : 'none',
                    }}
                  >
                    {item.key}
                    {showProgress && <span style={{ color: colors.success }}> ●</span>}
                  </div>
                  {i < chainData.length - 1 && (
                    <div style={{ fontSize: 16, color: colors.arrowColor }}>↓</div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function HashTableOverview({ buckets, highlightBucket }: { buckets: number[][]; highlightBucket: number }) {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 500 }}>
      {buckets.map((bucket, i) => {
        const isHighlighted = i === highlightBucket;
        const length = bucket.length;

        return (
          <div
            key={i}
            style={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isHighlighted
                ? colors.entryHighlightedBg
                : length === 0
                ? colors.bucketEmpty
                : length === 1
                ? colors.bucketSingle
                : length === 2
                ? colors.bucketConflict2
                : colors.bucketConflictHigh,
              border: `2px solid ${isHighlighted ? colors.entryHighlightedBorder : colors.border}`,
              borderRadius: 4,
              fontSize: 11,
              color: length > 0 ? colors.textPrimary : colors.textMuted,
              fontWeight: length > 0 ? 'bold' : 'normal',
              transform: isHighlighted ? 'scale(1.2)' : 'scale(1)',
              transition: 'all 0.2s ease',
            }}
          >
            {length === 0 ? '○' : length}
          </div>
        );
      })}
    </div>
  );
}

function ChainLengthGraph() {
  const frame = useCurrentFrame();

  const chainLengths = [0, 1, 1, 1, 2, 1, 3, 1, 1, 2, 1, 1, 1, 0, 2, 1];
  const maxLength = Math.max(...chainLengths);

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 8, textAlign: 'center' }}>
        链长度分布
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60, justifyContent: 'center' }}>
        {chainLengths.map((length, i) => {
          const height = interpolate(frame, [0, 30], [0, (length / maxLength) * 60], { extrapolateLeft: 'clamp' });

          return (
            <div
              key={i}
              style={{
                width: 20,
                height: Math.max(4, height),
                background: length === 0 ? colors.bucketEmpty : length === 1 ? colors.bucketSingle : colors.bucketConflictHigh,
                borderRadius: '2px 2px 0 0',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function AnimatedComponent() {
  const frame = useCurrentFrame();

  // 模拟冲突链增长过程
  const insertions = [
    { key: 'apple', bucket: 3 },
    { key: 'cherry', bucket: 3 },
    { key: 'date', bucket: 7 },
    { key: 'fig', bucket: 7 },
    { key: 'grape', bucket: 7 },
    { key: 'kiwi', bucket: 3 },
  ];

  // 根据帧数确定当前显示的链
  const insertionIndex = Math.min(insertions.length - 1, Math.floor(frame / 50));

  // 构建当前状态
  const bucketMap: Record<number, string[]> = {};
  for (let i = 0; i <= insertionIndex; i++) {
    const bucket = insertions[i].bucket;
    if (!bucketMap[bucket]) bucketMap[bucket] = [];
    bucketMap[bucket].push(insertions[i].key);
  }

  const currentBucket = insertions[insertionIndex].bucket;
  const currentChain = bucketMap[currentBucket] || [];

  // 构建完整的哈希表视图
  const allBuckets: number[][] = Array.from({ length: 16 }, () => []);
  for (let i = 0; i <= insertionIndex; i++) {
    const bucket = insertions[i].bucket;
    allBuckets[bucket].push(i);
  }

  return (
    <div style={{ padding: 48 }}>
      <h2 style={{ fontSize: 36, color: colors.danger, textAlign: 'center', marginBottom: 8 }}>
        冲突链增长动画
      </h2>
      <p style={{ fontSize: 20, color: '#a0a0a0', textAlign: 'center', marginBottom: 24 }}>
        当多个键哈希到相同位置时，形成冲突链
      </p>

      {/* 当前插入操作 */}
      <div
        style={{
          padding: 16,
          background: 'rgba(33, 150, 243, 0.2)',
          border: `2px solid ${colors.primary}`,
          borderRadius: 12,
          textAlign: 'center',
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 16, color: '#a0a0a0' }}>正在插入:</div>
        <div style={{ fontSize: 28, color: colors.primary, fontWeight: 'bold', fontFamily: "'Courier New', monospace" }}>
          key = "{insertions[insertionIndex].key}"
        </div>
        <div style={{ fontSize: 14, color: '#a0a0a0', marginTop: 4 }}>
          hash("{insertions[insertionIndex].key}") % 16 = {currentBucket}
        </div>
      </div>

      {/* 哈希表总览 */}
      <div style={{ marginBottom: 32 }}>
        <HashTableOverview buckets={allBuckets} highlightBucket={currentBucket} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 48 }}>
        {/* 当前冲突链详情 */}
        <div
          style={{
            padding: 24,
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 12,
            minWidth: 200,
          }}
        >
          <div style={{ fontSize: 16, color: '#a0a0a0', marginBottom: 16, textAlign: 'center' }}>
            桶 [{currentBucket}] 的冲突链
          </div>
          <BucketVisualization chainData={currentChain.map((key, i) => ({ key, value: i }))} />

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: '#a0a0a0' }}>链长度:</div>
            <div style={{ fontSize: 32, color: currentChain.length > 3 ? colors.danger : colors.warning, fontWeight: 'bold' }}>
              {currentChain.length}
            </div>
          </div>
        </div>

        {/* 统计信息 */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
          <div
            style={{
              padding: 16,
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 8,
            }}
          >
            <div style={{ fontSize: 14, color: '#a0a0a0' }}>已插入键数</div>
            <div style={{ fontSize: 24, color: 'white', fontWeight: 'bold' }}>{insertionIndex + 1}</div>
          </div>

          <div
            style={{
              padding: 16,
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 8,
            }}
          >
            <div style={{ fontSize: 14, color: '#a0a0a0' }}>冲突次数</div>
            <div style={{ fontSize: 24, color: colors.danger, fontWeight: 'bold' }}>{Math.max(0, insertionIndex - 2)}</div>
          </div>

          <div
            style={{
              padding: 16,
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 8,
            }}
          >
            <div style={{ fontSize: 14, color: '#a0a0a0' }}>最长链</div>
            <div style={{ fontSize: 24, color: colors.warning, fontWeight: 'bold' }}>
              {Math.max(...Object.values(bucketMap).map(b => b.length), 0)}
            </div>
          </div>
        </div>
      </div>

      <ChainLengthGraph />

      {insertionIndex === insertions.length - 1 && (
        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: 'rgba(244, 67, 54, 0.2)',
            border: `2px solid ${colors.danger}`,
            borderRadius: 12,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 18, color: colors.danger, fontWeight: 'bold' }}>
            警告: 链长度为 {currentChain.length}，查找需要 {currentChain.length} 次比较!
          </div>
          <div style={{ fontSize: 14, color: '#a0a0a0', marginTop: 4 }}>
            高负载因子导致更多冲突，性能下降
          </div>
        </div>
      )}
    </div>
  );
}

export const CollisionChainGrowth: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="冲突链增长"
          subtitle="哈希冲突的可视化演示"
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

export default CollisionChainGrowth;

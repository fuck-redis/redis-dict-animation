/**
 * HashDistributionGood
 * 视频时长: 8秒 (240帧 @ 30fps)
 * 良好分布示例
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 240;

function GoodDistributionAnimation() {
  const frame = useCurrentFrame();

  // 动画阶段:
  // 0-60帧: 显示空桶
  // 60-180帧: 逐个添加条目
  // 180-240帧: 显示统计

  const entries = [
    { key: 'apple', hash: 0x7a3c, bucket: 4 },
    { key: 'banana', hash: 0x2f8d, bucket: 5 },
    { key: 'cherry', hash: 0x9e1b, bucket: 3 },
    { key: 'date', hash: 0x4c2a, bucket: 2 },
    { key: 'elder', hash: 0x8f3d, bucket: 5 },
    { key: 'fig', hash: 0x1d7e, bucket: 6 },
    { key: 'grape', hash: 0x6b9c, bucket: 4 },
    { key: 'kiwi', hash: 0x3f5a, bucket: 2 },
  ];

  const tableSize = 8;

  // 计算每个桶的条目
  const buckets: Record<number, typeof entries> = {};
  entries.forEach(e => {
    if (!buckets[e.bucket]) buckets[e.bucket] = [];
    buckets[e.bucket].push(e);
  });

  // 入射动画
  const entriesVisible = Math.min(8, Math.floor((frame - 60) / 15));

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
        color: '#4caf50',
        marginBottom: 32,
      }}>
        良好的哈希分布
      </div>

      {/* 桶网格 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
        marginBottom: 32,
      }}>
        {Array.from({ length: tableSize }).map((_, i) => {
          const bucketEntries = buckets[i] || [];
          const showCount = Math.min(bucketEntries.length, entriesVisible > i ? Math.ceil(entriesVisible / 2) : 0);

          return (
            <div
              key={i}
              style={{
                width: 120,
                minHeight: 100,
                background: bucketEntries.length === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(76, 175, 80, 0.2)',
                border: `2px solid ${bucketEntries.length === 0 ? '#333' : '#4caf50'}`,
                borderRadius: 8,
                padding: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{
                fontSize: 12,
                color: '#666',
                marginBottom: 4,
              }}>
                Bucket {i}
              </div>
              {bucketEntries.slice(0, showCount).map((entry, j) => (
                <div
                  key={j}
                  style={{
                    fontSize: 11,
                    fontFamily: "'Courier New', monospace",
                    color: '#4caf50',
                    padding: '2px 6px',
                    background: 'rgba(76, 175, 80, 0.3)',
                    borderRadius: 4,
                    marginBottom: 2,
                  }}
                >
                  {entry.key}
                </div>
              ))}
              {bucketEntries.length > 0 && (
                <div style={{
                  fontSize: 10,
                  color: '#666',
                  marginTop: 4,
                }}>
                  {bucketEntries.length} item{bucketEntries.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 统计信息 */}
      <div style={{
        display: 'flex',
        gap: 32,
        opacity: frame > 180 ? interpolate(frame, [180, 210], [0, 1], { extrapolateLeft: 'clamp' }) : 0,
      }}>
        <div style={{
          padding: '12px 24px',
          background: 'rgba(76, 175, 80, 0.2)',
          border: '2px solid #4caf50',
          borderRadius: 8,
        }}>
          <div style={{ fontSize: 12, color: '#a0a0a0', marginBottom: 4 }}>负载因子</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#4caf50' }}>1.0</div>
        </div>
        <div style={{
          padding: '12px 24px',
          background: 'rgba(76, 175, 80, 0.2)',
          border: '2px solid #4caf50',
          borderRadius: 8,
        }}>
          <div style={{ fontSize: 12, color: '#a0a0a0', marginBottom: 4 }}>最大链长</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#4caf50' }}>2</div>
        </div>
        <div style={{
          padding: '12px 24px',
          background: 'rgba(76, 175, 80, 0.2)',
          border: '2px solid #4caf50',
          borderRadius: 8,
        }}>
          <div style={{ fontSize: 12, color: '#a0a0a0', marginBottom: 4 }}>标准差</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#4caf50' }}>0.71</div>
        </div>
      </div>
    </div>
  );
}

export const HashDistributionGood: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="良好分布"
          subtitle="哈希值均匀分布"
        />
      </Sequence>
      <Sequence from={60} durationInFrames={TOTAL_FRAMES - 60}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <GoodDistributionAnimation />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default HashDistributionGood;

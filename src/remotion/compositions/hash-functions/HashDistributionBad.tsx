/**
 * HashDistributionBad
 * 视频时长: 8秒 (240帧 @ 30fps)
 * 不良分布示例
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 240;

function BadDistributionAnimation() {
  const frame = useCurrentFrame();

  // 0-60帧: 显示空桶
  // 60-180帧: 逐个添加条目 (集中在桶2)
  // 180-240帧: 显示警告统计

  const entries = [
    { key: 'user_0', hash: 0x002, bucket: 2 },
    { key: 'user_1', hash: 0x00a, bucket: 2 },
    { key: 'user_2', hash: 0x012, bucket: 2 },
    { key: 'user_3', hash: 0x01a, bucket: 2 },
    { key: 'user_4', hash: 0x022, bucket: 2 },
    { key: 'user_5', hash: 0x02a, bucket: 2 },
    { key: 'user_6', hash: 0x032, bucket: 2 },
    { key: 'user_7', hash: 0x03a, bucket: 2 },
    { key: 'item_a', hash: 0x101, bucket: 1 },
    { key: 'item_b', hash: 0x301, bucket: 1 },
  ];

  const tableSize = 8;

  // 计算每个桶的条目
  const buckets: Record<number, typeof entries> = {};
  entries.forEach(e => {
    if (!buckets[e.bucket]) buckets[e.bucket] = [];
    buckets[e.bucket].push(e);
  });

  // 入射动画
  const entriesVisible = Math.min(entries.length, Math.floor((frame - 60) / 10));

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
        color: '#f44336',
        marginBottom: 16,
      }}>
        不良的哈希分布
      </div>
      <div style={{
        fontSize: 14,
        color: '#ff9800',
        marginBottom: 32,
        padding: '8px 16px',
        background: 'rgba(255, 152, 0, 0.2)',
        borderRadius: 6,
      }}>
        哈希函数设计缺陷导致数据聚集
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
          const showCount = Math.min(bucketEntries.length, frame > 60 ? Math.min(entriesVisible, bucketEntries.length) : 0);
          const isCollided = bucketEntries.length > 2;

          return (
            <div
              key={i}
              style={{
                width: 120,
                minHeight: 100,
                background: bucketEntries.length === 0
                  ? 'rgba(255,255,255,0.05)'
                  : isCollided
                    ? 'rgba(244, 67, 54, 0.3)'
                    : 'rgba(255, 152, 0, 0.2)',
                border: `2px solid ${
                  bucketEntries.length === 0
                    ? '#333'
                    : isCollided
                      ? '#f44336'
                      : '#ff9800'
                }`,
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
                    color: isCollided ? '#f44336' : '#ff9800',
                    padding: '2px 6px',
                    background: isCollided
                      ? 'rgba(244, 67, 54, 0.3)'
                      : 'rgba(255, 152, 0, 0.3)',
                    borderRadius: 4,
                    marginBottom: 2,
                  }}
                >
                  {entry.key}
                </div>
              ))}
              {bucketEntries.length > 3 && (
                <div style={{
                  fontSize: 10,
                  color: '#f44336',
                  marginTop: 4,
                  fontWeight: 'bold',
                }}>
                  +{bucketEntries.length - 3} more
                </div>
              )}
              {bucketEntries.length > 0 && (
                <div style={{
                  fontSize: 10,
                  color: '#666',
                  marginTop: 4,
                }}>
                  {bucketEntries.length} items
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 警告统计 */}
      <div style={{
        display: 'flex',
        gap: 32,
        opacity: frame > 180 ? interpolate(frame, [180, 210], [0, 1], { extrapolateLeft: 'clamp' }) : 0,
      }}>
        <div style={{
          padding: '12px 24px',
          background: 'rgba(244, 67, 54, 0.2)',
          border: '2px solid #f44336',
          borderRadius: 8,
        }}>
          <div style={{ fontSize: 12, color: '#a0a0a0', marginBottom: 4 }}>负载因子</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f44336' }}>1.25</div>
        </div>
        <div style={{
          padding: '12px 24px',
          background: 'rgba(244, 67, 54, 0.2)',
          border: '2px solid #f44336',
          borderRadius: 8,
        }}>
          <div style={{ fontSize: 12, color: '#a0a0a0', marginBottom: 4 }}>最大链长</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f44336' }}>8</div>
        </div>
        <div style={{
          padding: '12px 24px',
          background: 'rgba(244, 67, 54, 0.2)',
          border: '2px solid #f44336',
          borderRadius: 8,
        }}>
          <div style={{ fontSize: 12, color: '#a0a0a0', marginBottom: 4 }}>标准差</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f44336' }}>2.65</div>
        </div>
      </div>

      {/* 警告消息 */}
      <div style={{
        marginTop: 24,
        padding: '12px 24px',
        background: 'rgba(244, 67, 54, 0.2)',
        border: '2px solid #f44336',
        borderRadius: 8,
        opacity: frame > 200 ? interpolate(frame, [200, 230], [0, 1], { extrapolateLeft: 'clamp' }) : 0,
      }}>
        <div style={{ fontSize: 16, fontWeight: 'bold', color: '#f44336' }}>
          严重警告: 哈希冲突导致性能退化!
        </div>
        <div style={{ fontSize: 12, color: '#a0a0a0', marginTop: 4 }}>
          查找操作从 O(1) 退化为 O(n)
        </div>
      </div>
    </div>
  );
}

export const HashDistributionBad: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="不良分布"
          subtitle="哈希冲突导致性能问题"
        />
      </Sequence>
      <Sequence from={60} durationInFrames={TOTAL_FRAMES - 60}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <BadDistributionAnimation />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default HashDistributionBad;

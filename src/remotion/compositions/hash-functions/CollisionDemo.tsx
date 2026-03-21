/**
 * 哈希冲突演示
 * 视频时长: 55秒 (1650帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const FPS = 30;
const TOTAL_FRAMES = 1650; // 55秒

function BucketVisualization({
  buckets,
  highlightIndex,
}: {
  buckets: { index: number; keys: string[] }[];
  highlightIndex: number | null;
}) {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
      {buckets.map((bucket) => {
        const isHighlighted = bucket.index === highlightIndex;
        const hasCollision = bucket.keys.length > 1;

        return (
          <div
            key={bucket.index}
            style={{
              width: 80,
              minHeight: 120,
              background: isHighlighted
                ? '#fff9c4'
                : bucket.keys.length === 0
                ? '#fafafa'
                : bucket.keys.length === 1
                ? '#e8f5e9'
                : '#fff3e0',
              border: `2px solid ${
                isHighlighted ? '#ffc107' : hasCollision ? '#ff9800' : bucket.keys.length === 0 ? '#e0e0e0' : '#4caf50'
              }`,
              borderRadius: 8,
              padding: 8,
              transition: 'all 0.3s ease',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: isHighlighted ? '#ffc107' : '#2196f3',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: 14,
                marginBottom: 8,
              }}
            >
              {bucket.index}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {bucket.keys.map((key, i) => (
                <React.Fragment key={key}>
                  {i > 0 && <div style={{ textAlign: 'center', color: '#666', fontSize: 10 }}>↓</div>}
                  <div
                    style={{
                      padding: '4px 6px',
                      background: 'white',
                      border: `1px solid ${isHighlighted ? '#ffc107' : '#ccc'}`,
                      borderRadius: 4,
                      fontSize: 11,
                      fontFamily: "'Courier New', monospace",
                      textAlign: 'center',
                    }}
                  >
                    {key}
                  </div>
                </React.Fragment>
              ))}
            </div>

            {bucket.keys.length > 1 && (
              <div
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  background: '#ff5722',
                  color: 'white',
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 'bold',
                }}
              >
                {bucket.keys.length}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export const CollisionDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const phase = Math.floor(frame / 120);

  // 简单哈希函数: h(key) = length(key) % 4
  const simpleHashBuckets = [
    { index: 0, keys: ['user'] },
    { index: 1, keys: ['name'] },
    { index: 2, keys: [] },
    { index: 3, keys: ['age', 'key', 'id', 'aid'] },
  ];

  // DJB2 哈希函数分布
  const djb2Buckets = [
    { index: 0, keys: ['key'] },
    { index: 1, keys: ['name', 'age'] },
    { index: 2, keys: ['user', 'id'] },
    { index: 3, keys: ['value'] },
  ];

  const buckets = phase < 2 ? simpleHashBuckets : djb2Buckets;
  const highlightIndex = frame % 60 < 30 ? 3 : null;

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="哈希冲突"
          subtitle="不同键可能映射到同一桶"
        />
      </Sequence>

      {/* 第二段: 简单哈希冲突 */}
      <Sequence from={90} durationInFrames={510}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: 'white', marginBottom: 16 }}>简单哈希函数的问题</h2>
          <p style={{ color: '#a0a0a0', marginBottom: 32, fontSize: 16 }}>
            h(key) = key.length % 4
          </p>

          <BucketVisualization buckets={simpleHashBuckets} highlightIndex={highlightIndex} />

          <div
            style={{
              marginTop: 32,
              padding: 20,
              background: 'rgba(244, 67, 54, 0.2)',
              border: '2px solid #f44336',
              borderRadius: 8,
              color: 'white',
            }}
          >
            <strong>桶3 有 4 个键发生冲突!</strong>
            <p style={{ margin: '12px 0 0 0', color: '#a0a0a0' }}>
              age, key, id, aid 长度都是 3，都映射到桶 3
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 更好的哈希函数 */}
      <Sequence from={600} durationInFrames={540}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: '#4caf50', marginBottom: 16 }}>使用更好的哈希函数</h2>
          <p style={{ color: '#a0a0a0', marginBottom: 32, fontSize: 16 }}>
            DJB2 哈希函数分布更均匀
          </p>

          <BucketVisualization buckets={djb2Buckets} highlightIndex={null} />

          <div
            style={{
              marginTop: 32,
              padding: 20,
              background: 'rgba(76, 175, 80, 0.2)',
              border: '2px solid #4caf50',
              borderRadius: 8,
              color: 'white',
            }}
          >
            <strong>冲突率显著降低!</strong>
            <p style={{ margin: '12px 0 0 0', color: '#a0a0a0' }}>
              每个桶最多 2 个键，分布更加均匀
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第四段: 总结 */}
      <Sequence from={1140} durationInFrames={510}>
        <SceneNarrator
          title="选择合适的哈希函数"
          subtitle="平衡速度、安全性和分布均匀性"
          text="Redis 默认使用 SipHash，既能保证良好的分布性，又能抵抗哈希洪水攻击。"
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export default CollisionDemo;

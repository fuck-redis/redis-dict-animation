/**
 * 渐进式 Rehash 详解
 * 视频时长: 15秒 (450帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const FPS = 30;
const TOTAL_FRAMES = 450; // 15秒

interface HashBucketVisualProps {
  entries: { key: string; value: string }[];
  index: number;
  x: number;
  y: number;
  isRehashing: boolean;
  isMigrated: boolean;
  opacity: number;
}

function HashBucketVisual({
  entries,
  index,
  x,
  y,
  isRehashing,
  isMigrated,
  opacity,
}: HashBucketVisualProps) {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 160,
        minHeight: 100,
        background: isMigrated
          ? 'rgba(76, 175, 80, 0.3)'
          : isRehashing
          ? 'rgba(255, 152, 0, 0.3)'
          : entries.length === 0
          ? 'rgba(250, 250, 250, 0.1)'
          : 'rgba(33, 150, 243, 0.3)',
        border: `2px solid ${
          isMigrated ? '#4caf50' : isRehashing ? '#ff9800' : entries.length === 0 ? '#666' : '#2196f3'
        }`,
        borderRadius: 8,
        padding: 12,
        opacity,
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          background: isMigrated ? '#4caf50' : isRehashing ? '#ff9800' : '#2196f3',
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
        {index}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {entries.map((entry, i) => (
          <React.Fragment key={entry.key}>
            <div
              style={{
                padding: '4px 8px',
                background: 'white',
                border: '2px solid #2196f3',
                borderRadius: 4,
                fontSize: 12,
                fontFamily: "'Courier New', monospace",
              }}
            >
              <span style={{ color: '#1976d2', fontWeight: 600 }}>{entry.key}</span>
              <span style={{ color: '#999', margin: '0 2px' }}>:</span>
              <span style={{ color: '#388e3c' }}>{entry.value}</span>
            </div>
            {i < entries.length - 1 && (
              <div style={{ textAlign: 'center', color: '#666', fontSize: 10 }}>↓</div>
            )}
          </React.Fragment>
        ))}
        {entries.length === 0 && (
          <div style={{ color: '#999', fontSize: 12, fontStyle: 'italic' }}>空</div>
        )}
      </div>
    </div>
  );
}

function RehashStepDiagram() {
  const frame = useCurrentFrame();

  // 模拟 rehash 过程
  // 初始状态: ht[0] 有数据，ht[1] 为空
  // 随着时间推移，逐步迁移到 ht[1]

  const ht0Buckets = [
    { index: 0, entries: [{ key: 'name', value: 'Alice' }] },
    { index: 1, entries: [] },
    { index: 2, entries: [{ key: 'age', value: '25' }] },
    { index: 3, entries: [{ key: 'city', value: 'NYC' }, { key: 'email', value: 'a@b.com' }] },
  ];

  const ht1Buckets = [
    { index: 0, entries: [] },
    { index: 1, entries: [] },
    { index: 2, entries: [] },
    { index: 3, entries: [] },
    { index: 4, entries: [] },
    { index: 5, entries: [] },
    { index: 6, entries: [] },
    { index: 7, entries: [] },
  ];

  // rehashidx 表示当前正在迁移的桶索引
  const rehashProgress = interpolate(frame, [60, 360], [0, 4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rehashidx = Math.floor(rehashProgress);

  // 模拟迁移后的 ht[1] 状态
  const migratedData: Record<number, { key: string; value: string }[]> = {
    0: [{ key: 'name', value: 'Alice' }],
    2: [{ key: 'age', value: '25' }],
    6: [{ key: 'city', value: 'NYC' }],
    7: [{ key: 'email', value: 'a@b.com' }],
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 24 }}>渐进式 Rehash 过程</h2>

      <div style={{ display: 'flex', gap: 60, marginBottom: 32 }}>
        {/* ht[0] - 主哈希表 */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: '#2196f3',
              marginBottom: 12,
            }}
          >
            ht[0] (源表)
          </div>
          <div
            style={{
              padding: 20,
              background: 'rgba(33, 150, 243, 0.2)',
              border: '2px solid #2196f3',
              borderRadius: 12,
              minWidth: 200,
            }}
          >
            <div style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 16 }}>
              rehashidx: <span style={{ color: '#ff9800', fontWeight: 'bold' }}>{rehashidx}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 200, justifyContent: 'center' }}>
              {ht0Buckets.map((bucket, i) => {
                const isMigrated = i < rehashidx;
                return (
                  <HashBucketVisual
                    key={i}
                    index={bucket.index}
                    entries={isMigrated ? [] : bucket.entries}
                    x={0}
                    y={0}
                    isRehashing={i === rehashidx}
                    isMigrated={isMigrated}
                    opacity={1}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* 箭头 */}
        <div style={{ display: 'flex', alignItems: 'center', color: '#4caf50', fontSize: 36 }}>
          →
        </div>

        {/* ht[1] - 辅助哈希表 */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: '#ff9800',
              marginBottom: 12,
            }}
          >
            ht[1] (新表)
          </div>
          <div
            style={{
              padding: 20,
              background: 'rgba(255, 152, 0, 0.2)',
              border: '2px solid #ff9800',
              borderRadius: 12,
              minWidth: 280,
            }}
          >
            <div style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 16 }}>
              容量: 8 (扩容后)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 280, justifyContent: 'center' }}>
              {ht1Buckets.map((bucket, i) => {
                const migrated = migratedData[i] || [];
                const isBeingMigrated = Object.keys(migratedData).some(
                  (key) => parseInt(key) === rehashidx && i === rehashidx + 2
                );
                return (
                  <HashBucketVisual
                    key={i}
                    index={bucket.index}
                    entries={migrated}
                    x={0}
                    y={0}
                    isRehashing={false}
                    isMigrated={migrated.length > 0}
                    opacity={1}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 进度条 */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a0a0a0', marginBottom: 8 }}>
          <span>Rehash 进度</span>
          <span>{Math.round((rehashidx / 4) * 100)}%</span>
        </div>
        <div
          style={{
            height: 12,
            background: '#333',
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(rehashidx / 4) * 100}%`,
              background: 'linear-gradient(90deg, #2196f3, #4caf50)',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      </div>
    </div>
  );
}

function OperationMigrateDiagram() {
  const frame = useCurrentFrame();

  // 模拟每次操作迁移一个桶
  const operationFrames = [120, 180, 240, 300, 360];
  const currentOp = operationFrames.filter((f) => frame >= f).length;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 24 }}>每次操作迁移一个桶</h2>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          padding: 24,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 12,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            padding: '16px 24px',
            background: 'rgba(33, 150, 243, 0.3)',
            border: '2px solid #2196f3',
            borderRadius: 8,
            fontSize: 18,
            color: 'white',
          }}
        >
          <div style={{ marginBottom: 8 }}>客户端请求</div>
          <div style={{ color: '#a0a0a0', fontSize: 14 }}>ADD / SET / GET / DEL ...</div>
        </div>

        <div style={{ color: '#4caf50', fontSize: 32 }}>→</div>

        <div
          style={{
            padding: '16px 24px',
            background: 'rgba(76, 175, 80, 0.3)',
            border: '2px solid #4caf50',
            borderRadius: 8,
            fontSize: 18,
            color: 'white',
          }}
        >
          <div style={{ marginBottom: 8 }}>Dict 内部</div>
          <div style={{ color: '#a0a0a0', fontSize: 14 }}>
            处理请求 + 迁移一个桶
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[1, 2, 3, 4, 5].map((op, i) => (
          <div
            key={i}
            style={{
              padding: '12px 20px',
              background: currentOp >= op ? 'rgba(76, 175, 80, 0.4)' : 'rgba(255, 255, 255, 0.1)',
              border: `2px solid ${currentOp >= op ? '#4caf50' : '#666'}`,
              borderRadius: 8,
              color: currentOp >= op ? '#4caf50' : '#999',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
          >
            操作 {op}
          </div>
        ))}
      </div>

      {currentOp >= 5 && (
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
          <strong>Rehash 完成!</strong>
          <p style={{ margin: '12px 0 0 0', color: '#a0a0a0' }}>
            ht[0] 和 ht[1] 交换指针，服务不中断
          </p>
        </div>
      )}
    </div>
  );
}

export const ProgressiveRehashFeature: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="渐进式 Rehash"
          subtitle="分散开销，保证服务不中断"
        />
      </Sequence>

      {/* 第二段: Rehash 过程图解 */}
      <Sequence from={90} durationInFrames={180}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <RehashStepDiagram />
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 每次操作迁移一个桶 */}
      <Sequence from={270} durationInFrames={180}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <OperationMigrateDiagram />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default ProgressiveRehashFeature;

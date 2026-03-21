/**
 * DictScanDemo - 演示 dictScan 机制
 * 视频时长: 20秒 (600帧 @ 30fps)
 * 内容: 展示 dictScan 如何遍历 ht[0] 和 ht[1]，游标迭代过程
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const FPS = 30;
const TOTAL_FRAMES = 600; // 20秒

// 哈希表桶组件
function HashBucket({
  index,
  entries,
  isActive,
  isRehashing,
  cursor,
}: {
  index: number;
  entries: string[];
  isActive: boolean;
  isRehashing: boolean;
  cursor: number;
}) {
  const bucketColors = isRehashing
    ? { bg: 'rgba(255, 152, 0, 0.2)', border: '#ff9800' }
    : { bg: 'rgba(33, 150, 243, 0.1)', border: '#2196f3' };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 80,
      }}
    >
      <div
        style={{
          padding: '4px 12px',
          background: '#333',
          borderRadius: 4,
          color: '#888',
          fontFamily: "'Courier New', monospace",
          fontSize: 12,
          marginBottom: 8,
        }}
      >
        [{index}]
      </div>
      <div
        style={{
          padding: '12px 16px',
          background: isActive ? bucketColors.bg : 'rgba(255,255,255,0.03)',
          border: `2px solid ${isActive ? bucketColors.border : '#333'}`,
          borderRadius: 8,
          minWidth: 60,
          minHeight: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: isActive ? `0 0 20px ${bucketColors.border}40` : 'none',
        }}
      >
        {entries.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {entries.map((entry, i) => (
              <div
                key={i}
                style={{
                  color: '#4caf50',
                  fontFamily: "'Courier New', monospace",
                  fontSize: 11,
                  padding: '2px 6px',
                  background: 'rgba(76, 175, 80, 0.2)',
                  borderRadius: 3,
                }}
              >
                {entry}
              </div>
            ))}
          </div>
        ) : (
          <span style={{ color: '#555', fontSize: 11 }}>NULL</span>
        )}
      </div>
    </div>
  );
}

// 游标指示器
function CursorIndicator({ position, table }: { position: number; table: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: -30,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#e94560',
        color: 'white',
        padding: '4px 12px',
        borderRadius: 12,
        fontFamily: "'Courier New', monospace",
        fontSize: 12,
        fontWeight: 'bold',
        boxShadow: '0 0 15px rgba(233, 69, 96, 0.5)',
      }}
    >
      cursor={position} ({table === 0 ? 'ht[0]' : 'ht[1]'})
    </div>
  );
}

// 游标迭代过程演示
function CursorIterationScene() {
  const frame = useCurrentFrame();

  // 游标值变化: 0 -> 4 -> 8 -> 0 (完成一个周期)
  const cursorCycle = [0, 1, 2, 3, 4, 5, 6, 7, 0];
  const cursorIndex = Math.min(Math.floor(frame / 20), cursorCycle.length - 1);
  const cursor = cursorCycle[cursorIndex];

  // 桶的内容 (简化)
  const ht0Buckets = [
    ['k1:v1'],
    [],
    ['k3:v3'],
    [],
    ['k5:v5'],
    [],
    ['k7:v7'],
    [],
  ];
  const ht1Buckets = [
    [],
    ['k2:v2'],
    [],
    ['k4:v4'],
    [],
    ['k6:v6'],
    [],
    [],
  ];

  const isRehashing = frame >= 200;
  const showHt1 = frame >= 250;
  const activeTable = showHt1 && frame >= 300 ? 1 : 0;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 16 }}>dictScan 游标迭代过程</h2>

      <p style={{ color: '#a0a0a0', marginBottom: 32, fontSize: 16 }}>
        游标从 0 开始递增，遍历所有桶直到回到 0，表示遍历完成
      </p>

      {/* 游标状态 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 32,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(33, 150, 243, 0.2)',
            border: '2px solid #2196f3',
            borderRadius: 8,
          }}
        >
          <span style={{ color: '#888', fontSize: 14 }}>当前游标: </span>
          <span style={{ color: '#2196f3', fontSize: 24, fontWeight: 'bold' }}>
            {cursor}
          </span>
        </div>
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(76, 175, 80, 0.2)',
            border: '2px solid #4caf50',
            borderRadius: 8,
          }}
        >
          <span style={{ color: '#888', fontSize: 14 }}>遍历表: </span>
          <span style={{ color: '#4caf50', fontSize: 24, fontWeight: 'bold' }}>
            {activeTable === 0 ? 'ht[0]' : 'ht[1]'}
          </span>
        </div>
      </div>

      {/* 哈希表可视化 */}
      <div style={{ display: 'flex', gap: 48, justifyContent: 'center' }}>
        {/* ht[0] */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              color: '#2196f3',
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 16,
              opacity: showHt1 ? 0.6 : 1,
            }}
          >
            ht[0] (size=8)
          </div>
          <div
            style={{
              display: 'flex',
              gap: 8,
              opacity: showHt1 ? 0.6 : 1,
              transition: 'opacity 0.3s',
            }}
          >
            {ht0Buckets.map((entries, i) => (
              <div key={i} style={{ position: 'relative' }}>
                {cursor === i && activeTable === 0 && (
                  <CursorIndicator position={i} table={0} />
                )}
                <HashBucket
                  index={i}
                  entries={entries}
                  isActive={cursor === i && activeTable === 0}
                  isRehashing={false}
                  cursor={cursor}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ht[1] */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              color: showHt1 ? '#ff9800' : '#666',
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 16,
              transition: 'color 0.3s',
            }}
          >
            ht[1] (size=8)
          </div>
          <div
            style={{
              display: 'flex',
              gap: 8,
              opacity: showHt1 ? 1 : 0.3,
              transition: 'opacity 0.3s',
            }}
          >
            {ht1Buckets.map((entries, i) => (
              <div key={i} style={{ position: 'relative' }}>
                {cursor === i && activeTable === 1 && (
                  <CursorIndicator position={i} table={1} />
                )}
                <HashBucket
                  index={i}
                  entries={entries}
                  isActive={cursor === i && activeTable === 1}
                  isRehashing={true}
                  cursor={cursor}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 代码片段 */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: 48,
          right: 48,
          background: '#1e1e1e',
          borderRadius: 8,
          padding: 20,
          fontFamily: "'Courier New', monospace",
          fontSize: 13,
        }}
      >
        <div style={{ color: '#6a9955' }}>// dictScan 核心逻辑</div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>
          <span style={{ color: '#569cd6' }}>unsigned long</span> cursor = 0;
        </div>
        <div style={{ color: '#d4d4d4', marginTop: 4 }}>
          <span style={{ color: '#569cd6' }}>do</span> {'{'}
        </div>
        <div style={{ color: '#dcdcaa', paddingLeft: 16, marginTop: 8 }}>
          // 遍历 ht[0] 所有桶
        </div>
        <div style={{ color: '#d4d4d4', paddingLeft: 16, marginTop: 4 }}>
          cursor = dictScan(d, cursor, ...);
        </div>
        <div style={{ color: '#dcdcaa', paddingLeft: 16, marginTop: 8 }}>
          // 如果 ht[1] 存在，继续遍历
        </div>
        <div style={{ color: '#d4d4d4', marginTop: 4 }}>{'}'} <span style={{ color: '#569cd6' }}>while</span> (cursor != 0);
        </div>
      </div>
    </div>
  );
}

// Rehash期间的扫描演示
function RehashScanScene() {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [0, 300], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bucketsMigrated = Math.floor(progress / 12.5);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 16 }}>Rehash 期间的 dictScan</h2>

      <p style={{ color: '#a0a0a0', marginBottom: 32, fontSize: 16 }}>
        当 rehash 正在进行时，dictScan 必须同时遍历 ht[0] 和 ht[1]
      </p>

      {/* 迁移进度 */}
      <div
        style={{
          padding: 16,
          background: 'rgba(255, 152, 0, 0.1)',
          border: '2px solid #ff9800',
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: '#ff9800' }}>Rehash 进度</span>
          <span style={{ color: 'white' }}>{Math.floor(progress)}%</span>
        </div>
        <div
          style={{
            height: 8,
            background: '#333',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #ff9800, #ffc107)',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
        <div style={{ color: '#888', fontSize: 12, marginTop: 8 }}>
          已迁移 {bucketsMigrated}/8 个桶
        </div>
      </div>

      {/* 双表示意 */}
      <div style={{ display: 'flex', gap: 32, justifyContent: 'center' }}>
        <div
          style={{
            flex: 1,
            padding: 20,
            background: 'rgba(33, 150, 243, 0.1)',
            border: '2px solid #2196f3',
            borderRadius: 12,
          }}
        >
          <div style={{ color: '#2196f3', fontWeight: 'bold', marginBottom: 12 }}>ht[0]</div>
          <div style={{ color: '#a0a0a0', fontSize: 14 }}>
            源表 - 正在迁移
            <div style={{ marginTop: 8 }}>
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    display: 'inline-block',
                    width: 24,
                    height: 24,
                    margin: 2,
                    background: i < bucketsMigrated ? 'rgba(76, 175, 80, 0.3)' : 'rgba(33, 150, 243, 0.3)',
                    borderRadius: 4,
                    border: i < bucketsMigrated ? '1px solid #4caf50' : '1px solid #2196f3',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: 20,
            background: progress > 50 ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 255, 255, 0.02)',
            border: `2px solid ${progress > 50 ? '#ff9800' : '#444'}`,
            borderRadius: 12,
          }}
        >
          <div style={{ color: progress > 50 ? '#ff9800' : '#666', fontWeight: 'bold', marginBottom: 12 }}>
            ht[1]
          </div>
          <div style={{ color: '#a0a0a0', fontSize: 14 }}>
            目标表 - 正在扩展
            <div style={{ marginTop: 8 }}>
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    display: 'inline-block',
                    width: 24,
                    height: 24,
                    margin: 2,
                    background: i < bucketsMigrated ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 4,
                    border: i < bucketsMigrated ? '1px solid #ff9800' : '1px solid #333',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 说明 */}
      <div
        style={{
          marginTop: 24,
          padding: 16,
          background: 'rgba(76, 175, 80, 0.1)',
          border: '2px solid #4caf50',
          borderRadius: 8,
        }}
      >
        <p style={{ color: 'white', margin: 0, fontSize: 14 }}>
          <strong style={{ color: '#4caf50' }}>扫描策略:</strong> 先完整遍历 ht[0]，再遍历 ht[1]。
          这样保证不会遗漏任何元素，也不会在 rehash 过程中重复访问。
        </p>
      </div>
    </div>
  );
}

export const DictScanDemo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="dictScan 机制"
          subtitle="游标迭代与 Rehash"
        />
      </Sequence>

      {/* 游标迭代过程 */}
      <Sequence from={90} durationInFrames={240}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <CursorIterationScene />
        </AbsoluteFill>
      </Sequence>

      {/* Rehash期间的扫描 */}
      <Sequence from={330} durationInFrames={270}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <RehashScanScene />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default DictScanDemo;

/**
 * 链地址法深入解析
 * 视频时长: 20秒 (600帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const TOTAL_FRAMES = 600;

function BucketVisual({
  entries,
  highlighted,
  x,
  y,
  label
}: {
  entries: { key: string; value: string }[];
  highlighted: boolean;
  x: number;
  y: number;
  label: string;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 200,
        minHeight: 140,
        background: highlighted ? 'rgba(255, 235, 59, 0.3)' : 'rgba(255, 255, 255, 0.1)',
        border: `3px solid ${highlighted ? '#ffc107' : '#4fc3f7'}`,
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          background: '#4fc3f7',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: 18,
          marginBottom: 12,
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {entries.map((entry, i) => (
          <React.Fragment key={entry.key}>
            <div
              style={{
                padding: '8px 12px',
                background: 'white',
                border: '2px solid #2196f3',
                borderRadius: 6,
                fontSize: 14,
                fontFamily: "'Courier New', monospace",
              }}
            >
              <span style={{ color: '#1976d2', fontWeight: 600 }}>"{entry.key}"</span>
              <span style={{ color: '#999', margin: '0 4px' }}>:</span>
              <span style={{ color: '#388e3c' }}>"{entry.value}"</span>
            </div>
            {i < entries.length - 1 && (
              <div style={{ textAlign: 'center', color: '#4caf50', fontSize: 16, fontWeight: 'bold' }}>
                ↓ next
              </div>
            )}
          </React.Fragment>
        ))}
        {entries.length === 0 && (
          <div style={{ color: '#666', fontSize: 14, fontStyle: 'italic' }}>空桶 (NULL)</div>
        )}
      </div>
    </div>
  );
}

function ChainVisualization() {
  const frame = useCurrentFrame();

  // 阶段: 0-150 显示空桶, 150-300 添加第一个元素, 300-450 添加冲突元素, 450-600 完成
  const phase = Math.floor(frame / 150);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 32 }}>链地址法工作原理</h2>

      <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <BucketVisual
            label="0"
            entries={phase >= 1 ? [{ key: 'name', value: 'Alice' }] : []}
            highlighted={phase >= 3}
            x={50}
            y={100}
          />
          <BucketVisual
            label="1"
            entries={[]}
            highlighted={false}
            x={50}
            y={280}
          />
          <BucketVisual
            label="2"
            entries={phase >= 1 ? [{ key: 'city', value: 'NYC' }] : []}
            highlighted={phase >= 2}
            x={50}
            y={460}
          />
        </div>

        <div style={{ flex: 1, padding: 20 }}>
          {phase === 0 && (
            <div style={{ color: '#a0a0a0', fontSize: 20 }}>
              <p>初始状态: 所有桶都是空的</p>
              <p style={{ marginTop: 16, color: '#666' }}>哈希函数: h(key) = key.length % 3</p>
            </div>
          )}

          {phase === 1 && (
            <div style={{ color: '#a0a0a0', fontSize: 20 }}>
              <p style={{ color: '#4caf50', fontWeight: 'bold' }}>插入 "name"</p>
              <p style={{ marginTop: 8 }}>h("name") = 4 % 3 = <span style={{ color: '#ff9800' }}>1</span></p>
              <p style={{ marginTop: 16, color: '#666' }}>但 1 号桶已经存放 "city"...</p>
              <p style={{ color: '#666' }}>等等，h("name") = 4 % 3 = 1，但 "city".length = 4，所以 h("city") = 4 % 3 = 1</p>
            </div>
          )}

          {phase === 2 && (
            <div style={{ color: '#a0a0a0', fontSize: 20 }}>
              <p style={{ color: '#ff9800', fontWeight: 'bold' }}>发生冲突!</p>
              <p style={{ marginTop: 8 }}>h("city") = 4 % 3 = 1</p>
              <p style={{ marginTop: 8 }}>h("name") = 4 % 3 = 1</p>
              <p style={{ marginTop: 16, color: '#4fc3f7' }}>解决方案: 链表连接</p>
            </div>
          )}

          {phase === 3 && (
            <div style={{ color: '#a0a0a0', fontSize: 20 }}>
              <p style={{ color: '#e94560', fontWeight: 'bold' }}>头插法插入 "email"</p>
              <p style={{ marginTop: 8 }}>h("email") = 5 % 3 = 2</p>
              <p style={{ marginTop: 16, color: '#4caf50' }}>新节点插入到链表头部</p>
              <p style={{ marginTop: 8, color: '#666' }}>原有节点依次向后连接，O(1) 操作!</p>
            </div>
          )}

          {phase >= 4 && (
            <div style={{ color: '#a0a0a0', fontSize: 20 }}>
              <p style={{ color: '#4caf50', fontWeight: 'bold' }}>最终状态</p>
              <ul style={{ marginTop: 16 }}>
                <li>桶0: (空)</li>
                <li>桶1: name → city (冲突链)</li>
                <li>桶2: email (头插入)</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const SeparateChainingDeepDive: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="链地址法深入解析"
          subtitle="Separate Chaining 详解"
        />
      </Sequence>

      {/* 第二段: 链地址法工作原理 */}
      <Sequence from={90} durationInFrames={510}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <ChainVisualization />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default SeparateChainingDeepDive;

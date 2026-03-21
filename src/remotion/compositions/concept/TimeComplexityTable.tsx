/**
 * 时间复杂度对比表
 * 视频时长: 15秒 (450帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const TOTAL_FRAMES = 450;

function ComplexityRow({
  operation,
  bestCase,
  worstCase,
  isHighlighted,
  rowIndex,
  totalRows,
}: {
  operation: string;
  bestCase: string;
  worstCase: string;
  isHighlighted: boolean;
  rowIndex: number;
  totalRows: number;
}) {
  const frame = useCurrentFrame();
  const delay = rowIndex * 40;
  const opacity = interpolate(Math.max(0, frame - delay), [0, 20], [0, 1], { extrapolateLeft: 'clamp' });
  const translateY = interpolate(Math.max(0, frame - delay), [0, 20], [20, 0], { extrapolateLeft: 'clamp' });

  const isO1 = bestCase === 'O(1)' && worstCase === 'O(1)';
  const isOn = worstCase === 'O(n)';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        transform: `translateY(${translateY}px)`,
        opacity,
        background: isHighlighted ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        marginBottom: 8,
        transition: 'background 0.3s ease',
      }}
    >
      <div
        style={{
          width: 180,
          padding: '16px 20px',
          borderRight: '1px solid #333',
        }}
      >
        <span style={{ color: 'white', fontSize: 18, fontWeight: 600 }}>{operation}</span>
      </div>
      <div
        style={{
          width: 200,
          padding: '16px 20px',
          borderRight: '1px solid #333',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            color: isO1 ? '#4caf50' : '#ff9800',
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: "'Courier New', monospace",
          }}
        >
          {bestCase}
        </span>
      </div>
      <div style={{ width: 200, padding: '16px 20px', textAlign: 'center' }}>
        <span
          style={{
            color: isOn ? '#f44336' : isO1 ? '#4caf50' : '#ff9800',
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: "'Courier New', monospace",
          }}
        >
          {worstCase}
        </span>
      </div>
    </div>
  );
}

function ComplexityTable() {
  const frame = useCurrentFrame();
  const showSummary = frame >= 320;

  const operations = [
    { operation: '查找 (Search)', bestCase: 'O(1)', worstCase: 'O(n)' },
    { operation: '插入 (Insert)', bestCase: 'O(1)', worstCase: 'O(n)' },
    { operation: '删除 (Delete)', bestCase: 'O(1)', worstCase: 'O(n)' },
    { operation: '扩容 (Resize)', bestCase: 'O(n)', worstCase: 'O(n)' },
    { operation: 'Rehash', bestCase: 'O(1)', worstCase: 'O(1)' },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 32 }}>时间复杂度对比</h2>

      {/* 表头 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 180,
            padding: '16px 20px',
            borderRight: '1px solid #333',
          }}
        >
          <span style={{ color: '#a0a0a0', fontSize: 16, fontWeight: 600 }}>操作</span>
        </div>
        <div
          style={{
            width: 200,
            padding: '16px 20px',
            borderRight: '1px solid #333',
            textAlign: 'center',
          }}
        >
          <span style={{ color: '#a0a0a0', fontSize: 16, fontWeight: 600 }}>最佳情况</span>
        </div>
        <div style={{ width: 200, padding: '16px 20px', textAlign: 'center' }}>
          <span style={{ color: '#a0a0a0', fontSize: 16, fontWeight: 600 }}>最坏情况</span>
        </div>
      </div>

      {/* 表内容 */}
      <div>
        {operations.map((op, i) => (
          <ComplexityRow
            key={op.operation}
            operation={op.operation}
            bestCase={op.bestCase}
            worstCase={op.worstCase}
            isHighlighted={false}
            rowIndex={i}
            totalRows={operations.length}
          />
        ))}
      </div>

      {/* 图例 */}
      <div style={{ marginTop: 40, display: 'flex', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 20, background: '#4caf50', borderRadius: 4 }} />
          <span style={{ color: '#a0a0a0' }}>O(1) - 常数时间</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 20, background: '#f44336', borderRadius: 4 }} />
          <span style={{ color: '#a0a0a0' }}>O(n) - 线性时间</span>
        </div>
      </div>

      {/* 总结 */}
      {showSummary && (
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 0,
            right: 0,
            padding: 24,
            background: 'rgba(76, 175, 80, 0.2)',
            border: '2px solid #4caf50',
            borderRadius: 12,
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'white', fontSize: 20, margin: 0 }}>
            <strong style={{ color: '#4caf50' }}>关键点:</strong>
            <span style={{ color: '#a0a0a0' }}> 理想情况下是 O(1)，但冲突时退化为 O(n)。负载因子是影响性能的关键!</span>
          </p>
        </div>
      )}
    </div>
  );
}

function O1VsOnVisual() {
  const frame = useCurrentFrame();

  const showOn = frame >= 240;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ color: 'white', marginBottom: 40 }}>O(1) vs O(n) 的差异</h2>

      <div style={{ display: 'flex', gap: 60 }}>
        {/* O(1) */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 150,
              height: 150,
              background: 'linear-gradient(135deg, #4caf50, #81c784)',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 30px rgba(76, 175, 80, 0.4)',
              transform: `scale(${interpolate(frame, [0, 30], [0.8, 1], { extrapolateLeft: 'clamp' })})`,
            }}
          >
            <span style={{ fontSize: 48, fontWeight: 'bold', color: 'white' }}>O(1)</span>
          </div>
          <p style={{ color: '#4caf50', fontSize: 20, marginTop: 16, fontWeight: 600 }}>常数时间</p>
          <p style={{ color: '#a0a0a0', fontSize: 14, marginTop: 8 }}>与数据规模无关</p>
        </div>

        {/* vs */}
        <div style={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: 36 }}>
          vs
        </div>

        {/* O(n) */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 150,
              height: 150,
              background: showOn ? 'linear-gradient(135deg, #f44336, #e57373)' : 'rgba(244, 67, 54, 0.3)',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: showOn ? '0 8px 30px rgba(244, 67, 54, 0.4)' : 'none',
              transform: `scale(${showOn ? 1 : 0.8})`,
              transition: 'all 0.5s ease',
            }}
          >
            <span style={{ fontSize: 48, fontWeight: 'bold', color: 'white' }}>O(n)</span>
          </div>
          <p style={{ color: '#f44336', fontSize: 20, marginTop: 16, fontWeight: 600 }}>线性时间</p>
          <p style={{ color: '#a0a0a0', fontSize: 14, marginTop: 8 }}>与数据规模成正比</p>
        </div>
      </div>

      {showOn && (
        <div
          style={{
            marginTop: 40,
            padding: 20,
            background: 'rgba(244, 67, 54, 0.2)',
            borderRadius: 8,
            maxWidth: 600,
          }}
        >
          <p style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>
            当哈希冲突严重，链表变长时，性能会显著下降
          </p>
        </div>
      )}
    </div>
  );
}

export const TimeComplexityTable: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="时间复杂度"
          subtitle="Dict 操作性能分析"
        />
      </Sequence>

      {/* 第二段: 复杂度表 */}
      <Sequence from={60} durationInFrames={210}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <ComplexityTable />
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: O(1) vs O(n) 可视化 */}
      <Sequence from={270} durationInFrames={180}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
          }}
        >
          <O1VsOnVisual />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default TimeComplexityTable;

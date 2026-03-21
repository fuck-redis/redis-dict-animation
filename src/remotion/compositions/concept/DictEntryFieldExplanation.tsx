/**
 * DictEntryFieldExplanation
 * 视频时长: 12秒 (360帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 360; // 12秒 * 30fps

function FieldBox({
  label,
  value,
  type,
  description,
  highlight,
  delay,
}: {
  label: string;
  value: string;
  type: string;
  description: string;
  highlight: boolean;
  delay: number;
}) {
  const frame = useCurrentFrame();

  const opacity = interpolate(Math.max(0, frame - delay), [0, 20], [0, 1], { extrapolateLeft: 'clamp' });
  const scale = interpolate(Math.max(0, frame - delay), [0, 15], [0.8, 1], { extrapolateLeft: 'clamp' });
  const glowIntensity = highlight ? interpolate(frame, [delay, delay + 30, delay + 60], [0, 1, 0], { extrapolateLeft: 'clamp' }) : 0;

  const fieldColors = {
    key: { bg: 'rgba(33, 150, 243, 0.2)', border: '#2196f3', text: '#2196f3' },
    v: { bg: 'rgba(255, 152, 0, 0.2)', border: '#ff9800', text: '#ff9800' },
    next: { bg: 'rgba(76, 175, 80, 0.2)', border: '#4caf50', text: '#4caf50' },
  };

  const color = fieldColors[type as keyof typeof fieldColors] || fieldColors.key;

  return (
    <div
      style={{
        padding: '24px 32px',
        background: highlight ? `rgba(${type === 'key' ? '33,150,243' : type === 'v' ? '255,152,0' : '76,175,80'}, ${0.15 + glowIntensity * 0.1})` : color.bg,
        border: `3px solid ${color.border}`,
        borderRadius: 16,
        minWidth: 280,
        textAlign: 'center',
        opacity,
        transform: `scale(${scale})`,
        boxShadow: highlight ? `0 0 ${30 * glowIntensity}px ${color.border}` : 'none',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <div style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>{label}</div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          fontFamily: "'Courier New', monospace",
          color: color.text,
          marginBottom: 8,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, color: '#a0a0a0', marginBottom: 12 }}>{type}</div>
      <div
        style={{
          padding: '8px 12px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: 8,
          fontSize: 13,
          color: '#ffffff',
        }}
      >
        {description}
      </div>
    </div>
  );
}

function CodeBlock() {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp' });

  return (
    <div style={{ opacity, padding: 24 }}>
      <div
        style={{
          background: '#1e1e1e',
          borderRadius: 12,
          overflow: 'hidden',
          fontFamily: "'Courier New', monospace",
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div
          style={{
            padding: '12px 16px',
            background: '#2d2d2d',
            borderBottom: '1px solid #3d3d3d',
            fontSize: 14,
            color: '#a0a0a0',
          }}
        >
          dictEntry 结构体定义
        </div>
        <pre
          style={{
            margin: 0,
            padding: 24,
            fontSize: 15,
            lineHeight: 1.8,
            color: '#d4d4d4',
          }}
        >
{`typedef struct dictEntry {
    void *key;              // 键指针
    union {
        void *val;          // 值指针
        uint64_t u64;       // 无符号64位
        int64_t s64;        // 有符号64位
        double d;           // 浮点数
    } v;                    // 联合体
    struct dictEntry *next; // 冲突链表
} dictEntry;`}
        </pre>
      </div>
    </div>
  );
}

function MemoryLayout() {
  const frame = useCurrentFrame();
  const highlightField = frame < 120 ? 'key' : frame < 240 ? 'v' : 'next';

  const fields = [
    {
      label: 'key',
      value: '"username"',
      type: 'key',
      description: '指向键对象的指针',
      offset: '0 bytes',
    },
    {
      label: 'v (union)',
      value: '"Alice"',
      type: 'v',
      description: '可以存 void*, int, double',
      offset: '8 bytes',
    },
    {
      label: 'next',
      value: '→ NULL',
      type: 'next',
      description: '冲突链表指针',
      offset: '16 bytes',
    },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: 16,
          padding: 24,
          border: '2px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          style={{
            fontSize: 18,
            color: '#a0a0a0',
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          dictEntry 内存布局
        </div>
        {fields.map((field, i) => (
          <div
            key={field.type}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                padding: '4px 12px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 4,
                fontSize: 12,
                color: '#666',
                fontFamily: "'Courier New', monospace",
              }}
            >
              {field.offset}
            </div>
            <FieldBox
              label={field.label}
              value={field.value}
              type={field.type}
              description={field.description}
              highlight={highlightField === field.type}
              delay={i * 40}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export const DictEntryFieldExplanation: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* Sequence 1: Title */}
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="dictEntry 各字段详解"
          subtitle="深入理解 Dict 节点结构"
        />
      </Sequence>

      {/* Sequence 2: Memory Layout */}
      <Sequence from={60} durationInFrames={180}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 32,
              left: 48,
              fontSize: 28,
              color: '#e94560',
            }}
          >
            内存中的 dictEntry
          </div>
          <MemoryLayout />
        </AbsoluteFill>
      </Sequence>

      {/* Sequence 3: Code View */}
      <Sequence from={240} durationInFrames={120}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CodeBlock />
          <div
            style={{
              marginTop: 24,
              padding: 16,
              background: 'rgba(76, 175, 80, 0.2)',
              borderRadius: 8,
              fontSize: 16,
              color: '#4caf50',
            }}
          >
            联合体设计节省内存：不同类型共用同一块内存
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default DictEntryFieldExplanation;

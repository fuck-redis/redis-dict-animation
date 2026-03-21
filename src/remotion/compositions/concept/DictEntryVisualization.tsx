/**
 * DictEntry 数据结构可视化
 * 视频时长: 15秒 (450帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const TOTAL_FRAMES = 450;

function EntryStructureDiagram() {
  const frame = useCurrentFrame();

  // 动画阶段
  // 0-90: 显示完整的 dictEntry 结构
  // 90-180: 突出显示 key 字段
  // 180-270: 突出显示 v (union) 字段
  // 270-360: 突出显示 next 字段
  // 360-450: 总结

  const highlightKey = frame >= 90 && frame < 180;
  const highlightV = frame >= 180 && frame < 270;
  const highlightNext = frame >= 270 && frame < 360;

  const keyScale = interpolate(frame, [0, 30, 90, 120], [0.9, 1.1, 1, highlightKey ? 1.1 : 1], { extrapolateLeft: 'clamp' });
  const vScale = interpolate(frame, [180, 210, 270, 300], [1, 1.1, 1, highlightV ? 1.1 : 1], { extrapolateLeft: 'clamp' });
  const nextScale = interpolate(frame, [270, 300, 360, 390], [1, 1.1, 1, highlightNext ? 1.1 : 1], { extrapolateLeft: 'clamp' });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40 }}>
      <h2 style={{ color: 'white', marginBottom: 40 }}>dictEntry 节点结构</h2>

      {/* 主结构可视化 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40 }}>
        {/* key 字段 */}
        <div
          style={{
            transform: `scale(${keyScale})`,
            transition: 'transform 0.3s ease',
            padding: '20px 24px',
            background: highlightKey ? '#e3f2fd' : '#f5f5f5',
            border: `3px solid ${highlightKey ? '#2196f3' : '#ccc'}`,
            borderRadius: 12,
            minWidth: 160,
            textAlign: 'center',
            boxShadow: highlightKey ? '0 4px 20px rgba(33, 150, 243, 0.4)' : '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>key</div>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1565c0', fontFamily: "'Courier New', monospace" }}>
            "name"
          </div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 8 }}>void *key</div>
        </div>

        {/* 箭头 */}
        <div style={{ width: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 24 }}>
          →
        </div>

        {/* v (union) 字段 */}
        <div
          style={{
            transform: `scale(${vScale})`,
            transition: 'transform 0.3s ease',
            padding: '20px 24px',
            background: highlightV ? '#fff3e0' : '#f5f5f5',
            border: `3px solid ${highlightV ? '#ff9800' : '#ccc'}`,
            borderRadius: 12,
            minWidth: 200,
            textAlign: 'center',
            boxShadow: highlightV ? '0 4px 20px rgba(255, 152, 0, 0.4)' : '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>v (union)</div>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#e65100', fontFamily: "'Courier New', monospace" }}>
            "Alice"
          </div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 8 }}>void *val | uint64_t | int64_t | double</div>
        </div>

        {/* 箭头 */}
        <div style={{ width: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 24 }}>
          →
        </div>

        {/* next 字段 */}
        <div
          style={{
            transform: `scale(${nextScale})`,
            transition: 'transform 0.3s ease',
            padding: '20px 24px',
            background: highlightNext ? '#e8f5e9' : '#f5f5f5',
            border: `3px solid ${highlightNext ? '#4caf50' : '#ccc'}`,
            borderRadius: 12,
            minWidth: 140,
            textAlign: 'center',
            boxShadow: highlightNext ? '0 4px 20px rgba(76, 175, 80, 0.4)' : '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>next</div>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#2e7d32', fontFamily: "'Courier New', monospace" }}>
            → NULL
          </div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 8 }}>dictEntry *next</div>
        </div>
      </div>

      {/* 说明 */}
      <div style={{ position: 'absolute', bottom: 100, width: '80%', textAlign: 'center' }}>
        {highlightKey && (
          <div style={{ padding: 16, background: 'rgba(33, 150, 243, 0.2)', borderRadius: 8, color: 'white' }}>
            <strong style={{ color: '#2196f3' }}>key:</strong> 指向键对象的指针
          </div>
        )}
        {highlightV && (
          <div style={{ padding: 16, background: 'rgba(255, 152, 0, 0.2)', borderRadius: 8, color: 'white' }}>
            <strong style={{ color: '#ff9800' }}>v (union):</strong> 联合体，可以存储 void*、uint64_t、int64_t 或 double
          </div>
        )}
        {highlightNext && (
          <div style={{ padding: 16, background: 'rgba(76, 175, 80, 0.2)', borderRadius: 8, color: 'white' }}>
            <strong style={{ color: '#4caf50' }}>next:</strong> 指向下一个 dictEntry 节点的指针，用于实现链地址法
          </div>
        )}
        {frame >= 360 && (
          <div style={{ padding: 16, background: 'rgba(76, 175, 80, 0.2)', borderRadius: 8, color: 'white' }}>
            <strong style={{ color: '#4caf50' }}>关键设计:</strong> 通过 next 指针，多个冲突的键可以链接在同一桶中
          </div>
        )}
        {frame < 90 && (
          <div style={{ color: '#a0a0a0', fontSize: 18 }}>
            这三个字段组成了 Redis Dict 的基本节点单位
          </div>
        )}
      </div>
    </div>
  );
}

function CodeView() {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp' });

  return (
    <div style={{ opacity, padding: 20 }}>
      <div
        style={{
          background: '#1e1e1e',
          borderRadius: 8,
          overflow: 'hidden',
          fontFamily: "'Courier New', monospace",
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
          dictEntry 结构体
        </div>
        <pre
          style={{
            margin: 0,
            padding: 20,
            fontSize: 15,
            lineHeight: 1.6,
            color: '#d4d4d4',
          }}
        >
{`typedef struct dictEntry {
    void *key;              // 键指针
    union {
        void *val;
        uint64_t u64;
        int64_t s64;
        double d;
    } v;                    // 联合值
    struct dictEntry *next; // 链表指针
} dictEntry;`}
        </pre>
      </div>
    </div>
  );
}

export const DictEntryVisualization: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="dictEntry 结构"
          subtitle="Dict 的基本节点"
        />
      </Sequence>

      {/* 第二段: 结构可视化 */}
      <Sequence from={60} durationInFrames={240}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          }}
        >
          <EntryStructureDiagram />
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 代码视图 */}
      <Sequence from={300} durationInFrames={150}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CodeView />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default DictEntryVisualization;

/**
 * BucketMigrationDetail
 * 视频时长: 12秒 (360帧 @ 30fps)
 * 单桶迁移细节 - 展示一个桶如何逐步迁移
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 360;

function EntryBox({ keyName, value, isHighlighted, isMigrated }: {
  keyName: string;
  value: string;
  isHighlighted: boolean;
  isMigrated: boolean;
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        background: isHighlighted ? '#fff9c4' : isMigrated ? '#e8f5e9' : '#ffffff',
        border: `2px solid ${isHighlighted ? '#ffc107' : isMigrated ? '#4caf50' : '#2196f3'}`,
        borderRadius: 6,
        fontFamily: "'Courier New', monospace",
        fontSize: 14,
        transition: 'all 0.2s ease',
      }}
    >
      <span style={{ color: '#1976d2', fontWeight: 'bold' }}>"{keyName}"</span>
      <span style={{ color: '#888' }}>:</span>
      <span style={{ color: '#388e3c' }}>"{value}"</span>
    </div>
  );
}

function AnimatedComponent() {
  const frame = useCurrentFrame();

  // 12秒 = 360帧，分成4个阶段，每阶段90帧
  // 阶段0 (0-90): 初始状态 - ht[0]桶有多个entry
  // 阶段1 (90-180): 计算新位置
  // 阶段2 (180-270): 逐个迁移entry
  // 阶段3 (270-360): 桶迁移完成

  const phase = Math.floor(frame / 90);
  const entryProgress = (frame % 90) / 90;

  const entries = ['k1', 'k2', 'k3'];
  const migratedCount = phase >= 2 ? Math.min(entries.length, Math.floor(entryProgress * 4)) : 0;

  return (
    <div style={{ padding: 48 }}>
      <h2 style={{ color: 'white', marginBottom: 32, fontSize: 28 }}>单桶迁移细节</h2>

      <div style={{ display: 'flex', gap: 60, justifyContent: 'center' }}>
        {/* ht[0] */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#2196f3',
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            ht[0] 桶 [2]
          </div>
          <div
            style={{
              padding: 24,
              background: 'rgba(33, 150, 243, 0.1)',
              border: '2px solid #2196f3',
              borderRadius: 12,
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              alignItems: 'center',
            }}
          >
            {entries.map((key, i) => (
              <EntryBox
                key={key}
                keyName={key}
                value={`v${i + 1}`}
                isHighlighted={phase === 1 || (phase === 2 && i === migratedCount)}
                isMigrated={i < migratedCount}
              />
            ))}
            {entries.length === 0 && (
              <div style={{ color: '#666', fontStyle: 'italic' }}>空桶</div>
            )}
          </div>
          <div style={{ marginTop: 12, textAlign: 'center', fontSize: 14, color: '#a0a0a0' }}>
            源桶 - 索引 2
          </div>
        </div>

        {/* Migration arrow and process */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            minWidth: 200,
          }}
        >
          <div
            style={{
              padding: '12px 20px',
              background: phase >= 1 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255,255,255,0.05)',
              border: `2px solid ${phase >= 1 ? '#4caf50' : '#444'}`,
              borderRadius: 8,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 4 }}>当前步骤</div>
            <div style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff' }}>
              {phase === 0 && '准备迁移'}
              {phase === 1 && '计算新位置'}
              {phase === 2 && `迁移中 (${migratedCount}/${entries.length})`}
              {phase === 3 && '迁移完成'}
            </div>
          </div>

          {phase < 3 && (
            <>
              <div style={{ fontSize: 48, color: '#4caf50' }}>→</div>
              <div
                style={{
                  padding: '8px 16px',
                  background: 'rgba(255, 152, 0, 0.2)',
                  borderRadius: 4,
                  fontSize: 12,
                  color: '#ff9800',
                }}
              >
                hash(k) % 8 → 新位置
              </div>
            </>
          )}
        </div>

        {/* ht[1] */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#ff9800',
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            ht[1] 桶 [2]
          </div>
          <div
            style={{
              padding: 24,
              background: phase >= 1 ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255,255,255,0.05)',
              border: `2px solid ${phase >= 1 ? '#ff9800' : '#444'}`,
              borderRadius: 12,
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              alignItems: 'center',
              opacity: phase >= 1 ? 1 : 0.5,
            }}
          >
            {entries.slice(0, migratedCount).map((key, i) => (
              <EntryBox
                key={key}
                keyName={key}
                value={`v${i + 1}`}
                isHighlighted={false}
                isMigrated={true}
              />
            ))}
            {migratedCount === 0 && phase < 3 && (
              <div style={{ color: '#666', fontStyle: 'italic' }}>等待接收...</div>
            )}
            {phase === 3 && migratedCount === entries.length && (
              <div style={{ color: '#4caf50', fontWeight: 'bold' }}>迁移完成!</div>
            )}
          </div>
          <div style={{ marginTop: 12, textAlign: 'center', fontSize: 14, color: '#a0a0a0' }}>
            目标桶 - 索引 2
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div style={{ marginTop: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          {entries.map((_, i) => (
            <div
              key={i}
              style={{
                width: 80,
                height: 8,
                background: i < migratedCount ? '#4caf50' : '#333',
                borderRadius: 4,
                transition: 'background 0.3s ease',
              }}
            />
          ))}
        </div>
        <div style={{ textAlign: 'center', fontSize: 14, color: '#a0a0a0' }}>
          迁移进度: {migratedCount}/{entries.length} 个 Entry
        </div>
      </div>
    </div>
  );
}

export const BucketMigrationDetail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator title="单桶迁移细节" subtitle="逐步迁移过程" />
      </Sequence>
      <Sequence from={60} durationInFrames={TOTAL_FRAMES - 60}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <AnimatedComponent />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default BucketMigrationDetail;

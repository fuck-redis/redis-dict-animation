/**
 * IteratorScanProcess
 * 视频时长: 12秒 (360帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 360;

function AnimatedComponent() {
  const frame = useCurrentFrame();

  // Simulate iterator scanning through buckets
  const currentBucket = Math.min(Math.floor(frame / 15), 7);
  const scanProgress = (frame % 15) / 15;

  // Entries in each bucket for demonstration
  const buckets = [
    [{ key: 'name', value: 'Alice' }],
    [{ key: 'age', value: '30' }, { key: 'city', value: 'NYC' }],
    [{ key: 'job', value: 'Engineer' }],
    [],
    [{ key: 'lang', value: 'Python' }, { key: 'skill', value: 'Redis' }, { key: 'level', value: 'Expert' }],
    [{ key: 'hobby', value: 'Reading' }],
    [],
    [{ key: 'email', value: 'alice@example.com' }],
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', padding: 40 }}>
      <h2 style={{ color: 'white', marginBottom: 24, fontSize: 28 }}>迭代器扫描过程</h2>

      <div style={{ display: 'flex', gap: 40 }}>
        {/* Left: Hash table visualization */}
        <div style={{ flex: 1 }}>
          <div style={{ color: '#a0a0a0', marginBottom: 16, fontSize: 16 }}>哈希表结构</div>

          {/* Bucket array */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 24,
            maxWidth: 500
          }}>
            {buckets.map((entries, idx) => (
              <div
                key={idx}
                style={{
                  width: 56,
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: idx === currentBucket
                    ? `rgba(33, 150, 243, ${0.3 + scanProgress * 0.4})`
                    : idx < currentBucket
                      ? 'rgba(76, 175, 80, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                  border: `2px solid ${
                    idx === currentBucket
                      ? '#2196f3'
                      : idx < currentBucket
                        ? '#4caf50'
                        : '#444'
                  }`,
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: idx === currentBucket ? '#fff' : idx < currentBucket ? '#4caf50' : '#666',
                  transition: 'all 0.2s ease',
                  transform: idx === currentBucket ? `scale(${1 + scanProgress * 0.1})` : 'scale(1)',
                }}
              >
                {idx}
              </div>
            ))}
          </div>

          {/* Current bucket details */}
          <div style={{
            background: '#1e1e1e',
            borderRadius: 12,
            padding: 20,
            minHeight: 160,
          }}>
            <div style={{ color: '#2196f3', fontSize: 16, marginBottom: 12 }}>
              Bucket {currentBucket} {currentBucket < buckets.length && buckets[currentBucket].length > 0 && 'Details'}
            </div>
            {buckets[currentBucket].length === 0 ? (
              <div style={{ color: '#666', fontStyle: 'italic' }}>空桶，无数据</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {buckets[currentBucket].map((entry, i) => (
                  <div
                    key={entry.key}
                    style={{
                      padding: '8px 16px',
                      background: i === 0 && scanProgress < 0.5 ? 'rgba(33, 150, 243, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${i === 0 && scanProgress < 0.5 ? '#2196f3' : '#444'}`,
                      borderRadius: 6,
                      display: 'flex',
                      gap: 16,
                      fontFamily: "'Courier New', monospace",
                      fontSize: 14,
                    }}
                  >
                    <span style={{ color: colors.keyColor }}>"{entry.key}"</span>
                    <span style={{ color: '#666' }}>:</span>
                    <span style={{ color: colors.valueColor }}>"{entry.value}"</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Iterator state */}
        <div style={{ flex: 1 }}>
          <div style={{ color: '#a0a0a0', marginBottom: 16, fontSize: 16 }}>迭代器状态</div>

          <div style={{
            background: '#1e1e1e',
            borderRadius: 12,
            padding: 20,
            fontFamily: "'Courier New', monospace",
            fontSize: 14,
          }}>
            <div style={{ color: '#6a9955' }}>// dictIterator 结构</div>
            <div style={{ color: '#d4d4d4', marginTop: 12 }}>
              index: <span style={{ color: '#b5cea8' }}>{currentBucket}</span>
            </div>
            <div style={{ color: '#d4d4d4', marginTop: 8 }}>
              table: <span style={{ color: '#b5cea8' }}>0</span>
            </div>
            <div style={{ color: '#d4d4d4', marginTop: 8 }}>
              safe: <span style={{ color: '#569cd6' }}>true</span>
            </div>
            <div style={{ color: '#d4d4d4', marginTop: 8 }}>
              entry: <span style={{ color: '#dcdcaa' }}>
                {buckets[currentBucket].length > 0
                  ? `bucket[${currentBucket}].first`
                  : 'NULL'}
              </span>
            </div>
            <div style={{ color: '#d4d4d4', marginTop: 8 }}>
              nextEntry: <span style={{ color: '#dcdcaa' }}>
                {buckets[currentBucket].length > 1
                  ? `bucket[${currentBucket}].second`
                  : 'NULL'}
              </span>
            </div>
          </div>

          <div style={{
            marginTop: 24,
            padding: 16,
            background: 'rgba(33, 150, 243, 0.1)',
            border: '2px solid #2196f3',
            borderRadius: 8,
          }}>
            <div style={{ color: '#2196f3', fontWeight: 'bold', marginBottom: 8 }}>
              扫描进度
            </div>
            <div style={{
              height: 8,
              background: '#333',
              borderRadius: 4,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${((currentBucket + scanProgress) / 8) * 100}%`,
                background: 'linear-gradient(90deg, #2196f3, #64b5f6)',
                transition: 'width 0.1s linear',
              }} />
            </div>
            <div style={{ color: '#a0a0a0', fontSize: 12, marginTop: 8 }}>
              {Math.floor(((currentBucket + scanProgress) / 8) * 100)}% 已扫描
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: dictNext code */}
      <div style={{
        marginTop: 24,
        background: '#1e1e1e',
        borderRadius: 8,
        padding: 16,
        fontFamily: "'Courier New', monospace",
        fontSize: 13,
      }}>
        <div style={{ color: '#6a9955' }}>// dictNext 简化逻辑</div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>
          <span style={{ color: '#c586c0' }}>while</span> (entry) {'{'}
        </div>
        <div style={{ color: '#dcdcaa', paddingLeft: 20, marginTop: 8 }}>
          visit(entry);
        </div>
        <div style={{ color: '#d4d4d4', paddingLeft: 20, marginTop: 8 }}>
          entry = nextEntry; <span style={{ color: '#6a9955' }}>// 预先保存下一个</span>
        </div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>{'}'}</div>
      </div>
    </div>
  );
}

export const IteratorScanProcess: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator title="迭代器扫描过程" subtitle="Iterator Scan Process" />
      </Sequence>
      <Sequence from={60} durationInFrames={TOTAL_FRAMES - 60}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <AnimatedComponent />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default IteratorScanProcess;

/**
 * UnsafeIteratorRisk
 * 视频时长: 10秒 (300帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 300;

function AnimatedComponent() {
  const frame = useCurrentFrame();

  // Show rehash happening at different phases
  const rehashPhase = Math.floor(frame / 75);
  const showRehash = rehashPhase >= 1 && rehashPhase < 3;

  // Entry positions
  const entryA = { key: 'name', value: 'Alice', bucket: 2 };
  const entryB = { key: 'age', value: '30', bucket: 2 };

  // Simulate entry migration
  const entryAMigrated = frame >= 150;
  const entryBMigrated = frame >= 225;

  // Iterator position
  const iteratorAtBucket = showRehash ? (frame % 75 < 38 ? 2 : 3) : 2;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', padding: 40 }}>
      <h2 style={{ color: '#f44336', marginBottom: 24, fontSize: 28 }}>非安全迭代器风险</h2>

      <div style={{
        padding: 20,
        background: 'rgba(244, 67, 54, 0.1)',
        border: '2px solid #f44336',
        borderRadius: 12,
        marginBottom: 32,
      }}>
        <p style={{ color: 'white', margin: 0, fontSize: 16 }}>
          非安全迭代器<strong style={{ color: '#f44336' }}>不增加 iterators 计数</strong>，
          因此 rehash 可能在迭代过程中发生，导致<strong style={{ color: '#ff9800' }}>元素遗漏或重复</strong>。
        </p>
      </div>

      <div style={{ display: 'flex', gap: 40 }}>
        {/* Left: Hash table with migration */}
        <div style={{ flex: 1 }}>
          <div style={{ color: '#a0a0a0', marginBottom: 16, fontSize: 16 }}>哈希表状态</div>

          <div style={{ display: 'flex', gap: 24 }}>
            {/* ht[0] */}
            <div style={{ flex: 1 }}>
              <div style={{ color: '#2196f3', fontWeight: 'bold', marginBottom: 8 }}>ht[0]</div>
              <div style={{
                padding: 16,
                background: 'rgba(33, 150, 243, 0.1)',
                border: '2px solid #2196f3',
                borderRadius: 8,
                minHeight: 200,
              }}>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ color: '#666', fontSize: 12 }}>Bucket 2:</span>
                  <div style={{
                    padding: '8px 12px',
                    marginTop: 4,
                    background: entryAMigrated ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                    border: `1px solid ${entryAMigrated ? '#444' : '#2196f3'}`,
                    borderRadius: 4,
                    opacity: entryAMigrated ? 0.4 : 1,
                    fontFamily: "'Courier New', monospace",
                    fontSize: 13,
                  }}>
                    <span style={{ color: colors.keyColor }}>"name": "Alice"</span>
                    {entryAMigrated && <span style={{ color: '#ff9800', marginLeft: 8 }}>迁移!</span>}
                  </div>
                  <div style={{
                    padding: '8px 12px',
                    marginTop: 4,
                    background: entryBMigrated ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                    border: `1px solid ${entryBMigrated ? '#444' : '#2196f3'}`,
                    borderRadius: 4,
                    opacity: entryBMigrated ? 0.4 : 1,
                    fontFamily: "'Courier New', monospace",
                    fontSize: 13,
                  }}>
                    <span style={{ color: colors.keyColor }}>"age": "30"</span>
                    {entryBMigrated && <span style={{ color: '#ff9800', marginLeft: 8 }}>迁移!</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow */}
            {showRehash && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                color: '#ff9800',
                fontSize: 24,
                animation: 'pulse 0.5s infinite',
              }}>
                {'->'}
              </div>
            )}

            {/* ht[1] */}
            {showRehash && (
              <div style={{ flex: 1 }}>
                <div style={{ color: '#ff9800', fontWeight: 'bold', marginBottom: 8 }}>ht[1]</div>
                <div style={{
                  padding: 16,
                  background: 'rgba(255, 152, 0, 0.1)',
                  border: '2px solid #ff9800',
                  borderRadius: 8,
                  minHeight: 200,
                }}>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ color: '#666', fontSize: 12 }}>Bucket 1:</span>
                    {entryAMigrated && (
                      <div style={{
                        padding: '8px 12px',
                        marginTop: 4,
                        background: 'rgba(76, 175, 80, 0.2)',
                        border: '1px solid #4caf50',
                        borderRadius: 4,
                        fontFamily: "'Courier New', monospace",
                        fontSize: 13,
                      }}>
                        <span style={{ color: colors.keyColor }}>"name": "Alice"</span>
                        <span style={{ color: '#4caf50', marginLeft: 8 }}>new!</span>
                      </div>
                    )}
                    {entryBMigrated && (
                      <div style={{
                        padding: '8px 12px',
                        marginTop: 4,
                        background: 'rgba(76, 175, 80, 0.2)',
                        border: '1px solid #4caf50',
                        borderRadius: 4,
                        fontFamily: "'Courier New', monospace",
                        fontSize: 13,
                      }}>
                        <span style={{ color: colors.keyColor }}>"age": "30"</span>
                        <span style={{ color: '#4caf50', marginLeft: 8 }}>new!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Problem illustration */}
        <div style={{ flex: 1 }}>
          <div style={{ color: '#a0a0a0', marginBottom: 16, fontSize: 16 }}>迭代器状态</div>

          <div style={{
            background: '#1e1e1e',
            borderRadius: 12,
            padding: 20,
            fontFamily: "'Courier New', monospace",
            fontSize: 14,
          }}>
            <div style={{ color: '#6a9955' }}>// 非安全迭代器</div>
            <div style={{ color: '#d4d4d4', marginTop: 12 }}>
              iterators = <span style={{ color: '#b5cea8' }}>0</span>
              <span style={{ color: '#6a9955' }}> // 不增加计数!</span>
            </div>
            <div style={{ color: '#d4d4d4', marginTop: 8 }}>
              rehashidx = <span style={{ color: '#b5cea8' }}>{showRehash ? '2' : '-1'}</span>
            </div>

            <div style={{
              marginTop: 20,
              padding: 12,
              background: showRehash ? 'rgba(255, 152, 0, 0.2)' : 'rgba(76, 175, 80, 0.2)',
              border: `1px solid ${showRehash ? '#ff9800' : '#4caf50'}`,
              borderRadius: 6,
            }}>
              <div style={{ color: showRehash ? '#ff9800' : '#4caf50' }}>
                {showRehash ? 'Rehash 正在发生!' : '无 Rehash'}
              </div>
            </div>
          </div>

          {showRehash && (
            <div style={{
              marginTop: 24,
              padding: 16,
              background: 'rgba(244, 67, 54, 0.2)',
              border: '2px solid #f44336',
              borderRadius: 8,
            }}>
              <div style={{ color: '#f44336', fontWeight: 'bold', marginBottom: 8 }}>
                问题场景
              </div>
              <ul style={{ color: '#a0a0a0', margin: 0, paddingLeft: 20, fontSize: 14 }}>
                <li>迭代器在 Bucket 2 读取 "name"</li>
                <li style={{ marginTop: 4 }}>Rehash 将 "name" 迁移到 ht[1]</li>
                <li style={{ marginTop: 4 }}>迭代器继续到 Bucket 3</li>
                <li style={{ marginTop: 4, color: '#ff9800' }}>结果: "name" 被遗漏!</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Warning code */}
      <div style={{
        marginTop: 24,
        background: '#1e1e1e',
        borderRadius: 8,
        padding: 20,
        fontFamily: "'Courier New', monospace",
        fontSize: 14,
        border: '2px solid #f44336',
      }}>
        <div style={{ color: '#f44336' }}>// 风险: 非安全迭代器在 rehash 期间可能漏掉元素</div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>
          dictIteratorStart(&iter, d, <span style={{ color: '#569cd6' }}>0</span>);
          <span style={{ color: '#6a9955' }}> // safe = 0</span>
        </div>
        <div style={{ paddingLeft: 20, marginTop: 12, color: '#f44336' }}>
          // iterators 仍然是 0，rehash 可能发生!
        </div>
        <div style={{ color: '#d4d4d4', marginTop: 12 }}>
          while ((de = dictNext(&iter)) != NULL) {'{'}
        </div>
        <div style={{ color: '#dcdcaa', paddingLeft: 20, marginTop: 8 }}>
          // 如果此时发生 rehash，元素可能丢失
        </div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>{'}'}</div>
      </div>
    </div>
  );
}

export const UnsafeIteratorRisk: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator title="非安全迭代器风险" subtitle="Unsafe Iterator Risk" />
      </Sequence>
      <Sequence from={60} durationInFrames={TOTAL_FRAMES - 60}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2e1a1a 100%)' }}>
          <AnimatedComponent />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default UnsafeIteratorRisk;

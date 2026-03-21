/**
 * ScanCursorMechanism
 * 视频时长: 10秒 (300帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 300;

function AnimatedComponent() {
  const frame = useCurrentFrame();

  // Simulate cursor progression across scans
  const scanNumber = Math.floor(frame / 75);
  const scanProgress = (frame % 75) / 75;

  // Hash table size (for cursor calculation)
  const tableSize = 8;

  // Cursor values for each scan
  const cursors = [0, 3, 6, 7];
  const currentCursor = cursors[Math.min(scanNumber, 3)];

  // Simulated visited buckets
  const visitedBuckets: number[] = [];
  for (let i = 0; i <= scanNumber; i++) {
    visitedBuckets.push(cursors[i]);
  }

  // Next cursor calculation (simplified)
  const nextCursor = (currentCursor + 2) % tableSize;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', padding: 40 }}>
      <h2 style={{ color: 'white', marginBottom: 24, fontSize: 28 }}>SCAN游标机制</h2>

      <div style={{ display: 'flex', gap: 40 }}>
        {/* Left: Cursor visualization */}
        <div style={{ flex: 1 }}>
          <div style={{ color: '#a0a0a0', marginBottom: 16, fontSize: 16 }}>游标遍历过程</div>

          {/* Bucket array */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 24,
            maxWidth: 400
          }}>
            {Array.from({ length: tableSize }, (_, i) => {
              const isVisited = visitedBuckets.includes(i);
              const isCurrent = i === currentCursor && scanProgress < 0.8;
              const hasData = [1, 2, 4, 6].includes(i);

              return (
                <div
                  key={i}
                  style={{
                    width: 48,
                    height: 48,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isCurrent
                      ? `rgba(233, 69, 96, ${0.3 + scanProgress * 0.4})`
                      : isVisited
                        ? 'rgba(76, 175, 80, 0.2)'
                        : 'rgba(255, 255, 255, 0.05)',
                    border: `2px solid ${
                      isCurrent
                        ? '#e94560'
                        : isVisited
                          ? '#4caf50'
                          : '#444'
                    }`,
                    borderRadius: 8,
                    fontSize: 12,
                    color: isCurrent ? '#fff' : isVisited ? '#4caf50' : '#666',
                    transition: 'all 0.2s ease',
                    transform: isCurrent ? `scale(${1 + scanProgress * 0.15})` : 'scale(1)',
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>{i}</span>
                  {hasData && (
                    <span style={{ fontSize: 8, marginTop: 2, color: '#666' }}>
                      {isVisited ? 'visited' : 'data'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Scan iteration info */}
          <div style={{
            background: '#1e1e1e',
            borderRadius: 12,
            padding: 20,
          }}>
            <div style={{ color: '#6a9955', marginBottom: 12 }}>// SCAN 迭代状态</div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 14 }}>
              <div style={{ color: '#d4d4d4' }}>
                第 <span style={{ color: '#b5cea8', fontSize: 20 }}>{scanNumber + 1}</span> 次迭代
              </div>
              <div style={{ color: '#d4d4d4', marginTop: 8 }}>
                cursor = <span style={{ color: '#dcdcaa', fontSize: 20 }}>{currentCursor}</span>
              </div>
              <div style={{ color: '#d4d4d4', marginTop: 8 }}>
                已访问: <span style={{ color: '#4caf50' }}>[{visitedBuckets.join(', ')}]</span>
              </div>
              {scanNumber < 3 && (
                <div style={{
                  marginTop: 16,
                  padding: 12,
                  background: 'rgba(233, 69, 96, 0.1)',
                  border: '1px solid #e94560',
                  borderRadius: 6,
                }}>
                  <div style={{ color: '#e94560' }}>
                    下次 cursor: {nextCursor}
                  </div>
                </div>
              )}
              {scanNumber >= 3 && (
                <div style={{
                  marginTop: 16,
                  padding: 12,
                  background: 'rgba(76, 175, 80, 0.2)',
                  border: '1px solid #4caf50',
                  borderRadius: 6,
                }}>
                  <div style={{ color: '#4caf50' }}>
                    遍历完成! cursor = 0
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Cursor algorithm */}
        <div style={{ flex: 1 }}>
          <div style={{ color: '#a0a0a0', marginBottom: 16, fontSize: 16 }}>游标计算算法</div>

          <div style={{
            background: '#1e1e1e',
            borderRadius: 12,
            padding: 20,
            fontFamily: "'Courier New', monospace",
            fontSize: 13,
          }}>
            <div style={{ color: '#6a9955' }}>// SCAN 游标计算公式</div>

            <div style={{
              marginTop: 16,
              padding: 16,
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 8,
            }}>
              <div style={{ color: '#d4d4d4' }}>
                <span style={{ color: '#c586c0' }}>unsigned long</span> v = cursor;
              </div>
              <div style={{ color: '#d4d4d4', marginTop: 8 }}>
                <span style={{ color: '#c586c0' }}>unsigned long</span> tableSize = ht-&gt;sizelog;
              </div>
              <div style={{ color: '#d4d4d4', marginTop: 8 }}>
                <span style={{ color: '#c586c0' }}>unsigned long</span> size = <span style={{ color: '#b5cea8' }}>1 &lt;&lt; tableSize</span>;
              </div>
              <div style={{ color: '#d4d4d4', marginTop: 12 }}>
                <span style={{ color: '#c586c0' }}>do</span> {'{'}
              </div>
              <div style={{ color: '#dcdcaa', paddingLeft: 20, marginTop: 8 }}>
                v |= <span style={{ color: '#b5cea8' }}>~size</span>;
              </div>
              <div style={{ color: '#dcdcaa', paddingLeft: 20, marginTop: 8 }}>
                v = <span style={{ color: '#b5cea8' }}>rev(v)</span>;
              </div>
              <div style={{ color: '#dcdcaa', paddingLeft: 20, marginTop: 8 }}>
                v &amp;= size;
              </div>
              <div style={{ color: '#dcdcaa', paddingLeft: 20, marginTop: 8 }}>
                v = <span style={{ color: '#b5cea8' }}>rev(v)</span>;
              </div>
              <div style={{ color: '#d4d4d4', paddingLeft: 20, marginTop: 8 }}>
                <span style={{ color: '#c586c0' }}>if</span> (v == <span style={{ color: '#b5cea8' }}>0</span>) v = <span style={{ color: '#b5cea8' }}>~0</span>;
              </div>
              <div style={{ color: '#d4d4d4', marginTop: 8 }}>{'}'} <span style={{ color: '#c586c0' }}>while</span> (v &gt; size);</div>
            </div>

            <div style={{
              marginTop: 16,
              padding: 12,
              background: 'rgba(33, 150, 243, 0.1)',
              border: '1px solid #2196f3',
              borderRadius: 6,
            }}>
              <div style={{ color: '#2196f3', fontWeight: 'bold' }}>
                二进制进位法
              </div>
              <div style={{ color: '#a0a0a0', marginTop: 8, fontSize: 12, lineHeight: 1.6 }}>
                通过二进制进位保证:<br />
                1. 每次返回不同的桶<br />
                2. 最终能遍历所有桶<br />
                3. 返回 0 时表示完成
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Usage example */}
      <div style={{
        marginTop: 24,
        background: '#1e1e1e',
        borderRadius: 8,
        padding: 20,
        fontFamily: "'Courier New', monospace",
        fontSize: 13,
      }}>
        <div style={{ color: '#6a9955' }}>// Redis SCAN 命令使用示例</div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>
          <span style={{ color: '#c586c0' }}>long long</span> cursor = <span style={{ color: '#b5cea8' }}>0</span>;
        </div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>
          <span style={{ color: '#c586c0' }}>do</span> {'{'}
        </div>
        <div style={{ color: '#dcdcaa', paddingLeft: 20, marginTop: 8 }}>
          keys = dictScan(d, &amp;cursor, callback, NULL);
        </div>
        <div style={{ color: '#d4d4d4', paddingLeft: 20, marginTop: 8 }}>
          printf(<span style={{ color: '#ce9178' }}>"Scanned %d keys, next cursor: %lld\n"</span>, keys.size, cursor);
        </div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>{'}'} <span style={{ color: '#c586c0' }}>while</span> (cursor != <span style={{ color: '#b5cea8' }}>0</span>);
        </div>
      </div>
    </div>
  );
}

export const ScanCursorMechanism: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator title="SCAN游标机制" subtitle="Scan Cursor Mechanism" />
      </Sequence>
      <Sequence from={60} durationInFrames={TOTAL_FRAMES - 60}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <AnimatedComponent />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default ScanCursorMechanism;

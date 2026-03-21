/**
 * KeysVsScan
 * 视频时长: 10秒 (300帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 300;

function AnimatedComponent() {
  const frame = useCurrentFrame();

  // Animation phases
  const phase = Math.floor(frame / 100);

  // KEYS simulation (fast but blocking)
  const keysProgress = Math.min(frame / 40, 1);

  // SCAN simulation (incremental)
  const scanCycles = Math.floor(frame / 50);
  const scanProgress = (frame % 50) / 50;
  const totalKeys = 12;
  const scannedKeys = Math.min(Math.floor((scanCycles + scanProgress) * 3), totalKeys);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', padding: 40 }}>
      <h2 style={{ color: 'white', marginBottom: 24, fontSize: 28 }}>KEYS命令 vs SCAN命令</h2>

      <div style={{ display: 'flex', gap: 40 }}>
        {/* Left: KEYS command */}
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16,
          }}>
            <span style={{
              padding: '4px 12px',
              background: 'rgba(244, 67, 54, 0.2)',
              border: '1px solid #f44336',
              borderRadius: 4,
              color: '#f44336',
              fontSize: 14,
              fontWeight: 'bold',
            }}>
              KEYS
            </span>
            <span style={{ color: '#a0a0a0', fontSize: 14 }}>阻塞式遍历</span>
          </div>

          <div style={{
            background: '#1e1e1e',
            borderRadius: 12,
            padding: 20,
            border: '2px solid #f44336',
          }}>
            <div style={{ color: '#6a9955', marginBottom: 12 }}>// KEYS 命令实现</div>
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 13,
              color: '#d4d4d4',
            }}>
              <div><span style={{ color: '#c586c0' }}>void</span> keysCommand(dict *d) {'{'}</div>
              <div style={{ paddingLeft: 16, marginTop: 8 }}>
                keys = <span style={{ color: '#dcdcaa' }}>dictGetKeys(d)</span>;
              </div>
              <div style={{ paddingLeft: 16, marginTop: 8 }}>
                <span style={{ color: '#c586c0' }}>return</span> keys;
              </div>
              <div>{'}'}</div>
            </div>

            <div style={{
              marginTop: 20,
              padding: 16,
              background: 'rgba(244, 67, 54, 0.1)',
              borderRadius: 8,
            }}>
              <div style={{ color: '#f44336', fontWeight: 'bold', marginBottom: 8 }}>
                问题
              </div>
              <ul style={{ color: '#a0a0a0', margin: 0, paddingLeft: 20, fontSize: 13 }}>
                <li>一次返回所有键</li>
                <li>大数据集会导致阻塞</li>
                <li>生产环境严禁使用</li>
              </ul>
            </div>

            {/* Progress bar simulation */}
            {phase === 0 && (
              <div style={{ marginTop: 20 }}>
                <div style={{ color: '#a0a0a0', fontSize: 12, marginBottom: 8 }}>
                  执行进度 (阻塞中...)
                </div>
                <div style={{
                  height: 8,
                  background: '#333',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${keysProgress * 100}%`,
                    background: '#f44336',
                    transition: 'width 0.05s linear',
                  }} />
                </div>
              </div>
            )}

            {phase >= 1 && (
              <div style={{
                marginTop: 20,
                padding: 12,
                background: 'rgba(76, 175, 80, 0.2)',
                border: '1px solid #4caf50',
                borderRadius: 6,
              }}>
                <div style={{ color: '#4caf50' }}>
                  完成! 返回所有键
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: SCAN command */}
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16,
          }}>
            <span style={{
              padding: '4px 12px',
              background: 'rgba(76, 175, 80, 0.2)',
              border: '1px solid #4caf50',
              borderRadius: 4,
              color: '#4caf50',
              fontSize: 14,
              fontWeight: 'bold',
            }}>
              SCAN
            </span>
            <span style={{ color: '#a0a0a0', fontSize: 14 }}>增量式遍历</span>
          </div>

          <div style={{
            background: '#1e1e1e',
            borderRadius: 12,
            padding: 20,
            border: '2px solid #4caf50',
          }}>
            <div style={{ color: '#6a9955', marginBottom: 12 }}>// SCAN 命令实现</div>
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 13,
              color: '#d4d4d4',
            }}>
              <div><span style={{ color: '#c586c0' }}>do</span> {'{'}</div>
              <div style={{ paddingLeft: 16, marginTop: 8 }}>
                (keys, cursor) = <span style={{ color: '#dcdcaa' }}>dictScan(d, &amp;cursor)</span>;
              </div>
              <div style={{ paddingLeft: 16, marginTop: 8 }}>
                process(keys);
              </div>
              <div style={{ paddingLeft: 16, marginTop: 8 }}>
                <span style={{ color: '#c586c0' }}>yield</span> <span style={{ color: '#6a9955' }}>// 让出控制权</span>
              </div>
              <div>{'}'} <span style={{ color: '#c586c0' }}>while</span> (cursor != 0);</div>
            </div>

            <div style={{
              marginTop: 20,
              padding: 16,
              background: 'rgba(76, 175, 80, 0.1)',
              borderRadius: 8,
            }}>
              <div style={{ color: '#4caf50', fontWeight: 'bold', marginBottom: 8 }}>
                优势
              </div>
              <ul style={{ color: '#a0a0a0', margin: 0, paddingLeft: 20, fontSize: 13 }}>
                <li>每次只返回部分键</li>
                <li>非阻塞，可中断</li>
                <li>适合生产环境</li>
              </ul>
            </div>

            {/* Progress bar simulation */}
            {phase < 2 && (
              <div style={{ marginTop: 20 }}>
                <div style={{ color: '#a0a0a0', fontSize: 12, marginBottom: 8 }}>
                  增量扫描进度 ({scannedKeys}/{totalKeys} 键)
                </div>
                <div style={{
                  height: 8,
                  background: '#333',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(scannedKeys / totalKeys) * 100}%`,
                    background: '#4caf50',
                    transition: 'width 0.1s linear',
                  }} />
                </div>
                <div style={{ color: '#666', fontSize: 11, marginTop: 4 }}>
                  cursor = {(scanCycles + 1) * 3 % 16}
                </div>
              </div>
            )}

            {phase >= 2 && (
              <div style={{
                marginTop: 20,
                padding: 12,
                background: 'rgba(76, 175, 80, 0.2)',
                border: '1px solid #4caf50',
                borderRadius: 6,
              }}>
                <div style={{ color: '#4caf50' }}>
                  完成! cursor = 0
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Comparison table */}
      <div style={{
        marginTop: 24,
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 12,
        padding: 20,
        border: '1px solid #333',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ padding: 12, textAlign: 'left', color: '#666' }}>特性</th>
              <th style={{ padding: 12, textAlign: 'left', color: '#f44336' }}>KEYS</th>
              <th style={{ padding: 12, textAlign: 'left', color: '#4caf50' }}>SCAN</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['阻塞时间', 'O(N)', 'O(1) 每次'],
              ['内存使用', 'O(N)', 'O(1)'],
              ['可中断', '否', '是'],
              ['适用场景', '小数据/开发', '生产环境'],
              ['返回方式', '一次全部', '增量游标'],
            ].map(([feature, keys, scan], i) => (
              <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: 12, color: '#a0a0a0' }}>{feature}</td>
                <td style={{ padding: 12, color: '#f44336' }}>{keys}</td>
                <td style={{ padding: 12, color: '#4caf50' }}>{scan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const KeysVsScan: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator title="KEYS命令 vs SCAN命令" subtitle="KEYS vs SCAN Commands" />
      </Sequence>
      <Sequence from={60} durationInFrames={TOTAL_FRAMES - 60}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <AnimatedComponent />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default KeysVsScan;

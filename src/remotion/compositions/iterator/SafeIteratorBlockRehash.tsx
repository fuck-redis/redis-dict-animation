/**
 * SafeIteratorBlockRehash
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
  const phase = Math.floor(frame / 75);

  // Iterator count visualization (0 or 1)
  const iteratorsCount = phase >= 1 && phase < 3 ? 1 : 0;

  // Rehash allowed state
  const rehashAllowed = phase < 1 || phase >= 3;

  // Current operation
  const operation = phase === 0 ? 'dictAdd' : phase === 1 ? 'dictNext (迭代中)' : phase === 2 ? 'dictNext (迭代中)' : 'dictAdd (完成)';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', padding: 40 }}>
      <h2 style={{ color: 'white', marginBottom: 24, fontSize: 28 }}>安全迭代器阻止Rehash</h2>

      <div style={{ display: 'flex', gap: 40 }}>
        {/* Left: Dict structure with iterators counter */}
        <div style={{ flex: 1 }}>
          <div style={{ color: '#a0a0a0', marginBottom: 16, fontSize: 16 }}>字典结构</div>

          <div style={{
            background: '#1e1e1e',
            borderRadius: 12,
            padding: 24,
            fontFamily: "'Courier New', monospace",
            fontSize: 14,
          }}>
            <div style={{ color: '#6a9955' }}>typedef struct dict {'{'}</div>
            <div style={{ color: '#d4d4d4', paddingLeft: 20, marginTop: 8 }}>
              dictht ht[2];
              <span style={{ color: '#6a9955' }}> // 两个哈希表</span>
            </div>
            <div style={{ color: '#d4d4d4', paddingLeft: 20, marginTop: 8 }}>
              long rehashidx;
              <span style={{ color: '#6a9955' }}> // rehash进度 (-1表示未进行)</span>
            </div>
            <div style={{ color: '#d4d4d4', paddingLeft: 20, marginTop: 8 }}>
              int iterators;
              <span style={{ color: '#6a9955' }}> // 活跃迭代器数量</span>
            </div>
            <div style={{ color: '#6a9955', marginTop: 8 }}>{'}'} dict;</div>

            <div style={{
              marginTop: 24,
              padding: 16,
              background: 'rgba(33, 150, 243, 0.1)',
              border: '2px solid #2196f3',
              borderRadius: 8,
            }}>
              <div style={{ color: '#d4d4d4' }}>
                iterators = <span style={{
                  color: iteratorsCount > 0 ? '#4caf50' : '#b5cea8',
                  fontSize: 24,
                  fontWeight: 'bold'
                }}>{iteratorsCount}</span>
              </div>
              <div style={{
                marginTop: 12,
                color: iteratorsCount > 0 ? '#4caf50' : '#ff9800',
                fontSize: 14,
              }}>
                {iteratorsCount > 0 ? '禁止触发 rehash' : '允许触发 rehash'}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Timeline visualization */}
        <div style={{ flex: 1 }}>
          <div style={{ color: '#a0a0a0', marginBottom: 16, fontSize: 16 }}>操作时间线</div>

          {/* Timeline */}
          <div style={{
            position: 'relative',
            height: 8,
            background: '#333',
            borderRadius: 4,
            marginBottom: 32,
            marginTop: 40,
          }}>
            {/* Phase markers */}
            <div style={{
              position: 'absolute',
              left: '0%',
              top: -8,
              width: 2,
              height: 24,
              background: '#4caf50',
            }} />
            <div style={{
              position: 'absolute',
              left: '25%',
              top: -8,
              width: 2,
              height: 24,
              background: '#ff9800',
            }} />
            <div style={{
              position: 'absolute',
              left: '75%',
              top: -8,
              width: 2,
              height: 24,
              background: '#4caf50',
            }} />

            {/* Current position */}
            <div style={{
              position: 'absolute',
              left: `${(frame / TOTAL_FRAMES) * 100}%`,
              top: -12,
              width: 16,
              height: 32,
              background: '#e94560',
              borderRadius: 4,
              transform: 'translateX(-50%)',
            }} />
          </div>

          {/* Phase labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666' }}>
            <span>0s</span>
            <span style={{ color: '#4caf50' }}>2.5s</span>
            <span style={{ color: '#ff9800' }}>7.5s</span>
            <span>10s</span>
          </div>

          {/* Phase descriptions */}
          <div style={{ marginTop: 24 }}>
            {[
              { phase: 0, label: '添加操作', color: '#4caf50', desc: '触发 rehash', active: phase === 0 },
              { phase: 1, label: '开始迭代', color: '#ff9800', desc: 'iterators++ = 1', active: phase === 1 },
              { phase: 2, label: '迭代中', color: '#ff9800', desc: 'rehash 被阻塞', active: phase === 2 },
              { phase: 3, label: '迭代结束', color: '#4caf50', desc: 'iterators-- = 0', active: phase === 3 },
            ].map((item) => (
              <div
                key={item.phase}
                style={{
                  padding: '12px 16px',
                  marginBottom: 8,
                  background: item.active ? `rgba(${item.color === '#4caf50' ? '76,175,80' : '255,152,0'}, 0.2)` : 'rgba(255,255,255,0.02)',
                  border: `2px solid ${item.active ? item.color : '#333'}`,
                  borderRadius: 8,
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ color: item.active ? item.color : '#666', fontWeight: 'bold' }}>
                  {item.label}
                </div>
                <div style={{ color: '#a0a0a0', fontSize: 12, marginTop: 4 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: Code visualization */}
      <div style={{
        marginTop: 24,
        background: '#1e1e1e',
        borderRadius: 8,
        padding: 20,
        fontFamily: "'Courier New', monospace",
        fontSize: 14,
      }}>
        <div style={{ color: '#6a9955' }}>// 安全迭代器创建</div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>
          dictIterator iter;
        </div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>
          dictIteratorStart(&iter, d, <span style={{ color: '#569cd6' }}>1</span>);
          <span style={{ color: '#6a9955' }}> // safe = 1</span>
        </div>
        <div style={{ paddingLeft: 20, marginTop: 12, color: '#ff9800' }}>
          d-&gt;iterators++; <span style={{ color: '#6a9955' }}>// 此时 iterators = 1，rehash 被阻塞</span>
        </div>
        <div style={{ color: '#d4d4d4', marginTop: 12 }}>
          while ((de = dictNext(&iter)) != NULL) {'{'}
        </div>
        <div style={{ color: '#dcdcaa', paddingLeft: 20, marginTop: 8 }}>
          process(de);
        </div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>{'}'}</div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>
          dictReleaseIterator(&iter);
        </div>
        <div style={{ paddingLeft: 0, marginTop: 8, color: '#4caf50' }}>
          d-&gt;iterators--; <span style={{ color: '#6a9955' }}>// iterators = 0，rehash 可以继续</span>
        </div>
      </div>
    </div>
  );
}

export const SafeIteratorBlockRehash: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator title="安全迭代器阻止Rehash" subtitle="Safe Iterator Blocks Rehash" />
      </Sequence>
      <Sequence from={60} durationInFrames={TOTAL_FRAMES - 60}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <AnimatedComponent />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default SafeIteratorBlockRehash;

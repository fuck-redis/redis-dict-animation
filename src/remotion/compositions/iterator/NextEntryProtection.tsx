/**
 * NextEntryProtection
 * 视频时长: 10秒 (300帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 300;

function AnimatedComponent() {
  const frame = useCurrentFrame();

  // Phase 0: Normal state
  // Phase 1: Entry B gets rehash during iteration
  const phase = Math.floor(frame / 75);

  // Animation of entry positions
  const entryAMoved = phase >= 2;

  // Current iteration step
  const currentStep = Math.min(Math.floor(frame / 25), 5);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', padding: 40 }}>
      <h2 style={{ color: '#4caf50', marginBottom: 24, fontSize: 28 }}>nextEntry保护机制</h2>

      <div style={{
        padding: 20,
        background: 'rgba(76, 175, 80, 0.1)',
        border: '2px solid #4caf50',
        borderRadius: 12,
        marginBottom: 32,
      }}>
        <p style={{ color: 'white', margin: 0, fontSize: 16 }}>
          <strong style={{ color: '#4caf50' }}>nextEntry</strong> 在迭代开始时预先保存下一个节点，
          即使当前节点被 rehash 迁移到 ht[1]，迭代器仍能通过 nextEntry 继续遍历完整链表。
        </p>
      </div>

      <div style={{ display: 'flex', gap: 40 }}>
        {/* Left: Chain visualization */}
        <div style={{ flex: 1 }}>
          <div style={{ color: '#a0a0a0', marginBottom: 16, fontSize: 16 }}>冲突链结构</div>

          <div style={{
            background: '#1e1e1e',
            borderRadius: 12,
            padding: 24,
            minHeight: 280,
          }}>
            {/* Bucket header */}
            <div style={{ color: '#666', fontSize: 12, marginBottom: 12 }}>
              Bucket 3:
            </div>

            {/* Chain visualization */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Entry A */}
              <div style={{
                padding: '12px 16px',
                background: currentStep >= 2 && currentStep < 4 ? 'rgba(33, 150, 243, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${currentStep >= 2 && currentStep < 4 ? '#2196f3' : '#444'}`,
                borderRadius: 8,
                fontFamily: "'Courier New', monospace",
                fontSize: 14,
                position: 'relative',
              }}>
                <div style={{ color: colors.keyColor }}>"user1"</div>
                <div style={{ color: colors.valueColor }}>"Alice"</div>
                <div style={{
                  position: 'absolute',
                  right: -40,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666',
                  fontSize: 20,
                }}>
                  {'->'}
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: -8,
                  left: 16,
                  fontSize: 10,
                  color: '#4caf50',
                  background: '#1e1e1e',
                  padding: '0 4px',
                }}>
                  nextEntry
                </div>
              </div>

              {/* Entry B */}
              <div style={{
                padding: '12px 16px',
                background: currentStep >= 3 && currentStep < 5 ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${currentStep >= 3 && currentStep < 5 ? '#ff9800' : '#444'}`,
                borderRadius: 8,
                fontFamily: "'Courier New', monospace",
                fontSize: 14,
                position: 'relative',
                marginLeft: 40,
              }}>
                <div style={{ color: colors.keyColor }}>"user2"</div>
                <div style={{ color: colors.valueColor }}>"Bob"</div>
                {entryAMoved && (
                  <div style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    background: '#ff9800',
                    color: 'white',
                    fontSize: 10,
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}>
                    迁移中
                  </div>
                )}
                <div style={{
                  position: 'absolute',
                  right: -40,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666',
                  fontSize: 20,
                }}>
                  {'->'}
                </div>
              </div>

              {/* NULL */}
              <div style={{
                padding: '8px 16px',
                marginLeft: 40,
                color: '#666',
                fontFamily: "'Courier New', monospace",
                fontSize: 14,
              }}>
                NULL
              </div>
            </div>
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
            <div style={{ color: '#6a9955' }}>// dictNext 内部逻辑</div>

            <div style={{
              marginTop: 16,
              padding: 12,
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 6,
            }}>
              <div style={{ color: '#d4d4d4' }}>
                <span style={{ color: '#c586c0' }}>do</span> {'{'}
              </div>
              <div style={{ color: '#d4d4d4', paddingLeft: 16, marginTop: 8 }}>
                ...
              </div>
              <div style={{ color: '#d4d4d4', paddingLeft: 16, marginTop: 8 }}>
                entry = entry-&gt;next;
              </div>
              <div style={{ color: '#d4d4d4', marginTop: 8 }}>{'}'} <span style={{ color: '#c586c0' }}>while</span> (entry ...);</div>
            </div>

            <div style={{
              marginTop: 16,
              padding: 12,
              background: 'rgba(76, 175, 80, 0.2)',
              border: '1px solid #4caf50',
              borderRadius: 6,
            }}>
              <div style={{ color: '#4caf50', fontWeight: 'bold' }}>
                关键保护:
              </div>
              <div style={{ color: '#a0a0a0', marginTop: 8, fontSize: 13 }}>
                在访问当前节点<strong style={{ color: 'white' }}>之前</strong>，<br />
                预先将 <span style={{ color: '#dcdcaa' }}>nextEntry = entry-&gt;next</span><br />
                保存到栈变量中
              </div>
            </div>
          </div>

          {/* Protection explanation */}
          <div style={{
            marginTop: 24,
            padding: 16,
            background: 'rgba(33, 150, 243, 0.1)',
            border: '2px solid #2196f3',
            borderRadius: 8,
          }}>
            <div style={{ color: '#2196f3', fontWeight: 'bold', marginBottom: 8 }}>
              工作原理
            </div>
            <ol style={{ color: '#a0a0a0', margin: 0, paddingLeft: 20, fontSize: 13, lineHeight: 1.8 }}>
              <li>迭代器访问 Entry A</li>
              <li>同时保存 <span style={{ color: '#dcdcaa' }}>nextEntry = Entry B</span></li>
              <li>Entry B 被 rehash 迁移到 ht[1]</li>
              <li>迭代器通过 nextEntry 找到 Entry B</li>
              <li style={{ color: '#4caf50' }}>完整遍历，无遗漏!</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Bottom: Code */}
      <div style={{
        marginTop: 24,
        background: '#1e1e1e',
        borderRadius: 8,
        padding: 20,
        fontFamily: "'Courier New', monospace",
        fontSize: 13,
      }}>
        <div style={{ color: '#6a9955' }}>// nextEntry 保存逻辑（伪代码）</div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>
          dictEntry *dictNext(dictIterator *iter) {'{'}
        </div>
        <div style={{ color: '#d4d4d4', paddingLeft: 20, marginTop: 8 }}>
          <span style={{ color: '#c586c0' }}>while</span> (1) {'{'}
        </div>
        <div style={{ color: '#dcdcaa', paddingLeft: 40, marginTop: 8 }}>
          // 预先保存 nextEntry
        </div>
        <div style={{ color: '#d4d4d4', paddingLeft: 40, marginTop: 8 }}>
          nextEntry = entry-&gt;next;
        </div>
        <div style={{ color: '#d4d4d4', paddingLeft: 40, marginTop: 8 }}>
          <span style={{ color: '#c586c0' }}>if</span> (rehash) moveToHt1(entry);
        </div>
        <div style={{ color: '#d4d4d4', paddingLeft: 40, marginTop: 8 }}>
          visit(entry); <span style={{ color: '#6a9955' }}>// 安全访问</span>
        </div>
        <div style={{ color: '#d4d4d4', paddingLeft: 40, marginTop: 8 }}>
          entry = nextEntry;
        </div>
        <div style={{ color: '#d4d4d4', paddingLeft: 20, marginTop: 8 }}>{'}'}</div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>{'}'}</div>
      </div>
    </div>
  );
}

export const NextEntryProtection: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator title="nextEntry保护机制" subtitle="NextEntry Protection Mechanism" />
      </Sequence>
      <Sequence from={60} durationInFrames={TOTAL_FRAMES - 60}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <AnimatedComponent />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default NextEntryProtection;

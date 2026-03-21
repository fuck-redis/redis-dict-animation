/**
 * 链表演示 - 删除操作
 * 视频时长: 15秒 (450帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const TOTAL_FRAMES = 450;

function ChainDeletionAnimation() {
  const frame = useCurrentFrame();

  // 动画阶段
  // 0-60: 显示初始链表状态
  // 60-150: 找到要删除的节点 (name)
  // 150-240: 执行删除 - 重新链接
  // 240-330: 显示删除后的链表
  // 330-450: 总结

  const phase = Math.floor(frame / 90);
  const foundTarget = phase >= 1;
  const relinked = phase >= 2;
  const deleted = phase >= 3;

  // 链表数据
  const chain = [
    { key: 'email', value: 'e@test.com' },
    { key: 'name', value: 'Bob' },
    { key: 'city', value: 'NYC' },
  ];

  const targetIndex = 1; // 删除 "name"

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 32 }}>链表演示 - 删除操作</h2>

      <div style={{ display: 'flex', gap: 60 }}>
        {/* 左侧: 桶和链表 */}
        <div style={{ position: 'relative', width: 380, height: 420 }}>
          {/* 桶 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 120,
              width: 120,
              height: 60,
              background: 'rgba(33, 150, 243, 0.3)',
              border: '3px solid #2196f3',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            桶 2
          </div>

          {/* 箭头: 桶到第一个节点 */}
          <div
            style={{
              position: 'absolute',
              top: 55,
              left: 170,
              color: '#2196f3',
              fontSize: 18,
              fontWeight: 'bold',
            }}
          >
            ↓
          </div>

          {/* 链表节点 */}
          {chain.map((node, index) => {
            const isTarget = index === targetIndex;
            const isBeforeTarget = index < targetIndex;
            const isAfterTarget = index > targetIndex;
            const isBeingDeleted = isTarget && phase >= 2 && phase < 4;
            const isRemoved = deleted && isTarget;

            // 如果节点被删除，不显示
            if (isRemoved) {
              return null;
            }

            return (
              <React.Fragment key={node.key}>
                {/* 节点 */}
                <div
                  style={{
                    position: 'absolute',
                    top: 80 + (isAfterTarget ? index - 1 : index) * 80,
                    left: 80,
                    padding: '14px 18px',
                    background: isBeingDeleted
                      ? 'rgba(244, 67, 54, 0.3)'
                      : isTarget && foundTarget && !relinked
                      ? 'rgba(255, 193, 7, 0.4)'
                      : isBeforeTarget
                      ? 'rgba(76, 175, 80, 0.3)'
                      : 'rgba(255, 255, 255, 0.95)',
                    border: `3px solid ${isBeingDeleted ? '#f44336' : isTarget && foundTarget && !relinked ? '#ffc107' : isBeforeTarget && relinked ? '#4caf50' : '#2196f3'}`,
                    borderRadius: 8,
                    minWidth: 130,
                    transition: 'all 0.4s ease',
                    transform: `scale(${isBeingDeleted ? 0.8 : isTarget && foundTarget && !relinked ? 1.1 : 1})`,
                    opacity: isBeingDeleted ? 0.6 : 1,
                  }}
                >
                  <div style={{ textAlign: 'center', fontFamily: "'Courier New', monospace" }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#1565c0' }}>
                      "{node.key}"
                    </div>
                    <div style={{ fontSize: 14, color: '#666', margin: '4px 0' }}>:</div>
                    <div style={{ fontSize: 16, color: '#388e3c' }}>
                      "{node.value}"
                    </div>
                  </div>
                  {isTarget && foundTarget && !relinked && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -30,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '4px 12px',
                        background: '#ffc107',
                        borderRadius: 12,
                        fontSize: 12,
                        color: '#000',
                        fontWeight: 'bold',
                      }}
                    >
                      待删除
                    </div>
                  )}
                  {isBeingDeleted && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -30,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '4px 12px',
                        background: '#f44336',
                        borderRadius: 12,
                        fontSize: 12,
                        color: '#fff',
                        fontWeight: 'bold',
                      }}
                    >
                      删除中
                    </div>
                  )}
                </div>

                {/* relink 箭头 */}
                {relinked && index === targetIndex - 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 140 + index * 80,
                      left: 230,
                      color: '#4caf50',
                      fontSize: 14,
                      fontWeight: 'bold',
                      background: 'rgba(76, 175, 80, 0.2)',
                      padding: '4px 8px',
                      borderRadius: 4,
                    }}
                  >
                    next = city
                  </div>
                )}

                {/* 箭头 */}
                {!isRemoved && index < chain.length - 1 && !(isTarget && relinked) && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 150 + (isAfterTarget ? index - 1 : index) * 80,
                      left: 160,
                      color: relinked && isBeforeTarget ? '#4caf50' : '#666',
                      fontSize: 18,
                      fontWeight: 'bold',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    ↓
                  </div>
                )}

                {/* 跳过的箭头 (删除时) */}
                {relinked && isTarget && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 140 + (targetIndex - 1) * 80,
                      left: 230,
                      color: '#f44336',
                      fontSize: 14,
                      fontWeight: 'bold',
                      background: 'rgba(244, 67, 54, 0.2)',
                      padding: '4px 8px',
                      borderRadius: 4,
                    }}
                  >
                    跳过 name
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {/* NULL */}
          {!deleted && (
            <div
              style={{
                position: 'absolute',
                top: 80 + chain.length * 80,
                left: 80,
                padding: '10px 18px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px dashed #666',
                borderRadius: 8,
                minWidth: 130,
              }}
            >
              <div style={{ textAlign: 'center', fontFamily: "'Courier New', monospace", color: '#666' }}>
                NULL
              </div>
            </div>
          )}

          {/* 删除后的 NULL */}
          {deleted && (
            <div
              style={{
                position: 'absolute',
                top: 80 + (chain.length - 1) * 80,
                left: 80,
                padding: '10px 18px',
                background: 'rgba(76, 175, 80, 0.2)',
                border: '2px solid #4caf50',
                borderRadius: 8,
                minWidth: 130,
              }}
            >
              <div style={{ textAlign: 'center', fontFamily: "'Courier New', monospace", color: '#4caf50' }}>
                NULL
              </div>
            </div>
          )}
        </div>

        {/* 右侧: 步骤说明 */}
        <div style={{ flex: 1 }}>
          {phase === 0 && (
            <div style={{ padding: 20, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 8 }}>
              <h3 style={{ color: '#f44336', marginTop: 0 }}>删除目标: "name"</h3>
              <p style={{ color: '#a0a0a0', marginTop: 16 }}>当前链表:</p>
              <p style={{ color: '#ff9800', fontFamily: "'Courier New', monospace", fontSize: 16, marginTop: 8 }}>
                email → name → city → NULL
              </p>
              <p style={{ color: '#666', fontSize: 14, marginTop: 16 }}>
                需要删除 "name" 节点
              </p>
            </div>
          )}

          {phase === 1 && (
            <div style={{ padding: 20, background: 'rgba(255, 193, 7, 0.2)', borderRadius: 8 }}>
              <h3 style={{ color: '#ffc107', marginTop: 0 }}>步骤 1: 找到目标节点</h3>
              <p style={{ color: 'white' }}>遍历链表找到 "name"</p>
              <p style={{ color: '#a0a0a0', marginTop: 12 }}>记录:</p>
              <ul style={{ color: '#a0a0a0', marginTop: 8 }}>
                <li>prev = email</li>
                <li>target = name</li>
                <li>target.next = city</li>
              </ul>
            </div>
          )}

          {phase === 2 && (
            <div style={{ padding: 20, background: 'rgba(244, 67, 54, 0.2)', borderRadius: 8 }}>
              <h3 style={{ color: '#f44336', marginTop: 0 }}>步骤 2: 重新链接</h3>
              <p style={{ color: 'white' }}>关键操作:</p>
              <p style={{ color: '#ff9800', fontFamily: "'Courier New', monospace", marginTop: 12 }}>
                email.next = city
              </p>
              <p style={{ color: '#a0a0a0', marginTop: 12 }}>
                将 email 直接指向 city，跳过 name
              </p>
            </div>
          )}

          {phase === 3 && (
            <div style={{ padding: 20, background: 'rgba(76, 175, 80, 0.2)', borderRadius: 8 }}>
              <h3 style={{ color: '#4caf50', marginTop: 0 }}>步骤 3: 释放内存</h3>
              <p style={{ color: 'white' }}>删除完成后的链表:</p>
              <p style={{ color: '#4caf50', fontFamily: "'Courier New', monospace", fontSize: 18, marginTop: 8 }}>
                email → city → NULL
              </p>
              <p style={{ color: '#a0a0a0', marginTop: 16 }}>释放 name 节点的内存</p>
            </div>
          )}

          {phase >= 4 && (
            <div style={{ padding: 20, background: 'rgba(76, 175, 80, 0.2)', borderRadius: 8 }}>
              <h3 style={{ color: '#4caf50', marginTop: 0 }}>删除完成!</h3>
              <p style={{ color: 'white', fontSize: 18 }}>
                新链表: email → city → NULL
              </p>
              <div style={{ marginTop: 20, padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
                <h4 style={{ color: '#a0a0a0', marginTop: 0, marginBottom: 12 }}>关键点</h4>
                <p style={{ color: '#a0a0a0' }}>
                  <span style={{ color: '#ff9800' }}>Relink:</span> 将前驱节点的 next 指向后继节点
                </p>
                <p style={{ color: '#a0a0a0', marginTop: 8 }}>
                  <span style={{ color: '#ff9800' }}>Free:</span> 释放被删除节点的内存
                </p>
                <p style={{ color: '#a0a0a0', marginTop: 8 }}>
                  <span style={{ color: '#ff9800' }}>时间复杂度:</span> O(k)，k 是节点位置
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部状态栏 */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 48,
          right: 48,
          padding: 16,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 8,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span style={{ color: '#a0a0a0' }}>链表状态:</span>
        {deleted ? (
          <span style={{ color: '#4caf50', fontFamily: "'Courier New', monospace" }}>
            email → city → NULL
          </span>
        ) : (
          <span style={{ color: '#ff9800', fontFamily: "'Courier New', monospace" }}>
            email → name → city → NULL
          </span>
        )}
        {relinked && !deleted && (
          <span style={{ color: '#f44336', fontSize: 14 }}>
            (正在删除 name...)
          </span>
        )}
      </div>
    </div>
  );
}

export const ChainDeletionDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="链表演示 - 删除"
          subtitle="Chain Deletion"
        />
      </Sequence>

      {/* 第二段: 删除动画 */}
      <Sequence from={60} durationInFrames={390}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <ChainDeletionAnimation />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default ChainDeletionDemo;

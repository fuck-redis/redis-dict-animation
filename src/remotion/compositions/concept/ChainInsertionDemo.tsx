/**
 * 链表演示 - 插入操作
 * 视频时长: 15秒 (450帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const TOTAL_FRAMES = 450;

function InsertStep({
  step,
  description,
  x,
  y,
  delay,
}: {
  step: number;
  description: string;
  x: number;
  y: number;
  delay: number;
}) {
  const frame = useCurrentFrame();
  const opacity = interpolate(Math.max(0, frame - delay), [0, 20], [0, 1], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
        padding: '12px 16px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        borderLeft: '4px solid #4caf50',
      }}
    >
      <span style={{ color: '#4caf50', fontWeight: 'bold', marginRight: 12 }}>Step {step}</span>
      <span style={{ color: 'white' }}>{description}</span>
    </div>
  );
}

function ChainInsertionAnimation() {
  const frame = useCurrentFrame();

  // 动画阶段 (每90帧一个阶段)
  // 0-90: 显示初始状态，桶2有 city
  // 90-180: 准备插入 name，遍历到链尾
  // 180-270: 执行插入，将 name.next = city
  // 270-360: 更新链表头部
  // 360-450: 完成状态

  const phase = Math.floor(frame / 90);
  const showNewNode = phase >= 2;
  const showRelink = phase >= 2;
  const showComplete = phase >= 3;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 32 }}>链表演示 - 头插法</h2>

      <div style={{ display: 'flex', gap: 60 }}>
        {/* 左侧: 桶和链表 */}
        <div style={{ position: 'relative', width: 350, height: 400 }}>
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

          {/* 链表节点 - city */}
          <div
            style={{
              position: 'absolute',
              top: 80,
              left: 80,
              padding: '14px 18px',
              background: phase >= 3 ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.95)',
              border: `3px solid ${phase >= 3 ? '#4caf50' : '#2196f3'}`,
              borderRadius: 8,
              minWidth: 130,
              transition: 'all 0.5s ease',
            }}
          >
            <div style={{ textAlign: 'center', fontFamily: "'Courier New', monospace" }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#1565c0' }}>"city"</div>
              <div style={{ fontSize: 14, color: '#666', margin: '4px 0' }}>:</div>
              <div style={{ fontSize: 16, color: '#388e3c' }}>"NYC"</div>
            </div>
          </div>

          {/* 箭头: 桶到 city */}
          <div
            style={{
              position: 'absolute',
              top: 60,
              left: 160,
              color: '#2196f3',
              fontSize: 20,
              fontWeight: 'bold',
            }}
          >
            ↓
          </div>

          {/* 链表节点 - name (原始位置或新位置) */}
          {(phase < 2 || phase >= 3) && (
            <>
              <div
                style={{
                  position: 'absolute',
                  top: 160,
                  left: 80,
                  padding: '14px 18px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '3px solid #ff9800',
                  borderRadius: 8,
                  minWidth: 130,
                  opacity: phase >= 2 ? 0 : 1,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <div style={{ textAlign: 'center', fontFamily: "'Courier New', monospace" }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#1565c0' }}>"name"</div>
                  <div style={{ fontSize: 14, color: '#666', margin: '4px 0' }}>:</div>
                  <div style={{ fontSize: 16, color: '#388e3c' }}>"Bob"</div>
                </div>
              </div>

              {/* 箭头: city 到 name */}
              {phase < 2 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 140,
                    left: 160,
                    color: '#4caf50',
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}
                >
                  ↓
                </div>
              )}
            </>
          )}

          {/* 新插入的节点 - email (在头部) */}
          {showNewNode && (
            <div
              style={{
                position: 'absolute',
                top: 240,
                left: 80,
                padding: '14px 18px',
                background: phase >= 3 ? 'rgba(76, 175, 80, 0.5)' : 'rgba(255, 235, 59, 0.5)',
                border: `3px solid ${phase >= 3 ? '#4caf50' : '#ffc107'}`,
                borderRadius: 8,
                minWidth: 130,
                animation: phase < 3 ? 'pulse 0.5s infinite' : 'none',
              }}
            >
              <div style={{ textAlign: 'center', fontFamily: "'Courier New', monospace" }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1565c0' }}>"email"</div>
                <div style={{ fontSize: 14, color: '#666', margin: '4px 0' }}>:</div>
                <div style={{ fontSize: 16, color: '#388e3c' }}>"e@test.com"</div>
              </div>
            </div>
          )}

          {/* relink 箭头 */}
          {showRelink && phase < 3 && (
            <div
              style={{
                position: 'absolute',
                top: 200,
                left: 220,
                color: '#ff9800',
                fontSize: 14,
                fontWeight: 'bold',
              }}
            >
              email.next = name
            </div>
          )}

          {/* 箭头: name 到 city (在 relink 后) */}
          {showRelink && phase >= 3 && (
            <>
              <div
                style={{
                  position: 'absolute',
                  top: 140,
                  left: 160,
                  color: '#4caf50',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}
              >
                ↓
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: 220,
                  left: 220,
                  color: '#4caf50',
                  fontSize: 14,
                  fontWeight: 'bold',
                }}
              >
                email.next
              </div>
            </>
          )}
        </div>

        {/* 右侧: 步骤说明 */}
        <div style={{ flex: 1 }}>
          {phase === 0 && (
            <div style={{ padding: 20, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 8 }}>
              <h3 style={{ color: '#2196f3', marginTop: 0 }}>初始状态</h3>
              <p style={{ color: '#a0a0a0' }}>桶 2 包含一个节点: city → NULL</p>
              <p style={{ color: '#a0a0a0', marginTop: 16 }}>准备插入: "email" : "e@test.com"</p>
              <p style={{ color: '#666', fontSize: 14 }}>h("email") = 5 % 4 = 1... 不对，应该是 h("email") = 5 % 4 = 1</p>
              <p style={{ color: '#666', fontSize: 14 }}>等等，h("email") = 5 % 4 = 1，但桶 2 是 h("city") = 4 % 4 = 0</p>
              <p style={{ color: '#ff9800', marginTop: 8 }}>假设 h("email") = 2 (为了演示冲突)</p>
            </div>
          )}

          {phase === 1 && (
            <div style={{ padding: 20, background: 'rgba(255, 152, 0, 0.2)', borderRadius: 8 }}>
              <h3 style={{ color: '#ff9800', marginTop: 0 }}>步骤 1: 遍历链表</h3>
              <p style={{ color: 'white' }}>从头节点开始遍历，找到链尾 (NULL)</p>
              <ul style={{ color: '#a0a0a0', marginTop: 12 }}>
                <li>检查 city.next = NULL</li>
                <li>已到达链尾</li>
              </ul>
            </div>
          )}

          {phase === 2 && (
            <div style={{ padding: 20, background: 'rgba(255, 193, 7, 0.2)', borderRadius: 8 }}>
              <h3 style={{ color: '#ffc107', marginTop: 0 }}>步骤 2: 创建新节点</h3>
              <p style={{ color: 'white' }}>创建新节点 email</p>
              <p style={{ color: '#a0a0a0', marginTop: 12 }}>设置 email.next = name (当前头节点)</p>
              <p style={{ color: '#666', marginTop: 8 }}>(此时 name 还是 NULL，因为是空链)</p>
            </div>
          )}

          {phase === 3 && (
            <div style={{ padding: 20, background: 'rgba(76, 175, 80, 0.2)', borderRadius: 8 }}>
              <h3 style={{ color: '#4caf50', marginTop: 0 }}>步骤 3: 更新链表</h3>
              <p style={{ color: 'white' }}>将 name 添加到链表中</p>
              <p style={{ color: '#a0a0a0', marginTop: 12 }}>设置 name.next = city</p>
              <p style={{ color: '#a0a0a0', marginTop: 8 }}>设置 email.next = name</p>
            </div>
          )}

          {phase >= 4 && (
            <div style={{ padding: 20, background: 'rgba(76, 175, 80, 0.2)', borderRadius: 8 }}>
              <h3 style={{ color: '#4caf50', marginTop: 0 }}>完成!</h3>
              <p style={{ color: 'white' }}>最终链表:</p>
              <p style={{ color: '#ff9800', fontFamily: "'Courier New', monospace", fontSize: 18, marginTop: 8 }}>
                email → name → city → NULL
              </p>
              <p style={{ color: '#a0a0a0', marginTop: 16 }}>注意: 头插法是 O(1) 操作!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const ChainInsertionDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="链表演示 - 插入"
          subtitle="Head Insertion in Chain"
        />
      </Sequence>

      {/* 第二段: 插入动画 */}
      <Sequence from={60} durationInFrames={390}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <ChainInsertionAnimation />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default ChainInsertionDemo;

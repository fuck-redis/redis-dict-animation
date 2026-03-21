/**
 * 链表演示 - 遍历操作
 * 视频时长: 15秒 (450帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const TOTAL_FRAMES = 450;

function ChainTraversalAnimation() {
  const frame = useCurrentFrame();

  // 动画阶段
  // 0-60: 显示初始链表状态
  // 60-150: 从头开始遍历，检查第1个节点
  // 150-240: 检查第2个节点
  // 240-330: 检查第3个节点，找到目标
  // 330-450: 显示查找结果

  const phase = Math.floor(frame / 90);
  const currentIndex = Math.min(phase, 3);
  const found = phase >= 3;
  const notFound = false; // 用于演示未找到的情况

  // 链表数据
  const chain = [
    { key: 'email', value: 'e@test.com' },
    { key: 'name', value: 'Bob' },
    { key: 'city', value: 'NYC' },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 32 }}>链表演示 - 遍历查找</h2>

      <div style={{ display: 'flex', gap: 60 }}>
        {/* 左侧: 桶和链表 */}
        <div style={{ position: 'relative', width: 350, height: 420 }}>
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
            const isActive = currentIndex === index;
            const isPast = currentIndex > index;
            const isFound = found && index === 1; // 找的是 "name"

            return (
              <React.Fragment key={node.key}>
                {/* 节点 */}
                <div
                  style={{
                    position: 'absolute',
                    top: 80 + index * 80,
                    left: 80,
                    padding: '14px 18px',
                    background: isActive
                      ? 'rgba(255, 235, 59, 0.4)'
                      : isFound
                      ? 'rgba(76, 175, 80, 0.4)'
                      : isPast
                      ? 'rgba(255, 255, 255, 0.5)'
                      : 'rgba(255, 255, 255, 0.95)',
                    border: `3px solid ${isActive ? '#ffc107' : isFound ? '#4caf50' : isPast ? '#666' : '#2196f3'}`,
                    borderRadius: 8,
                    minWidth: 130,
                    transition: 'all 0.3s ease',
                    transform: `scale(${isActive ? 1.1 : 1})`,
                  }}
                >
                  <div style={{ textAlign: 'center', fontFamily: "'Courier New', monospace" }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: isFound ? '#2e7d32' : '#1565c0' }}>
                      "{node.key}"
                    </div>
                    <div style={{ fontSize: 14, color: '#666', margin: '4px 0' }}>:</div>
                    <div style={{ fontSize: 16, color: isFound ? '#2e7d32' : '#388e3c' }}>
                      "{node.value}"
                    </div>
                  </div>
                  {isActive && !found && (
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
                      检查中
                    </div>
                  )}
                  {isFound && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -30,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '4px 12px',
                        background: '#4caf50',
                        borderRadius: 12,
                        fontSize: 12,
                        color: '#fff',
                        fontWeight: 'bold',
                      }}
                    >
                      找到!
                    </div>
                  )}
                </div>

                {/* 箭头 */}
                {index < chain.length - 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 150 + index * 80,
                      left: 160,
                      color: isPast || found ? '#4caf50' : '#666',
                      fontSize: 18,
                      fontWeight: 'bold',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    ↓
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {/* NULL 结尾 */}
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
              opacity: found ? 1 : 0.5,
            }}
          >
            <div style={{ textAlign: 'center', fontFamily: "'Courier New', monospace", color: '#666' }}>
              NULL
            </div>
          </div>
        </div>

        {/* 右侧: 步骤说明 */}
        <div style={{ flex: 1 }}>
          {phase === 0 && (
            <div style={{ padding: 20, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 8 }}>
              <h3 style={{ color: '#2196f3', marginTop: 0 }}>查找目标: "name"</h3>
              <p style={{ color: '#a0a0a0', marginTop: 16 }}>从链表头部开始遍历</p>
              <p style={{ color: '#666', fontSize: 14, marginTop: 8 }}>从头节点 email 开始</p>
            </div>
          )}

          {phase === 1 && (
            <div style={{ padding: 20, background: 'rgba(255, 193, 7, 0.2)', borderRadius: 8 }}>
              <h3 style={{ color: '#ffc107', marginTop: 0 }}>检查节点 1/3</h3>
              <p style={{ color: 'white', fontFamily: "'Courier New', monospace", fontSize: 18 }}>
                检查: "email"
              </p>
              <p style={{ color: '#a0a0a0', marginTop: 12 }}>"email" ≠ "name"</p>
              <p style={{ color: '#666', marginTop: 8 }}>继续遍历...</p>
            </div>
          )}

          {phase === 2 && (
            <div style={{ padding: 20, background: 'rgba(255, 193, 7, 0.2)', borderRadius: 8 }}>
              <h3 style={{ color: '#ffc107', marginTop: 0 }}>检查节点 2/3</h3>
              <p style={{ color: 'white', fontFamily: "'Courier New', monospace", fontSize: 18 }}>
                检查: "name"
              </p>
              <p style={{ color: '#4caf50', marginTop: 12, fontWeight: 'bold' }}>"name" === "name" ✓</p>
              <p style={{ color: '#a0a0a0', marginTop: 8 }}>找到目标!</p>
            </div>
          )}

          {phase >= 3 && (
            <div style={{ padding: 20, background: 'rgba(76, 175, 80, 0.2)', borderRadius: 8 }}>
              <h3 style={{ color: '#4caf50', marginTop: 0 }}>查找成功!</h3>
              <p style={{ color: 'white', fontSize: 18 }}>
                找到: "name" → "Bob"
              </p>
              <div style={{ marginTop: 20, padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
                <h4 style={{ color: '#a0a0a0', marginTop: 0, marginBottom: 12 }}>性能分析</h4>
                <p style={{ color: '#a0a0a0' }}>
                  <span style={{ color: '#ff9800' }}>时间复杂度:</span> O(k)
                </p>
                <p style={{ color: '#666', fontSize: 14, marginTop: 4 }}>
                  其中 k 是从头到目标节点的链表长度
                </p>
                <p style={{ color: '#666', fontSize: 14, marginTop: 8 }}>
                  在本例中: k = 2 (遍历了 2 个节点)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 遍历路径可视化 */}
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
          gap: 8,
        }}
      >
        {chain.map((node, i) => (
          <React.Fragment key={node.key}>
            <div
              style={{
                padding: '8px 16px',
                background: currentIndex > i ? 'rgba(76, 175, 80, 0.3)' : currentIndex === i ? 'rgba(255, 193, 7, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                border: `2px solid ${currentIndex > i ? '#4caf50' : currentIndex === i ? '#ffc107' : '#666'}`,
                borderRadius: 6,
                color: 'white',
                fontFamily: "'Courier New', monospace",
                fontSize: 14,
              }}
            >
              {node.key}
            </div>
            {i < chain.length - 1 && (
              <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>→</div>
            )}
          </React.Fragment>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>→</div>
        <div
          style={{
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '2px dashed #666',
            borderRadius: 6,
            color: '#666',
            fontFamily: "'Courier New', monospace",
            fontSize: 14,
          }}
        >
          NULL
        </div>
      </div>
    </div>
  );
}

export const ChainTraversalDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="链表演示 - 遍历"
          subtitle="Chain Traversal"
        />
      </Sequence>

      {/* 第二段: 遍历动画 */}
      <Sequence from={60} durationInFrames={390}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <ChainTraversalAnimation />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default ChainTraversalDemo;

/**
 * TimeTravelFeature
 * 视频时长: 12秒 (360帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 360;

function TimeTravelDemo() {
  const frame = useCurrentFrame();

  const operations = [
    { step: 0, op: 'SET', key: 'name', value: 'Alice', icon: '+' },
    { step: 1, op: 'SET', key: 'age', value: '25', icon: '+' },
    { step: 2, op: 'SET', key: 'city', value: 'Beijing', icon: '+' },
    { step: 3, op: 'GET', key: 'name', value: 'Alice', icon: '?' },
    { step: 4, op: 'DEL', key: 'age', value: '', icon: '-' },
    { step: 5, op: 'SET', key: 'job', value: 'Engineer', icon: '+' },
  ];

  // 模拟时间旅行进度
  const travelPhase = Math.floor(frame / 60);
  const travelProgress = (frame % 60) / 60;

  // 当前选中的步骤
  const currentStep = travelPhase <= 5 ? travelPhase : 5;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', padding: 48 }}>
      <h2 style={{ color: 'white', marginBottom: 32, fontSize: 32 }}>
        时间旅行功能
      </h2>

      <div style={{ display: 'flex', gap: 48 }}>
        {/* 左侧: 操作历史时间线 */}
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#a0a0a0', marginBottom: 24, fontSize: 18 }}>
            操作历史
          </h3>

          <div style={{ position: 'relative' }}>
            {/* 时间线 */}
            <div
              style={{
                position: 'absolute',
                left: 19,
                top: 24,
                bottom: 24,
                width: 2,
                background: '#333',
              }}
            />

            {operations.map((op, index) => {
              const isActive = index === currentStep;
              const isPast = index < currentStep;

              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 16,
                    marginBottom: 20,
                    position: 'relative',
                    opacity: isPast ? 0.5 : 1,
                  }}
                >
                  {/* 步骤节点 */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: isActive ? '#e94560' : isPast ? '#4caf50' : '#333',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 14,
                      flexShrink: 0,
                      zIndex: 1,
                      transition: 'all 0.3s ease',
                      transform: isActive ? 'scale(1.2)' : 'scale(1)',
                    }}
                  >
                    {index}
                  </div>

                  {/* 操作信息 */}
                  <div
                    style={{
                      flex: 1,
                      padding: 16,
                      background: isActive
                        ? 'rgba(233, 69, 96, 0.2)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: `2px solid ${isActive ? '#e94560' : '#333'}`,
                      borderRadius: 12,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          padding: '2px 8px',
                          background:
                            op.op === 'SET'
                              ? 'rgba(76, 175, 80, 0.3)'
                              : op.op === 'GET'
                                ? 'rgba(33, 150, 243, 0.3)'
                                : 'rgba(244, 67, 54, 0.3)',
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 'bold',
                          color:
                            op.op === 'SET'
                              ? '#4caf50'
                              : op.op === 'GET'
                                ? '#2196f3'
                                : '#f44336',
                        }}
                      >
                        {op.op}
                      </span>
                      <span style={{ color: colors.keyColor, fontWeight: 600 }}>
                        {op.key}
                      </span>
                      {op.value && (
                        <>
                          <span style={{ color: '#666' }}>=</span>
                          <span style={{ color: colors.valueColor }}>
                            {op.value}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右侧: 当前状态快照 */}
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#a0a0a0', marginBottom: 24, fontSize: 18 }}>
            当前状态快照
          </h3>

          <div
            style={{
              padding: 24,
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 16,
              border: '2px solid #333',
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <span style={{ color: '#666', fontSize: 14 }}>步骤 </span>
              <span
                style={{ color: '#e94560', fontSize: 24, fontWeight: 'bold' }}
              >
                {currentStep}
              </span>
              <span style={{ color: '#666', fontSize: 14 }}> / 5</span>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 14,
                  color: '#a0a0a0',
                  marginBottom: 8,
                }}
              >
                哈希表状态
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  padding: 16,
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 8,
                }}
              >
                {['ht[0]', 'ht[1]'].map((table, ti) => (
                  <div
                    key={ti}
                    style={{
                      padding: '8px 16px',
                      background:
                        ti === 0 ? 'rgba(33, 150, 243, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                      border: `1px solid ${ti === 0 ? '#2196f3' : '#ff9800'}`,
                      borderRadius: 8,
                      color: ti === 0 ? '#2196f3' : '#ff9800',
                      fontWeight: 'bold',
                      fontSize: 14,
                    }}
                  >
                    {table}
                  </div>
                ))}
              </div>
            </div>

            {/* 桶状态预览 */}
            <div>
              <div
                style={{
                  fontSize: 14,
                  color: '#a0a0a0',
                  marginBottom: 8,
                }}
              >
                存储数据
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {currentStep >= 0 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '8px 12px',
                      background: 'rgba(76, 175, 80, 0.1)',
                      border: '1px solid #4caf50',
                      borderRadius: 8,
                    }}
                  >
                    <span style={{ color: colors.keyColor, fontWeight: 600 }}>
                      name
                    </span>
                    <span style={{ color: '#666' }}>=</span>
                    <span style={{ color: colors.valueColor }}>Alice</span>
                  </div>
                )}
                {currentStep >= 1 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '8px 12px',
                      background: 'rgba(76, 175, 80, 0.1)',
                      border: '1px solid #4caf50',
                      borderRadius: 8,
                    }}
                  >
                    <span style={{ color: colors.keyColor, fontWeight: 600 }}>
                      age
                    </span>
                    <span style={{ color: '#666' }}>=</span>
                    <span style={{ color: colors.valueColor }}>25</span>
                  </div>
                )}
                {currentStep >= 2 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '8px 12px',
                      background: 'rgba(76, 175, 80, 0.1)',
                      border: '1px solid #4caf50',
                      borderRadius: 8,
                    }}
                  >
                    <span style={{ color: colors.keyColor, fontWeight: 600 }}>
                      city
                    </span>
                    <span style={{ color: '#666' }}>=</span>
                    <span style={{ color: colors.valueColor }}>Beijing</span>
                  </div>
                )}
                {currentStep >= 4 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '8px 12px',
                      background: 'rgba(244, 67, 54, 0.1)',
                      border: '1px solid #f44336',
                      borderRadius: 8,
                      opacity: currentStep >= 4 && currentStep < 5 ? 0.5 : 1,
                    }}
                  >
                    <span style={{ color: colors.keyColor, fontWeight: 600 }}>
                      age
                    </span>
                    <span style={{ color: '#666' }}>=(已删除)</span>
                  </div>
                )}
                {currentStep >= 5 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '8px 12px',
                      background: 'rgba(76, 175, 80, 0.1)',
                      border: '1px solid #4caf50',
                      borderRadius: 8,
                    }}
                  >
                    <span style={{ color: colors.keyColor, fontWeight: 600 }}>
                      job
                    </span>
                    <span style={{ color: '#666' }}>=</span>
                    <span style={{ color: colors.valueColor }}>Engineer</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 导航控制 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              marginTop: 24,
            }}
          >
            {['◀', '▶'].map((arrow, i) => (
              <div
                key={i}
                style={{
                  width: 48,
                  height: 48,
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid #333',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 20,
                  cursor: 'pointer',
                }}
              >
                {arrow}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 进度条 */}
      <div
        style={{
          position: 'absolute',
          bottom: 48,
          left: 48,
          right: 48,
        }}
      >
        <div
          style={{
            height: 6,
            background: '#333',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(currentStep / 5) * 100}%`,
              background: 'linear-gradient(90deg, #e94560, #ff6b6b)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export const TimeTravelFeature: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="时间旅行"
          subtitle="探索操作历史的每一步"
        />
      </Sequence>

      {/* 第二段: 功能演示 */}
      <Sequence from={60} durationInFrames={300}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          }}
        >
          <TimeTravelDemo />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default TimeTravelFeature;

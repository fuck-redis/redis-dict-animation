/**
 * PlaygroundOverview
 * 视频时长: 15秒 (450帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 450;

function PlaygroundFeaturesDemo() {
  const frame = useCurrentFrame();

  const features = [
    {
      icon: '🎮',
      title: '交互式操作',
      description: '执行 SET/GET/DEL 等操作',
      color: '#2196f3',
    },
    {
      icon: '📊',
      title: '可视化展示',
      description: '实时观察哈希表状态变化',
      color: '#4caf50',
    },
    {
      icon: '⏪',
      title: '时间旅行',
      description: '回溯到任意历史步骤',
      color: '#ff9800',
    },
    {
      icon: '🔍',
      title: '代码调试',
      description: '查看对应源代码执行位置',
      color: '#9c27b0',
    },
  ];

  const activeIndex = Math.floor(frame / 30) % features.length;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', padding: 48 }}>
      <h2 style={{ color: 'white', marginBottom: 40, fontSize: 32 }}>
        Playground 功能特性
      </h2>

      <div style={{ display: 'flex', gap: 24, marginBottom: 48 }}>
        {features.map((feature, index) => {
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;

          return (
            <div
              key={index}
              style={{
                flex: 1,
                padding: 24,
                background: isActive
                  ? `rgba(${feature.color}, 0.2)`
                  : 'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${isActive ? feature.color : isPast ? '#666' : '#333'}`,
                borderRadius: 16,
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease',
                opacity: isPast ? 0.5 : 1,
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>{feature.icon}</div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 20,
                  color: isActive ? feature.color : '#ffffff',
                  fontWeight: 600,
                }}
              >
                {feature.title}
              </h3>
              <p style={{ margin: '8px 0 0 0', fontSize: 14, color: '#a0a0a0' }}>
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* 哈希表可视化预览 */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ color: '#a0a0a0', marginBottom: 16, fontSize: 18 }}>
          哈希表可视化
        </h3>
        <div
          style={{
            display: 'flex',
            gap: 12,
            padding: 20,
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 12,
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7].map((bucketIndex) => {
            const hasEntry = bucketIndex % 3 === 0;
            const entryCount = bucketIndex === 0 ? 2 : bucketIndex === 3 ? 1 : 0;

            return (
              <div
                key={bucketIndex}
                style={{
                  width: 60,
                  height: 80,
                  background: hasEntry
                    ? entryCount > 1
                      ? 'rgba(255, 152, 0, 0.3)'
                      : 'rgba(76, 175, 80, 0.3)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `2px solid ${
                    hasEntry
                      ? entryCount > 1
                        ? '#ff9800'
                        : '#4caf50'
                      : '#333'
                  }`,
                  borderRadius: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <span style={{ color: '#666', fontSize: 12 }}>{bucketIndex}</span>
                {hasEntry && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      marginTop: 4,
                    }}
                  >
                    {Array.from({ length: entryCount }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: 36,
                          height: 16,
                          background: colors.entryBg,
                          border: `1px solid ${colors.entryBorder}`,
                          borderRadius: 4,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 进度指示 */}
      <div
        style={{
          position: 'absolute',
          bottom: 48,
          left: 48,
          right: 48,
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {features.map((_, index) => (
          <div
            key={index}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: index === activeIndex ? '#2196f3' : '#333',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export const PlaygroundOverview: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="交互式 Playground"
          subtitle="实践页面功能概览"
        />
      </Sequence>

      {/* 第二段: 功能概览 */}
      <Sequence from={90} durationInFrames={360}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          }}
        >
          <PlaygroundFeaturesDemo />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default PlaygroundOverview;

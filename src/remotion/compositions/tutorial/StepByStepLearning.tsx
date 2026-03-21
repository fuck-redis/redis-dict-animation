/**
 * 分步学习过程
 * 视频时长: 12秒 (360帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 360;

// 学习阶段
const LEARNING_PHASES = [
  { phase: '01', title: '理论学习', desc: '理解核心概念和原理', icon: '📖', progress: 33 },
  { phase: '02', title: '可视化理解', desc: '通过动画深入理解', icon: '🎬', progress: 66 },
  { phase: '03', title: '实践应用', desc: '在实际场景中应用', icon: '💻', progress: 100 },
];

function StepCard({
  phase,
  title,
  desc,
  icon,
  progress,
  index,
  isActive,
}: {
  phase: string;
  title: string;
  desc: string;
  icon: string;
  progress: number;
  index: number;
  isActive: boolean;
}) {
  const frame = useCurrentFrame();

  const opacity = isActive ? 1 : 0.4;
  const scale = isActive ? 1.05 : 1;
  const borderColor = isActive ? '#e94560' : 'rgba(255, 255, 255, 0.1)';

  return (
    <div
      style={{
        background: isActive ? 'rgba(233, 69, 96, 0.1)' : 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        padding: '28px 32px',
        marginBottom: 20,
        border: `2px solid ${borderColor}`,
        opacity,
        transform: `scale(${scale})`,
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: isActive ? 'linear-gradient(135deg, #e94560, #ff6b6b)' : '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
          }}
        >
          {icon}
        </div>
        <div>
          <div
            style={{
              fontSize: 14,
              color: isActive ? '#e94560' : '#666',
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            阶段 {phase}
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: 24,
              color: '#ffffff',
              fontWeight: 600,
            }}
          >
            {title}
          </h3>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 18, color: '#a0a0a0' }}>{desc}</p>
      {isActive && (
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 14,
              color: '#666',
              marginBottom: 8,
            }}
          >
            <span>学习进度</span>
            <span>{progress}%</span>
          </div>
          <div
            style={{
              height: 8,
              background: '#333',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #e94560, #ff6b6b)',
                borderRadius: 4,
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressTimeline() {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
      {LEARNING_PHASES.map((phase, i) => {
        const isCompleted = frame >= (i + 1) * 80;
        const isCurrent = frame >= i * 80 && frame < (i + 1) * 80;

        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: isCompleted || isCurrent ? '#e94560' : '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 'bold',
                color: 'white',
                border: isCurrent ? '3px solid #ff6b6b' : 'none',
                boxShadow: isCurrent ? '0 0 20px rgba(233, 69, 96, 0.5)' : 'none',
              }}
            >
              {isCompleted ? '✓' : phase.phase}
            </div>
            {i < LEARNING_PHASES.length - 1 && (
              <div
                style={{
                  width: 100,
                  height: 4,
                  background: isCompleted ? '#e94560' : '#333',
                  margin: '0 10px',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export const StepByStepLearning: React.FC = () => {
  const frame = useCurrentFrame();

  // Determine which phase is active based on frame
  const activePhase = Math.min(Math.floor(frame / 80), 2);

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator title="分步学习过程" subtitle="循序渐进，掌握核心" />
      </Sequence>

      {/* 第二段: 学习阶段展示 */}
      <Sequence from={60} durationInFrames={300}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2
            style={{
              fontSize: 32,
              color: '#ffffff',
              margin: '0 0 24px 0',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            三阶段学习法
          </h2>

          {/* 时间线进度 */}
          <div style={{ marginBottom: 40 }}>
            <ProgressTimeline />
          </div>

          {/* 阶段卡片 */}
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            {LEARNING_PHASES.map((phase, i) => (
              <StepCard key={i} {...phase} index={i} isActive={i === activePhase} />
            ))}
          </div>

          {/* 当前阶段提示 */}
          <div
            style={{
              marginTop: 32,
              textAlign: 'center',
              fontSize: 18,
              color: '#e94560',
            }}
          >
            {frame < 80 && '开始理论学习阶段...'}
            {frame >= 80 && frame < 160 && '进入可视化理解阶段...'}
            {frame >= 160 && frame < 240 && '开始实践应用阶段...'}
            {frame >= 240 && '恭喜完成所有学习阶段!'}
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default StepByStepLearning;

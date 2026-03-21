/**
 * 教程概览
 * 视频时长: 15秒 (450帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 450;

// 学习路径步骤
const LEARNING_STEPS = [
  { icon: '1', title: '基础概念', desc: '理解 Dict 数据结构', duration: '5分钟' },
  { icon: '2', title: '哈希函数', desc: '了解哈希计算原理', duration: '8分钟' },
  { icon: '3', title: 'Rehash 机制', desc: '掌握扩容和缩容', duration: '10分钟' },
  { icon: '4', title: '迭代器', desc: '安全遍历字典', duration: '7分钟' },
  { icon: '5', title: '性能优化', desc: '调优和最佳实践', duration: '6分钟' },
];

function LearningPathItem({
  icon,
  title,
  desc,
  duration,
  index,
}: {
  icon: string;
  title: string;
  desc: string;
  duration: string;
  index: number;
}) {
  const frame = useCurrentFrame();
  const delay = index * 40;

  const opacity = interpolate(Math.max(0, frame - delay), [0, 30], [0, 1], { extrapolateLeft: 'clamp' });
  const translateX = interpolate(Math.max(0, frame - delay), [0, 30], [-50, 0], { extrapolateLeft: 'clamp' });
  const scale = interpolate(Math.max(0, frame - delay), [0, 20], [0.8, 1], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: '20px 28px',
        marginBottom: 16,
        opacity,
        transform: `translateX(${translateX}px) scale(${scale})`,
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e94560, #ff6b6b)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          fontWeight: 'bold',
          color: 'white',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: 22, color: '#ffffff', fontWeight: 600 }}>{title}</h3>
        <p style={{ margin: '4px 0 0 0', fontSize: 16, color: '#a0a0a0' }}>{desc}</p>
      </div>
      <div
        style={{
          background: 'rgba(76, 175, 80, 0.2)',
          border: '1px solid #4caf50',
          borderRadius: 20,
          padding: '6px 16px',
          fontSize: 14,
          color: '#4caf50',
        }}
      >
        {duration}
      </div>
    </div>
  );
}

function OverviewDiagram() {
  const frame = useCurrentFrame();

  // 中心圆环动画
  const centerScale = interpolate(frame, [0, 30, 60], [0.5, 1.2, 1], { extrapolateLeft: 'clamp' });
  const centerOpacity = interpolate(frame, [0, 20, 30], [0, 1, 1], { extrapolateLeft: 'clamp' });

  // 外圈旋转
  const outerRotate = interpolate(frame, [0, 180], [0, 360], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* 外圈 */}
      <div
        style={{
          width: 400,
          height: 400,
          borderRadius: '50%',
          border: '3px dashed rgba(233, 69, 96, 0.3)',
          position: 'absolute',
          top: -100,
          left: -100,
          transform: `rotate(${outerRotate}deg)`,
        }}
      />

      {/* 中心 */}
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          border: '4px solid #e94560',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          opacity: centerOpacity,
          transform: `scale(${centerScale})`,
          boxShadow: '0 0 60px rgba(233, 69, 96, 0.4)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>📚</div>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#e94560' }}>学习路径</div>
        </div>
      </div>

      {/* 步骤节点 */}
      {LEARNING_STEPS.map((step, i) => {
        const angle = (i / LEARNING_STEPS.length) * Math.PI * 2 - Math.PI / 2;
        const radius = 220;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const opacity = interpolate(frame, [60 + i * 30, 90 + i * 30], [0, 1], { extrapolateLeft: 'clamp' });
        const scale = interpolate(frame, [60 + i * 30, 90 + i * 30], [0.5, 1], { extrapolateLeft: 'clamp' });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
              opacity,
              scale: String(scale),
            }}
          >
            <div
              style={{
                background: 'rgba(33, 150, 243, 0.2)',
                border: '2px solid #2196f3',
                borderRadius: 12,
                padding: '10px 16px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              <div style={{ fontSize: 16, color: 'white', fontWeight: 600 }}>{step.title}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const TutorialOverview: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator title="教程概览" subtitle="完整的学习路径" />
      </Sequence>

      {/* 第二段: 学习路径列表 */}
      <Sequence from={60} durationInFrames={210}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2
            style={{
              fontSize: 36,
              color: '#ffffff',
              margin: '0 0 32px 0',
              fontWeight: 600,
            }}
          >
            完整学习路径
          </h2>
          <div style={{ maxWidth: 900 }}>
            {LEARNING_STEPS.map((step, i) => (
              <LearningPathItem key={i} {...step} index={i} />
            ))}
          </div>
          <div
            style={{
              marginTop: 32,
              fontSize: 20,
              color: '#a0a0a0',
              textAlign: 'center',
            }}
          >
            总计学习时间: 约 36 分钟
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 学习路径图 */}
      <Sequence from={270} durationInFrames={180}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
          }}
        >
          <OverviewDiagram />
          <div
            style={{
              position: 'absolute',
              bottom: 48,
              left: 48,
              fontSize: 20,
              color: '#a0a0a0',
            }}
          >
            从基础到高级，系统掌握 Redis Dict
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default TutorialOverview;

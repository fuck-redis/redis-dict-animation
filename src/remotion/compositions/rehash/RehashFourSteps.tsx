/**
 * Rehash 四步工作流
 * 视频时长: 20秒 (600帧 @ 30fps)
 * 展示 Rehash 的 4 步工作流程: 触发 -> 创建 -> 迁移 -> 完成
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const TOTAL_FRAMES = 600; // 20秒

// 步骤配置
const STEPS = [
  {
    number: 1,
    title: '检查触发条件',
    description: '负载因子 > 1.0 时触发扩展',
    detail: '当 hash 表中 entry 数量超过 bucket 数量时，需要扩展容量',
    color: '#ff9800', // orange
    icon: '🔍',
  },
  {
    number: 2,
    title: '创建新哈希表',
    description: '分配 ht[1]，大小为 ht[0] 的 2 倍',
    detail: '为 ht[1] 分配新的内存空间，准备接收迁移数据',
    color: '#2196f3', // blue
    icon: '📋',
  },
  {
    number: 3,
    title: '渐进式迁移',
    description: '每次操作迁移 1 个桶，分散到多次请求',
    detail: 'rehashidx 记录当前迁移位置，每次增量和删除时顺带迁移',
    color: '#4caf50', // green
    icon: '🔄',
  },
  {
    number: 4,
    title: '完成并切换',
    description: '释放 ht[0]，ht[1] 变为新的 ht[0]',
    detail: '旧表内存释放，新表接管，一切恢复如常',
    color: '#e94560', // red/pink
    icon: '✅',
  },
];

interface StepCardProps {
  step: typeof STEPS[0];
  isActive: boolean;
  progress: number;
  index: number;
}

function StepCard({ step, isActive, progress, index }: StepCardProps) {
  const opacity = isActive ? 1 : 0.4;
  const scale = isActive ? 1.02 : 1;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 20,
        padding: 24,
        background: isActive ? `rgba(${hexToRgb(step.color)}, 0.15)` : 'rgba(255, 255, 255, 0.03)',
        border: `3px solid ${isActive ? step.color : '#333'}`,
        borderRadius: 16,
        marginBottom: 16,
        transform: `scale(${scale})`,
        opacity: opacity,
        transition: 'all 0.4s ease',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          background: isActive ? step.color : '#444',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          flexShrink: 0,
          boxShadow: isActive ? `0 0 20px ${step.color}50` : 'none',
          transition: 'all 0.4s ease',
        }}
      >
        {step.number}
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: 24, color: isActive ? step.color : '#888' }}>
          {step.title}
        </h3>
        <p style={{ margin: '8px 0 0 0', fontSize: 16, color: isActive ? '#ccc' : '#666' }}>
          {step.description}
        </p>
        {isActive && (
          <p
            style={{
              margin: '12px 0 0 0',
              fontSize: 14,
              color: '#888',
              fontStyle: 'italic',
            }}
          >
            {step.detail}
          </p>
        )}
      </div>
      {isActive && (
        <div
          style={{
            fontSize: 32,
            animation: 'pulse 1s infinite',
          }}
        >
          {step.icon}
        </div>
      )}
    </div>
  );
}

// 辅助函数：将 hex 颜色转为 rgb 字符串
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '255,255,255';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

// 双表示意图
function DualTableDiagram() {
  const frame = useCurrentFrame();
  const activeStep = Math.floor(frame / 120) % 4;
  const stepProgress = (frame % 120) / 120;

  const migratedCount = activeStep >= 2 ? Math.min(8, Math.floor(stepProgress * 8) + (activeStep - 2) * 4) : 0;

  return (
    <div style={{ padding: 32, background: 'rgba(255,255,255,0.03)', borderRadius: 16, marginTop: 32 }}>
      <h3 style={{ color: '#fff', marginBottom: 24 }}>迁移进度示意</h3>
      <div style={{ display: 'flex', gap: 32 }}>
        {/* ht[0] */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#2196f3', marginBottom: 12 }}>
            ht[0] (源表)
          </div>
          <div
            style={{
              padding: 16,
              background: 'rgba(33, 150, 243, 0.1)',
              border: '2px solid #2196f3',
              borderRadius: 12,
              minHeight: 180,
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  marginBottom: 6,
                  background: i < migratedCount ? '#333' : 'rgba(255,255,255,0.08)',
                  borderRadius: 4,
                  opacity: i < migratedCount ? 0.4 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ color: '#2196f3', fontWeight: 600, fontSize: 13 }}>桶 {i}</span>
                <span style={{ color: '#888', fontSize: 12 }}>
                  {i < migratedCount ? '已迁' : '待迁'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 箭头 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <div style={{ fontSize: 36, color: '#4caf50' }}>→</div>
          <div
            style={{
              padding: '4px 12px',
              background: 'rgba(76, 175, 80, 0.2)',
              borderRadius: 4,
              fontSize: 11,
              color: '#4caf50',
            }}
          >
            每次1桶
          </div>
        </div>

        {/* ht[1] */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#ff9800', marginBottom: 12 }}>
            ht[1] (目标表)
          </div>
          <div
            style={{
              padding: 16,
              background: 'rgba(255, 152, 0, 0.1)',
              border: `2px solid ${activeStep >= 1 ? '#ff9800' : '#444'}`,
              borderRadius: 12,
              minHeight: 180,
              opacity: activeStep >= 1 ? 1 : 0.5,
              transition: 'opacity 0.3s ease',
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  marginBottom: 6,
                  background:
                    i < migratedCount ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255,255,255,0.05)',
                  borderRadius: 4,
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ color: '#ff9800', fontWeight: 600, fontSize: 13 }}>桶 {i}</span>
                <span style={{ color: '#888', fontSize: 12 }}>
                  {i < migratedCount ? '已收' : '空'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 进度条 */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: '#a0a0a0' }}>总进度</span>
          <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
            {Math.min(100, Math.floor((migratedCount / 8) * 100))}%
          </span>
        </div>
        <div
          style={{
            height: 10,
            background: '#333',
            borderRadius: 5,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.min(100, (migratedCount / 8) * 100)}%`,
              background: 'linear-gradient(90deg, #2196f3, #4caf50)',
              borderRadius: 5,
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export const RehashFourSteps: React.FC = () => {
  const frame = useCurrentFrame();
  const activeStep = Math.floor(frame / 120) % 4;
  const stepProgress = (frame % 120) / 120;

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="Rehash 工作流"
          subtitle="分四步走的优雅设计"
        />
      </Sequence>

      {/* 第二段: 四步流程 */}
      <Sequence from={90} durationInFrames={510}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: 'white', marginBottom: 32 }}>Rehash 四步流程</h2>

          <div style={{ display: 'flex', gap: 32 }}>
            {/* 左侧: 步骤列表 */}
            <div style={{ flex: 1 }}>
              {STEPS.map((step, index) => (
                <StepCard
                  key={step.number}
                  step={step}
                  isActive={index === activeStep}
                  progress={stepProgress}
                  index={index}
                />
              ))}
            </div>

            {/* 右侧: 示意图 */}
            <div style={{ flex: 1 }}>
              <DualTableDiagram />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default RehashFourSteps;

/**
 * Rehash 性能维度分析
 * 视频时长: 15秒 (450帧 @ 30fps)
 * 展示三个维度: 时间成本、空间成本、用户体验
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const TOTAL_FRAMES = 450; // 15秒

// 三个维度配置
const DIMENSIONS = [
  {
    id: 'time',
    title: '时间成本',
    subtitle: 'Time Cost',
    icon: '⏱️',
    color: '#4caf50', // green - good
    keyMetric: 'O(1)',
    keyMetricLabel: '每次操作复杂度',
    description: '每次操作只迁移 1 个桶，时间复杂度为 O(1)',
    details: [
      { label: '单次迁移', value: '0.01-0.05ms', status: 'good' },
      { label: '100万键迁移', value: '~2-5秒', status: 'good' },
      { label: '分摊到', value: '数千次请求', status: 'good' },
    ],
    visualType: 'counter' as const,
  },
  {
    id: 'space',
    title: '空间成本',
    subtitle: 'Space Cost',
    icon: '💾',
    color: '#ff9800', // orange - warning
    keyMetric: '2x',
    keyMetricLabel: '内存使用峰值',
    description: '迁移期间需要同时维护两个哈希表',
    details: [
      { label: 'ht[0] 原始大小', value: '1x', status: 'neutral' },
      { label: 'ht[1] 新分配', value: '1x', status: 'warning' },
      { label: '峰值内存', value: '2x', status: 'warning' },
    ],
    visualType: 'bars' as const,
  },
  {
    id: 'impact',
    title: '用户体验',
    subtitle: 'User Impact',
    icon: '👤',
    color: '#2196f3', // blue - good
    keyMetric: '0',
    keyMetricLabel: '用户感知延迟',
    description: '渐进式设计确保用户完全无感知',
    details: [
      { label: '请求阻塞', value: '0ms', status: 'good' },
      { label: '吞吐量变化', value: '几乎无影响', status: 'good' },
      { label: '服务可用性', value: '100%', status: 'good' },
    ],
    visualType: 'gauge' as const,
  },
];

interface MetricBarProps {
  label: string;
  value: string;
  percentage: number;
  status: 'good' | 'warning' | 'bad' | 'neutral';
  isActive: boolean;
}

function MetricBar({ label, value, percentage, status, isActive }: MetricBarProps) {
  const colors = {
    good: '#4caf50',
    warning: '#ff9800',
    bad: '#e94560',
    neutral: '#2196f3',
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ color: isActive ? '#fff' : '#888', fontSize: 14 }}>{label}</span>
        <span style={{ color: colors[status], fontWeight: 'bold', fontSize: 14 }}>{value}</span>
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
            width: `${percentage}%`,
            background: colors[status],
            borderRadius: 4,
            transition: 'width 0.5s ease',
          }}
        />
      </div>
    </div>
  );
}

interface DimensionCardProps {
  dimension: typeof DIMENSIONS[0];
  isActive: boolean;
  index: number;
}

function DimensionCard({ dimension, isActive, index }: DimensionCardProps) {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 60], [0, 1], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        flex: 1,
        padding: 24,
        background: isActive ? `rgba(${hexToRgb(dimension.color)}, 0.1)` : 'rgba(255,255,255,0.03)',
        border: `3px solid ${isActive ? dimension.color : '#333'}`,
        borderRadius: 16,
        transition: 'all 0.4s ease',
        opacity: isActive ? 1 : 0.6,
        transform: isActive ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {/* 头部 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <span style={{ fontSize: 40 }}>{dimension.icon}</span>
        <div>
          <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase' }}>
            {dimension.subtitle}
          </div>
          <div style={{ fontSize: 22, fontWeight: 'bold', color: dimension.color }}>
            {dimension.title}
          </div>
        </div>
      </div>

      {/* 关键指标 */}
      <div
        style={{
          textAlign: 'center',
          padding: 20,
          background: 'rgba(0,0,0,0.2)',
          borderRadius: 12,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 'bold',
            color: dimension.color,
            textShadow: isActive ? `0 0 30px ${dimension.color}50` : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          {dimension.keyMetric}
        </div>
        <div style={{ fontSize: 14, color: '#888', marginTop: 4 }}>
          {dimension.keyMetricLabel}
        </div>
      </div>

      {/* 描述 */}
      <p style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 20, lineHeight: 1.5 }}>
        {dimension.description}
      </p>

      {/* 详情指标 */}
      <div>
        {dimension.details.map((detail, i) => (
          <MetricBar
            key={i}
            label={detail.label}
            value={detail.value}
            percentage={(i + 1) * 25 * progress}
            status={detail.status as 'good' | 'warning' | 'bad' | 'neutral'}
            isActive={isActive}
          />
        ))}
      </div>
    </div>
  );
}

// 时间线组件
function TimeCostTimeline() {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 450], [0, 1], { extrapolateLeft: 'clamp' });

  const totalOperations = 1000000;
  const migratedOps = Math.floor(progress * totalOperations);
  const timePerOp = 0.02; // ms
  const totalTime = (totalOperations * timePerOp) / 1000; // seconds

  return (
    <div
      style={{
        marginTop: 32,
        padding: 24,
        background: 'rgba(76, 175, 80, 0.1)',
        border: '2px solid #4caf50',
        borderRadius: 12,
      }}
    >
      <h4 style={{ color: '#4caf50', marginBottom: 16 }}>100万键迁移时间线</h4>

      {/* 时间轴 */}
      <div style={{ position: 'relative', height: 80, marginBottom: 16 }}>
        {/* 背景线 */}
        <div
          style={{
            position: 'absolute',
            top: 30,
            left: 0,
            right: 0,
            height: 6,
            background: '#333',
            borderRadius: 3,
          }}
        />

        {/* 进度 */}
        <div
          style={{
            position: 'absolute',
            top: 30,
            left: 0,
            width: `${progress * 100}%`,
            height: 6,
            background: 'linear-gradient(90deg, #2196f3, #4caf50)',
            borderRadius: 3,
            transition: 'width 0.1s linear',
          }}
        />

        {/* 起点 */}
        <div style={{ position: 'absolute', top: 0, left: 0, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: '#666' }}>开始</div>
          <div
            style={{
              width: 16,
              height: 16,
              background: '#2196f3',
              borderRadius: '50%',
              margin: '4px auto',
            }}
          />
          <div style={{ fontSize: 10, color: '#a0a0a0' }}>0s</div>
        </div>

        {/* 当前点 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: `${progress * 100}%`,
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 10, color: '#4caf50' }}>当前</div>
          <div
            style={{
              width: 20,
              height: 20,
              background: '#4caf50',
              borderRadius: '50%',
              margin: '2px auto',
              border: '3px solid #1a1a2e',
              boxShadow: '0 0 10px rgba(76, 175, 80, 0.5)',
            }}
          />
          <div style={{ fontSize: 10, color: '#4caf50', fontWeight: 'bold' }}>
            {totalTime.toFixed(1)}s
          </div>
        </div>

        {/* 终点 */}
        <div style={{ position: 'absolute', top: 0, right: 0, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: '#666' }}>完成</div>
          <div
            style={{
              width: 16,
              height: 16,
              background: '#e94560',
              borderRadius: '50%',
              margin: '4px auto',
            }}
          />
          <div style={{ fontSize: 10, color: '#a0a0a0' }}>~4s</div>
        </div>
      </div>

      {/* 统计 */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <span style={{ color: '#888', fontSize: 12 }}>已迁移: </span>
          <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
            {migratedOps.toLocaleString()} / {totalOperations.toLocaleString()} 操作
          </span>
        </div>
        <div>
          <span style={{ color: '#888', fontSize: 12 }}>速率: </span>
          <span style={{ color: '#2196f3', fontWeight: 'bold' }}>50,000 ops/sec</span>
        </div>
      </div>
    </div>
  );
}

// 空间成本可视化
function SpaceCostVisualization() {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 450], [0, 1], { extrapolateLeft: 'clamp' });

  const ht0Height = 120 * (1 - progress * 0.3);
  const ht1Height = 120 * progress;

  return (
    <div
      style={{
        marginTop: 32,
        padding: 24,
        background: 'rgba(255, 152, 0, 0.1)',
        border: '2px solid #ff9800',
        borderRadius: 12,
      }}
    >
      <h4 style={{ color: '#ff9800', marginBottom: 16 }}>内存使用变化</h4>

      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end', height: 150 }}>
        {/* ht[0] */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#2196f3', marginBottom: 8 }}>ht[0]</div>
          <div
            style={{
              width: 80,
              height: ht0Height,
              background: 'rgba(33, 150, 243, 0.5)',
              borderRadius: '8px 8px 0 0',
              margin: '0 auto',
              transition: 'height 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 12,
            }}
          >
            {Math.floor(ht0Height)}px
          </div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>1x</div>
        </div>

        {/* + */}
        <div style={{ fontSize: 32, color: '#666', paddingBottom: 20 }}>+</div>

        {/* ht[1] */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#ff9800', marginBottom: 8 }}>ht[1]</div>
          <div
            style={{
              width: 80,
              height: ht1Height,
              background: 'rgba(255, 152, 0, 0.5)',
              borderRadius: '8px 8px 0 0',
              margin: '0 auto',
              transition: 'height 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 12,
            }}
          >
            {Math.floor(ht1Height)}px
          </div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>0 → 1x</div>
        </div>

        {/* = */}
        <div style={{ fontSize: 32, color: '#666', paddingBottom: 20 }}>=</div>

        {/* Total */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#4caf50', marginBottom: 8 }}>Total</div>
          <div
            style={{
              width: 80,
              height: 150,
              background: 'rgba(76, 175, 80, 0.3)',
              border: '2px solid #4caf50',
              borderRadius: '8px 8px 0 0',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4caf50',
              fontSize: 18,
              fontWeight: 'bold',
            }}
          >
            2x
          </div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>峰值</div>
        </div>
      </div>
    </div>
  );
}

// 用户影响仪表盘
function UserImpactGauge() {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 450], [0, 1], { extrapolateLeft: 'clamp' });

  // 0-100 评分，100 是最好
  const score = 100 - progress * 0; // 保持 100

  return (
    <div
      style={{
        marginTop: 32,
        padding: 24,
        background: 'rgba(33, 150, 243, 0.1)',
        border: '2px solid #2196f3',
        borderRadius: 12,
      }}
    >
      <h4 style={{ color: '#2196f3', marginBottom: 16 }}>用户体验影响</h4>

      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        {/* 仪表盘 */}
        <div style={{ position: 'relative', width: 120, height: 60 }}>
          {/* 半圆背景 */}
          <div
            style={{
              position: 'absolute',
              width: 120,
              height: 60,
              borderRadius: '60px 60px 0 0',
              background: '#333',
              overflow: 'hidden',
            }}
          >
            {/* 绿色区域 */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: 120,
                height: 60,
                background: 'linear-gradient(90deg, #4caf50, #8bc34a)',
                clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 0)',
              }}
            />
          </div>

          {/* 指针 */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              width: 4,
              height: 50,
              background: '#fff',
              transformOrigin: 'bottom center',
              transform: `translateX(-50%) rotate(${-90 + (score / 100) * 180}deg)`,
              transition: 'transform 0.5s ease',
              borderRadius: 2,
            }}
          />

          {/* 中心圆 */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 16,
              height: 16,
              background: '#fff',
              borderRadius: '50%',
            }}
          />
        </div>

        {/* 评分 */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, fontWeight: 'bold', color: '#4caf50' }}>
            {score}
          </div>
          <div style={{ fontSize: 14, color: '#888' }}>/ 100</div>
        </div>

        {/* 说明 */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, color: '#4caf50', fontWeight: 'bold', marginBottom: 8 }}>
            无感知
          </div>
          <ul style={{ margin: 0, paddingLeft: 16, color: '#a0a0a0', fontSize: 13 }}>
            <li>用户请求延迟: 不受影响</li>
            <li>服务可用性: 100%</li>
            <li>吞吐量: 几乎不变</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// 辅助函数
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '255,255,255';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

export const RehashPerformanceDimensions: React.FC = () => {
  const frame = useCurrentFrame();
  const activeDimension = Math.floor(frame / 120) % 3;

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="性能维度分析"
          subtitle="时间、空间、体验的权衡"
        />
      </Sequence>

      {/* 第二段: 三维度展示 */}
      <Sequence from={90} durationInFrames={360}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: 'white', marginBottom: 32 }}>Rehash 的三个维度</h2>

          {/* 维度卡片 */}
          <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
            {DIMENSIONS.map((dim, index) => (
              <DimensionCard
                key={dim.id}
                dimension={dim}
                isActive={index === activeDimension}
                index={index}
              />
            ))}
          </div>

          {/* 动态可视化 */}
          <div style={{ display: 'flex', gap: 24 }}>
            {/* 时间成本 */}
            <div style={{ flex: 1 }}>
              {activeDimension === 0 && <TimeCostTimeline />}
            </div>

            {/* 空间成本 */}
            <div style={{ flex: 1 }}>
              {activeDimension === 1 && <SpaceCostVisualization />}
            </div>

            {/* 用户影响 */}
            <div style={{ flex: 1 }}>
              {activeDimension === 2 && <UserImpactGauge />}
            </div>
          </div>

          {/* 底部总结 */}
          <div
            style={{
              marginTop: 32,
              padding: 20,
              background: 'rgba(76, 175, 80, 0.1)',
              border: '2px solid #4caf50',
              borderRadius: 12,
              display: 'flex',
              justifyContent: 'space-around',
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#4caf50' }}>O(1)</div>
              <div style={{ fontSize: 12, color: '#888' }}>每次操作成本</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff9800' }}>2x</div>
              <div style={{ fontSize: 12, color: '#888' }}>峰值内存</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#2196f3' }}>0</div>
              <div style={{ fontSize: 12, color: '#888' }}>用户感知延迟</div>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default RehashPerformanceDimensions;

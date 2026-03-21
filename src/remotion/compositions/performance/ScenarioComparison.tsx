/**
 * 场景对比演示
 * 视频时长: 20秒 (600帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const FPS = 30;
const TOTAL_FRAMES = 600; // 20秒

const SCENARIOS = [
  {
    name: 'Low Load',
    range: 'LF < 0.5',
    color: '#4caf50',
    status: '优秀',
    metrics: {
      throughput: 125000,
      latency: 0.2,
      collision: 8,
      cpu: 15,
    },
  },
  {
    name: 'Medium Load',
    range: 'LF 0.5-0.75',
    color: '#2196f3',
    status: '良好',
    metrics: {
      throughput: 110000,
      latency: 0.35,
      collision: 15,
      cpu: 25,
    },
  },
  {
    name: 'High Load',
    range: 'LF 0.75-1.0',
    color: '#ff9800',
    status: '警告',
    metrics: {
      throughput: 85000,
      latency: 0.8,
      collision: 28,
      cpu: 45,
    },
  },
  {
    name: 'Overload',
    range: 'LF > 1.0',
    color: '#f44336',
    status: '危险',
    metrics: {
      throughput: 45000,
      latency: 2.5,
      collision: 55,
      cpu: 80,
    },
  },
];

function ScenarioCard({ scenario, index }: { scenario: typeof SCENARIOS[0]; index: number }) {
  const frame = useCurrentFrame();
  const delay = index * 50;
  const opacity = interpolate(Math.max(0, frame - delay), [0, 25], [0, 1], { extrapolateLeft: 'clamp' });
  const translateY = interpolate(Math.max(0, frame - delay), [0, 25], [20, 0], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 24,
        opacity,
        transform: `translateY(${translateY}px)`,
        borderLeft: `4px solid ${scenario.color}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 24, color: scenario.color }}>{scenario.name}</h3>
          <div style={{ fontSize: 16, color: '#a0a0a0', marginTop: 4 }}>{scenario.range}</div>
        </div>
        <div
          style={{
            padding: '8px 16px',
            background: scenario.color,
            borderRadius: 20,
            fontSize: 14,
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          {scenario.status}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        <MetricBar label="吞吐量" value={scenario.metrics.throughput} maxValue={150000} unit="ops/s" color={scenario.color} />
        <MetricBar label="延迟" value={scenario.metrics.latency} maxValue={5} unit="ms" color={scenario.color} isLatency />
        <MetricBar label="冲突率" value={scenario.metrics.collision} maxValue={100} unit="%" color={scenario.color} />
        <MetricBar label="CPU" value={scenario.metrics.cpu} maxValue={100} unit="%" color={scenario.color} />
      </div>
    </div>
  );
}

function MetricBar({ label, value, maxValue, unit, color, isLatency = false }: {
  label: string;
  value: number;
  maxValue: number;
  unit: string;
  color: string;
  isLatency?: boolean;
}) {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 60], [0, value], { extrapolateLeft: 'clamp' });
  const displayValue = isLatency ? progress.toFixed(2) : Math.round(progress).toLocaleString();
  const heightPercent = (progress / maxValue) * 100;

  return (
    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 12, borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 14, color: '#a0a0a0' }}>{label}</span>
        <span style={{ fontSize: 14, color, fontWeight: 'bold' }}>{displayValue} {unit}</span>
      </div>
      <div style={{ height: 6, background: '#2a2a4a', borderRadius: 3, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${Math.min(100, heightPercent)}%`,
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  );
}

function ComparisonChart() {
  const frame = useCurrentFrame();
  const barWidth = interpolate(frame, [0, 60], [0, 100], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 24,
        marginTop: 24,
      }}
    >
      <h3 style={{ color: 'white', margin: '0 0 24px 0', fontSize: 20 }}>性能对比</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, height: 200 }}>
        {SCENARIOS.map((scenario, i) => {
          const delay = i * 40;
          const heightPercent = interpolate(Math.max(0, frame - delay), [0, 30], [0, scenario.metrics.throughput / 150000 * 100], { extrapolateLeft: 'clamp' });

          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: `${barWidth}%`,
                  maxWidth: 80,
                  height: `${heightPercent}%`,
                  background: `linear-gradient(180deg, ${scenario.color} 0%, ${scenario.color}66 100%)`,
                  borderRadius: '4px 4px 0 0',
                }}
              />
              <div style={{ marginTop: 12, fontSize: 16, color: scenario.color, fontWeight: 'bold' }}>
                {(scenario.metrics.throughput / 1000).toFixed(0)}K
              </div>
              <div style={{ fontSize: 12, color: '#a0a0a0' }}>{scenario.name}</div>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#666' }}>吞吐量对比 (ops/sec)</div>
    </div>
  );
}

function LatencyHeatmap() {
  const frame = useCurrentFrame();
  const gridOpacity = interpolate(frame, [0, 60], [0, 1], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 24,
        marginTop: 24,
        opacity: gridOpacity,
      }}
    >
      <h3 style={{ color: 'white', margin: '0 0 24px 0', fontSize: 20 }}>延迟分布热力图</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {SCENARIOS.map((scenario, i) => (
          <div
            key={i}
            style={{
              padding: 16,
              background: `${scenario.color}33`,
              borderRadius: 8,
              textAlign: 'center',
              border: `2px solid ${scenario.color}`,
            }}
          >
            <div style={{ fontSize: 12, color: '#a0a0a0' }}>{scenario.name}</div>
            <div style={{ fontSize: 24, color: scenario.color, fontWeight: 'bold', marginTop: 8 }}>
              {scenario.metrics.latency}ms
            </div>
            <div style={{ fontSize: 12, color: '#666' }}>p99 延迟</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const ScenarioComparison: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="场景对比"
          subtitle="不同负载下的性能差异"
        />
      </Sequence>

      {/* 第二段: 场景介绍 */}
      <Sequence from={90} durationInFrames={150}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ fontSize: 36, color: '#e94560', margin: '0 0 32px 0' }}>负载场景分类</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {SCENARIOS.map((scenario, i) => (
              <div
                key={i}
                style={{
                  padding: 20,
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 12,
                  borderTop: `4px solid ${scenario.color}`,
                }}
              >
                <h3 style={{ margin: 0, fontSize: 18, color: scenario.color }}>{scenario.name}</h3>
                <div style={{ fontSize: 14, color: '#a0a0a0', margin: '8px 0' }}>{scenario.range}</div>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    background: `${scenario.color}33`,
                    borderRadius: 12,
                    fontSize: 12,
                    color: scenario.color,
                    fontWeight: 'bold',
                  }}
                >
                  {scenario.status}
                </div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 详细指标对比 */}
      <Sequence from={240} durationInFrames={360}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ fontSize: 32, color: 'white', margin: '0 0 24px 0' }}>性能指标对比</h2>
          {SCENARIOS.map((scenario, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <ScenarioCard scenario={scenario} index={i} />
            </div>
          ))}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default ScenarioComparison;

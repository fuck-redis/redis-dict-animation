/**
 * Scenario Comparison Bars
 * 视频时长: 15秒 (450帧 @ 30fps)
 * 动画水平条形图对比4个场景的性能
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const TOTAL_FRAMES = 450; // 15秒

const SCENARIOS = [
  {
    name: 'Low Load',
    subtitle: 'LF < 0.5',
    color: '#4caf50',
    performance: 125,
    latency: 0.2,
    memory: 32,
    efficiency: 98,
  },
  {
    name: 'Medium Load',
    subtitle: 'LF 0.5-0.75',
    color: '#2196f3',
    performance: 110,
    latency: 0.35,
    memory: 48,
    efficiency: 92,
  },
  {
    name: 'High Load',
    subtitle: 'LF 0.75-1.0',
    color: '#ff9800',
    performance: 85,
    latency: 0.8,
    memory: 64,
    efficiency: 75,
  },
  {
    name: 'Critical',
    subtitle: 'LF > 1.0',
    color: '#f44336',
    performance: 45,
    latency: 2.5,
    memory: 96,
    efficiency: 45,
  },
];

function HorizontalBar({ label, value, maxValue, unit, color, delay, showValue = true }: {
  label: string;
  value: number;
  maxValue: number;
  unit: string;
  color: string;
  delay: number;
  showValue?: boolean;
}) {
  const frame = useCurrentFrame();
  const animatedWidth = interpolate(Math.max(0, frame - delay), [0, 45], [0, (value / maxValue) * 100], { extrapolateLeft: 'clamp' });

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 14, color: '#a0a0a0' }}>{label}</span>
        {showValue && (
          <span style={{ fontSize: 14, color, fontWeight: 'bold' }}>
            {value}{unit}
          </span>
        )}
      </div>
      <div
        style={{
          height: 24,
          background: '#2a2a4a',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${animatedWidth}%`,
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            borderRadius: 4,
            boxShadow: `0 0 10px ${color}40`,
          }}
        />
      </div>
    </div>
  );
}

function ScenarioRow({ scenario, index }: { scenario: typeof SCENARIOS[0]; index: number }) {
  const frame = useCurrentFrame();
  const delay = index * 60;
  const opacity = interpolate(Math.max(0, frame - delay), [0, 30], [0, 1], { extrapolateLeft: 'clamp' });
  const translateX = interpolate(Math.max(0, frame - delay), [0, 30], [-30, 0], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 24,
        marginBottom: 16,
        opacity,
        transform: `translateX(${translateX}px)`,
        borderLeft: `4px solid ${scenario.color}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 22, color: scenario.color }}>{scenario.name}</h3>
          <span style={{ fontSize: 14, color: '#a0a0a0' }}>{scenario.subtitle}</span>
        </div>
        <div
          style={{
            padding: '8px 16px',
            background: `${scenario.color}33`,
            borderRadius: 20,
            fontSize: 14,
            fontWeight: 'bold',
            color: scenario.color,
          }}
        >
          {scenario.efficiency}% 效率
        </div>
      </div>

      <HorizontalBar
        label="吞吐量"
        value={scenario.performance}
        maxValue={150}
        unit="K ops/s"
        color={scenario.color}
        delay={delay + 30}
      />
      <HorizontalBar
        label="延迟"
        value={scenario.latency}
        maxValue={5}
        unit="ms"
        color={scenario.color}
        delay={delay + 45}
      />
      <HorizontalBar
        label="内存"
        value={scenario.memory}
        maxValue={128}
        unit="MB"
        color={scenario.color}
        delay={delay + 60}
      />
    </div>
  );
}

function ComparisonChart() {
  const frame = useCurrentFrame();

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

      {/* Throughput comparison */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 12 }}>吞吐量对比 (K ops/sec)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SCENARIOS.map((scenario, i) => {
            const delay = i * 30;
            const animatedWidth = interpolate(Math.max(0, frame - delay), [0, 30], [0, scenario.performance], { extrapolateLeft: 'clamp' });

            return (
              <div key={scenario.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 80, fontSize: 12, color: '#a0a0a0' }}>{scenario.name}</div>
                <div
                  style={{
                    flex: 1,
                    height: 20,
                    background: '#2a2a4a',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${(animatedWidth / 150) * 100}%`,
                      background: scenario.color,
                      borderRadius: 4,
                    }}
                  />
                </div>
                <div style={{ width: 50, fontSize: 12, color: scenario.color, fontWeight: 'bold' }}>
                  {animatedWidth.toFixed(0)}K
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Latency comparison */}
      <div>
        <div style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 12 }}>延迟对比 (ms)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SCENARIOS.map((scenario, i) => {
            const delay = i * 30 + 150;
            const animatedHeight = interpolate(Math.max(0, frame - delay), [0, 30], [0, scenario.latency], { extrapolateLeft: 'clamp' });

            return (
              <div key={scenario.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 80, fontSize: 12, color: '#a0a0a0' }}>{scenario.name}</div>
                <div
                  style={{
                    flex: 1,
                    height: 20,
                    background: '#2a2a4a',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${(animatedHeight / 5) * 100}%`,
                      background: scenario.color,
                      borderRadius: 4,
                    }}
                  />
                </div>
                <div style={{ width: 50, fontSize: 12, color: scenario.color, fontWeight: 'bold' }}>
                  {animatedHeight.toFixed(2)}ms
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SummaryCards() {
  const frame = useCurrentFrame();
  const opacity = interpolate(Math.max(0, frame - 360), [0, 30], [0, 1], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginTop: 24,
        opacity,
      }}
    >
      {SCENARIOS.map((scenario, i) => (
        <div
          key={scenario.name}
          style={{
            background: `${scenario.color}20`,
            border: `2px solid ${scenario.color}`,
            borderRadius: 12,
            padding: 16,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 8 }}>{scenario.name}</div>
          <div style={{ fontSize: 28, color: scenario.color, fontWeight: 'bold' }}>{scenario.efficiency}%</div>
          <div style={{ fontSize: 12, color: '#666' }}>效率评分</div>
        </div>
      ))}
    </div>
  );
}

export const ScenarioComparisonBars: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="场景对比"
          subtitle="不同负载下的性能表现"
        />
      </Sequence>

      {/* 第二段: 详细指标 */}
      <Sequence from={90} durationInFrames={360}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ fontSize: 32, color: 'white', margin: '0 0 32px 0' }}>各场景性能指标</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            {SCENARIOS.map((scenario, i) => (
              <ScenarioRow key={scenario.name} scenario={scenario} index={i} />
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 对比图表 */}
      <Sequence from={360} durationInFrames={90}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ fontSize: 32, color: 'white', margin: '0 0 24px 0' }}>性能对比总结</h2>

          <ComparisonChart />
          <SummaryCards />

          <div
            style={{
              marginTop: 24,
              padding: 20,
              background: 'rgba(255, 152, 0, 0.1)',
              border: '2px solid #ff9800',
              borderRadius: 12,
            }}
          >
            <p style={{ margin: 0, fontSize: 16, color: '#ffffff', lineHeight: 1.6 }}>
              随着负载因子增加，性能显著下降。保持 <strong style={{ color: '#4caf50' }}>LF &lt; 0.5</strong>
              可获得最佳性能，但考虑到内存效率，<strong style={{ color: '#2196f3' }}>LF 0.5-0.75</strong>
              是生产环境的最佳平衡点。
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default ScenarioComparisonBars;

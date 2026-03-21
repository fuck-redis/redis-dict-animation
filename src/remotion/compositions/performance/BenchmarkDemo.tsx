/**
 * 基准测试演示
 * 视频时长: 15秒 (450帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const FPS = 30;
const TOTAL_FRAMES = 450; // 15秒

const OPERATIONS = [
  { name: 'GET', opsPerSec: 125000, color: '#4caf50' },
  { name: 'SET', opsPerSec: 98000, color: '#4caf50' },
  { name: 'DEL', opsPerSec: 110000, color: '#4caf50' },
  { name: 'HSET', opsPerSec: 85000, color: '#ff9800' },
  { name: 'HGET', opsPerSec: 120000, color: '#4caf50' },
];

const LATENCY_DATA = [
  { percentile: 'p50', latency: 0.2, color: '#4caf50' },
  { percentile: 'p95', latency: 0.8, color: '#4caf50' },
  { percentile: 'p99', latency: 1.5, color: '#ff9800' },
  { percentile: 'p99.9', latency: 3.2, color: '#f44336' },
];

function BarChart({ data, maxValue, title, unit }: { data: typeof OPERATIONS; maxValue: number; title: string; unit: string }) {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
      }}
    >
      <h3 style={{ color: 'white', margin: '0 0 20px 0', fontSize: 20 }}>{title}</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 200 }}>
        {data.map((item, i) => {
          const delay = i * 30;
          const animatedValue = interpolate(Math.max(0, frame - delay), [0, 30], [0, item.opsPerSec], { extrapolateLeft: 'clamp' });
          const heightPercent = (animatedValue / maxValue) * 100;

          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '100%',
                  height: `${heightPercent}%`,
                  background: `linear-gradient(180deg, ${item.color} 0%, ${item.color}88 100%)`,
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s ease-out',
                  minHeight: 4,
                }}
              />
              <div
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  color: '#a0a0a0',
                  fontFamily: "'Courier New', monospace",
                }}
              >
                {(animatedValue / 1000).toFixed(0)}K
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: item.color,
                  fontWeight: 'bold',
                }}
              >
                {item.name}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 14, color: '#666', marginTop: 8, textAlign: 'right' }}>单位: {unit}</div>
    </div>
  );
}

function LatencyChart({ data }: { data: typeof LATENCY_DATA }) {
  const frame = useCurrentFrame();
  const maxLatency = 5;

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 24,
      }}
    >
      <h3 style={{ color: 'white', margin: '0 0 20px 0', fontSize: 20 }}>延迟分布 (ms)</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, height: 180 }}>
        {data.map((item, i) => {
          const delay = i * 25;
          const animatedValue = interpolate(Math.max(0, frame - delay), [0, 25], [0, item.latency], { extrapolateLeft: 'clamp' });
          const heightPercent = (animatedValue / maxLatency) * 100;

          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: 60,
                  height: `${heightPercent}%`,
                  background: `linear-gradient(180deg, ${item.color} 0%, ${item.color}88 100%)`,
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s ease-out',
                  minHeight: 4,
                }}
              />
              <div
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  color: item.color,
                  fontWeight: 'bold',
                }}
              >
                {animatedValue.toFixed(1)}ms
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: '#a0a0a0',
                }}
              >
                {item.percentile}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BenchmarkMetrics() {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 450], [0, 100], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 24,
        marginTop: 24,
      }}
    >
      <h3 style={{ color: 'white', margin: '0 0 20px 0', fontSize: 20 }}>测试配置</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {[
          { label: '测试时长', value: '60秒' },
          { label: '并发连接', value: '50' },
          { label: '数据量', value: '1,000,000 keys' },
          { label: '负载因子', value: '0.65' },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              padding: 16,
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 8,
            }}
          >
            <div style={{ fontSize: 14, color: '#a0a0a0' }}>{item.label}</div>
            <div style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>{item.value}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: '#a0a0a0', fontSize: 14 }}>测试进度</span>
          <span style={{ color: '#4caf50', fontSize: 14 }}>{progress.toFixed(0)}%</span>
        </div>
        <div
          style={{
            height: 8,
            background: '#2a2a4a',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #4caf50, #8bc34a)',
              borderRadius: 4,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export const BenchmarkDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="基准测试"
          subtitle="Redis Dict 性能评测方法论"
        />
      </Sequence>

      {/* 第二段: 测试方法介绍 */}
      <Sequence from={90} durationInFrames={150}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ fontSize: 36, color: '#e94560', margin: '0 0 32px 0' }}>基准测试流程</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { step: '01', title: '准备工作', desc: '清空数据，设置初始参数' },
              { step: '02', title: '数据填充', desc: '预填充指定数量的键值对' },
              { step: '03', title: '预热运行', desc: '执行多次操作预热缓存' },
              { step: '04', title: '正式测试', desc: '记录吞吐量、延迟等指标' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  padding: 20,
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: '#e94560',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  {item.step}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20, color: 'white' }}>{item.title}</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: 14, color: '#a0a0a0' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 吞吐量图表 */}
      <Sequence from={240} durationInFrames={210}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <BarChart
            data={OPERATIONS}
            maxValue={150000}
            title="操作吞吐量 (ops/sec)"
            unit="操作/秒"
          />
          <LatencyChart data={LATENCY_DATA} />
          <BenchmarkMetrics />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default BenchmarkDemo;

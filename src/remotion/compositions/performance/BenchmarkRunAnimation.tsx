/**
 * Benchmark Run Animation
 * 视频时长: 20秒 (600帧 @ 30fps)
 * 模拟基准测试运行的动画
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const TOTAL_FRAMES = 600; // 20秒

const OPERATIONS = [
  { name: 'GET', weight: 70 },
  { name: 'SET', weight: 20 },
  { name: 'DEL', weight: 5 },
  { name: 'HSET', weight: 3 },
  { name: 'HGET', weight: 2 },
];

function RunningIndicator({ progress }: { progress: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#4caf50',
          animation: 'pulse 1s infinite',
        }}
      />
      <span style={{ fontSize: 14, color: '#a0a0a0' }}>运行中 {progress.toFixed(0)}%</span>
    </div>
  );
}

function OperationCounter({ name, count, color }: { name: string; count: number; color: string }) {
  const frame = useCurrentFrame();
  const displayCount = interpolate(frame, [0, 30], [0, count], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 8,
        borderLeft: `3px solid ${color}`,
      }}
    >
      <span style={{ fontSize: 14, color: '#a0a0a0' }}>{name}</span>
      <span style={{ fontSize: 16, color, fontWeight: 'bold', fontFamily: "'Courier New', monospace" }}>
        {Math.round(displayCount).toLocaleString()}
      </span>
    </div>
  );
}

function ProgressBar({ progress, label }: { progress: number; label: string }) {
  const frame = useCurrentFrame();

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 14, color: '#a0a0a0' }}>{label}</span>
        <span style={{ fontSize: 14, color: '#4caf50' }}>{progress.toFixed(1)}%</span>
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
            transition: 'width 0.1s linear',
          }}
        />
      </div>
    </div>
  );
}

function Timer({ elapsed, total }: { elapsed: number; total: number }) {
  const minutes = Math.floor(elapsed / 60);
  const seconds = Math.floor(elapsed % 60);
  const progress = (elapsed / total) * 100;

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 20,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 8 }}>运行时间</div>
      <div style={{ fontSize: 36, fontWeight: 'bold', color: '#2196f3', fontFamily: "'Courier New', monospace" }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div style={{ marginTop: 12 }}>
        <ProgressBar progress={progress} label="测试进度" />
      </div>
    </div>
  );
}

function ResultsPanel({ show }: { show: boolean }) {
  if (!show) return null;

  const frame = useCurrentFrame();
  const opacity = interpolate(Math.max(0, frame), [0, 30], [0, 1], { extrapolateLeft: 'clamp' });
  const translateY = interpolate(Math.max(0, frame), [0, 30], [20, 0], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        background: 'rgba(76, 175, 80, 0.1)',
        border: '2px solid #4caf50',
        borderRadius: 12,
        padding: 24,
        marginTop: 24,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <h3 style={{ margin: '0 0 20px 0', color: '#4caf50', fontSize: 20 }}>测试完成!</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>总操作数</div>
          <div style={{ fontSize: 24, color: '#4caf50', fontWeight: 'bold' }}>7,523,840</div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>吞吐量</div>
          <div style={{ fontSize: 24, color: '#2196f3', fontWeight: 'bold' }}>125,397</div>
          <div style={{ fontSize: 12, color: '#666' }}>ops/sec</div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>平均延迟</div>
          <div style={{ fontSize: 24, color: '#ff9800', fontWeight: 'bold' }}>0.35</div>
          <div style={{ fontSize: 12, color: '#666' }}>ms</div>
        </div>
      </div>
    </div>
  );
}

function OperationHistogram() {
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
      <h3 style={{ color: 'white', margin: '0 0 20px 0', fontSize: 20 }}>操作分布</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {OPERATIONS.map((op, i) => {
          const delay = i * 20;
          const animatedWeight = interpolate(Math.max(0, frame - delay), [0, 30], [0, op.weight], { extrapolateLeft: 'clamp' });

          return (
            <div key={op.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 14, color: '#a0a0a0' }}>{op.name}</span>
                <span style={{ fontSize: 14, color: '#4caf50' }}>{animatedWeight.toFixed(1)}%</span>
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
                    width: `${animatedWeight}%`,
                    background: 'linear-gradient(90deg, #4caf50, #8bc34a)',
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LiveStatsPanel() {
  const frame = useCurrentFrame();

  // Simulate live updating stats
  const opsCount = Math.floor(frame * 200 + Math.sin(frame / 10) * 50);
  const latency = 0.35 + Math.sin(frame / 15) * 0.1;
  const cpu = 45 + Math.sin(frame / 20) * 10;

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 24,
      }}
    >
      <h3 style={{ color: 'white', margin: '0 0 20px 0', fontSize: 20 }}>实时统计</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>已执行操作</div>
          <div style={{ fontSize: 24, color: '#4caf50', fontWeight: 'bold', fontFamily: "'Courier New', monospace" }}>
            {opsCount.toLocaleString()}
          </div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>当前延迟</div>
          <div style={{ fontSize: 24, color: '#2196f3', fontWeight: 'bold', fontFamily: "'Courier New', monospace" }}>
            {latency.toFixed(2)}ms
          </div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>CPU 使用</div>
          <div style={{ fontSize: 24, color: '#ff9800', fontWeight: 'bold', fontFamily: "'Courier New', monospace" }}>
            {cpu.toFixed(0)}%
          </div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>内存使用</div>
          <div style={{ fontSize: 24, color: '#9c27b0', fontWeight: 'bold', fontFamily: "'Courier New', monospace" }}>
            64.2 MB
          </div>
        </div>
      </div>
    </div>
  );
}

export const BenchmarkRunAnimation: React.FC = () => {
  const frame = useCurrentFrame();

  // Calculate progress through the benchmark (0-100%)
  const progress = interpolate(frame, [0, 480], [0, 100], { extrapolateLeft: 'clamp' });
  const elapsedSeconds = interpolate(frame, [0, 480], [0, 60], { extrapolateLeft: 'clamp' });
  const showResults = frame > 480;

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="基准测试"
          subtitle="Redis Dict 性能评测"
        />
      </Sequence>

      {/* 第二段: 测试运行中 */}
      <Sequence from={90} durationInFrames={510}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 32, color: 'white', margin: 0 }}>基准测试运行中</h2>
            <RunningIndicator progress={progress} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Left column */}
            <div>
              <Timer elapsed={elapsedSeconds} total={60} />
              <OperationHistogram />
            </div>

            {/* Right column */}
            <div>
              <LiveStatsPanel />

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 12,
                  padding: 24,
                  marginTop: 24,
                }}
              >
                <h3 style={{ color: 'white', margin: '0 0 16px 0', fontSize: 20 }}>操作计数器</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {OPERATIONS.map((op, i) => {
                    const count = Math.floor((progress / 100) * 100000 * (op.weight / 100));
                    return (
                      <OperationCounter
                        key={op.name}
                        name={op.name}
                        count={count}
                        color={i === 0 ? '#4caf50' : i === 1 ? '#2196f3' : i === 2 ? '#ff9800' : '#9c27b0'}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 结果展示 */}
      <Sequence from={480} durationInFrames={120}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ fontSize: 32, color: '#4caf50', margin: '0 0 32px 0' }}>测试结果</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: '总操作数', value: '7,523,840', color: '#4caf50' },
              { label: '吞吐量', value: '125,397 ops/s', color: '#2196f3' },
              { label: '平均延迟', value: '0.35 ms', color: '#ff9800' },
              { label: 'p99 延迟', value: '1.2 ms', color: '#f44336' },
            ].map((item, i) => {
              const opacity = interpolate(Math.max(0, frame - 480), [0, 30], [0, 1], { extrapolateLeft: 'clamp' });
              const translateY = interpolate(Math.max(0, frame - 480), [0, 30], [20, 0], { extrapolateLeft: 'clamp' });

              return (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 12,
                    padding: 20,
                    textAlign: 'center',
                    opacity,
                    transform: `translateY(${translateY}px)`,
                    borderTop: `4px solid ${item.color}`,
                  }}
                >
                  <div style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 8 }}>{item.label}</div>
                  <div style={{ fontSize: 24, color: item.color, fontWeight: 'bold' }}>{item.value}</div>
                </div>
              );
            })}
          </div>

          <ResultsPanel show={true} />

          <div
            style={{
              marginTop: 24,
              padding: 20,
              background: 'rgba(33, 150, 243, 0.1)',
              borderRadius: 12,
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: 16, color: '#a0a0a0' }}>
              测试配置: 60秒 | 50并发连接 | 1,000,000 键 | 负载因子 0.65
            </span>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default BenchmarkRunAnimation;

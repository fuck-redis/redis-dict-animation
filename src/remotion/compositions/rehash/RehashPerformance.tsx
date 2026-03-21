/**
 * Rehash 性能分析
 * 视频时长: 15秒 (450帧 @ 30fps)
 * 展示 Rehash 过程的性能影响分析
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const FPS = 30;
const TOTAL_FRAMES = 450; // 15秒

// 性能指标数据
interface PerformanceMetrics {
  bucketsCount: number;
  entriesCount: number;
  rehashStep: number;
  timePerStep: number;
  totalTime: number;
  throughput: number;
}

function PerformanceChart({ metrics }: { metrics: PerformanceMetrics }) {
  const frame = useCurrentFrame();
  const { bucketsCount, entriesCount, rehashStep, timePerStep, totalTime, throughput } = metrics;

  // 计算进度
  const progress = interpolate(frame, [0, 120], [0, 1], { extrapolateLeft: 'clamp' });
  const migratedBuckets = Math.floor(rehashStep * progress);

  return (
    <div
      style={{
        padding: 24,
        background: 'rgba(255, 255, 255, 0.05)',
        border: '2px solid #2196f3',
        borderRadius: 12,
      }}
    >
      <h3 style={{ color: '#2196f3', marginBottom: 20 }}>性能指标</h3>

      {/* 进度条 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: '#a0a0a0' }}>Rehash 进度</span>
          <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
            {(progress * 100).toFixed(0)}%
          </span>
        </div>
        <div
          style={{
            height: 16,
            background: '#333',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress * 100}%`,
              background: 'linear-gradient(90deg, #2196f3, #4caf50)',
              borderRadius: 8,
              transition: 'width 0.1s linear',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: '#666' }}>
          <span>桶 0</span>
          <span>桶 {migratedBuckets} / {bucketsCount}</span>
          <span>桶 {bucketsCount}</span>
        </div>
      </div>

      {/* 指标网格 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        <div
          style={{
            padding: 16,
            background: 'rgba(33, 150, 243, 0.2)',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#2196f3' }}>
            {bucketsCount}
          </div>
          <div style={{ fontSize: 12, color: '#a0a0a0' }}>总桶数</div>
        </div>
        <div
          style={{
            padding: 16,
            background: 'rgba(76, 175, 80, 0.2)',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#4caf50' }}>
            {entriesCount}
          </div>
          <div style={{ fontSize: 12, color: '#a0a0a0' }}>总 Entry 数</div>
        </div>
        <div
          style={{
            padding: 16,
            background: 'rgba(255, 152, 0, 0.2)',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff9800' }}>
            {timePerStep.toFixed(2)}ms
          </div>
          <div style={{ fontSize: 12, color: '#a0a0a0' }}>每步耗时</div>
        </div>
        <div
          style={{
            padding: 16,
            background: 'rgba(233, 69, 96, 0.2)',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#e94560' }}>
            {totalTime.toFixed(0)}ms
          </div>
          <div style={{ fontSize: 12, color: '#a0a0a0' }}>预估总时间</div>
        </div>
      </div>

      {/* 吞吐量 */}
      <div
        style={{
          marginTop: 16,
          padding: 16,
          background: 'rgba(76, 175, 80, 0.2)',
          borderRadius: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ color: '#a0a0a0' }}>吞吐量</span>
        <span style={{ fontSize: 20, fontWeight: 'bold', color: '#4caf50' }}>
          {throughput.toLocaleString()} ops/sec
        </span>
      </div>
    </div>
  );
}

function TimeBreakdown() {
  const frame = useCurrentFrame();
  const phase = Math.floor(frame / 90) % 4;

  const steps = [
    { name: '检查负载因子', time: '0.01ms', desc: '判断是否需要扩展' },
    { name: '分配新表内存', time: '0.5ms', desc: '申请 ht[1] 空间' },
    { name: '迁移单个桶', time: '0.02ms', desc: '分散到每次操作' },
    { name: '释放旧表', time: '0.1ms', desc: '释放 ht[0] 内存' },
  ];

  return (
    <div style={{ flex: 1 }}>
      <h3 style={{ color: '#ff9800', marginBottom: 20 }}>各阶段耗时分解</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: 16,
              background: phase === i ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${phase === i ? '#ff9800' : '#333'}`,
              borderRadius: 8,
              transition: 'all 0.3s ease',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: phase === i ? '#ff9800' : '#666',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: 14,
              }}
            >
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, color: 'white', fontWeight: 600 }}>{step.name}</div>
              <div style={{ fontSize: 12, color: '#a0a0a0', marginTop: 2 }}>{step.desc}</div>
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: phase === i ? '#ff9800' : '#a0a0a0',
                fontFamily: "'Courier New', monospace",
              }}
            >
              {step.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImpactAnalysis() {
  const frame = useCurrentFrame();
  const activePhase = Math.floor(frame / 120);

  const impacts = [
    {
      title: '单次操作影响',
      value: '< 0.1ms',
      detail: '每次只迁移1个桶的开销',
      color: '#4caf50',
      icon: '⚡',
    },
    {
      title: '100万键迁移',
      value: '~2秒',
      detail: '分摊到数千次请求',
      color: '#2196f3',
      icon: '📊',
    },
    {
      title: '用户感知',
      value: '0',
      detail: '无感知，服务持续可用',
      color: '#e94560',
      icon: '👤',
    },
  ];

  return (
    <div style={{ flex: 1 }}>
      <h3 style={{ color: '#4caf50', marginBottom: 20 }}>性能影响分析</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {impacts.map((impact, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: 20,
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 12,
              borderLeft: `4px solid ${impact.color}`,
              opacity: interpolate(frame, [i * 30, i * 30 + 30], [0.5, 1], { extrapolateLeft: 'clamp' }),
            }}
          >
            <span style={{ fontSize: 40 }}>{impact.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: '#a0a0a0' }}>{impact.title}</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: impact.color }}>
                {impact.value}
              </div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{impact.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RehashTimeline() {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 450], [0, 1], { extrapolateLeft: 'clamp' });

  // 模拟时间线
  const totalTime = 2000; // 2秒
  const currentTime = progress * totalTime;

  return (
    <div
      style={{
        marginTop: 24,
        padding: 20,
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
      }}
    >
      <h4 style={{ color: '#a0a0a0', marginBottom: 16 }}>Rehash 时间线</h4>

      {/* 时间轴 */}
      <div style={{ position: 'relative', height: 60 }}>
        {/* 背景线 */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 0,
            right: 0,
            height: 4,
            background: '#333',
            borderRadius: 2,
          }}
        />

        {/* 进度 */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 0,
            width: `${progress * 100}%`,
            height: 4,
            background: 'linear-gradient(90deg, #2196f3, #4caf50)',
            borderRadius: 2,
          }}
        />

        {/* 起点 */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 0,
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 10, color: '#666' }}>开始</div>
          <div style={{ width: 12, height: 12, background: '#2196f3', borderRadius: '50%' }} />
          <div style={{ fontSize: 10, color: '#a0a0a0' }}>0ms</div>
        </div>

        {/* 当前点 */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: `${progress * 100}%`,
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 10, color: '#4caf50' }}>当前</div>
          <div
            style={{
              width: 16,
              height: 16,
              background: '#4caf50',
              borderRadius: '50%',
              border: '3px solid #1a1a2e',
              boxShadow: '0 0 10px rgba(76, 175, 80, 0.5)',
            }}
          />
          <div style={{ fontSize: 10, color: '#4caf50', fontWeight: 'bold' }}>
            {currentTime.toFixed(0)}ms
          </div>
        </div>

        {/* 终点 */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 0,
            transform: 'translateX(50%)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 10, color: '#666' }}>完成</div>
          <div style={{ width: 12, height: 12, background: '#e94560', borderRadius: '50%' }} />
          <div style={{ fontSize: 10, color: '#a0a0a0' }}>{totalTime}ms</div>
        </div>
      </div>

      {/* 统计 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 16,
          padding: '12px 16px',
          background: 'rgba(76, 175, 80, 0.1)',
          borderRadius: 8,
        }}
      >
        <div>
          <span style={{ color: '#a0a0a0', fontSize: 12 }}>已迁移: </span>
          <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
            {Math.floor(progress * 1024)} / 1024 桶
          </span>
        </div>
        <div>
          <span style={{ color: '#a0a0a0', fontSize: 12 }}>吞吐量: </span>
          <span style={{ color: '#2196f3', fontWeight: 'bold' }}>
            {(1024 / (totalTime / 1000)).toLocaleString()} 桶/秒
          </span>
        </div>
      </div>
    </div>
  );
}

export const RehashPerformance: React.FC = () => {
  const metrics: PerformanceMetrics = {
    bucketsCount: 1024,
    entriesCount: 50000,
    rehashStep: 512,
    timePerStep: 0.02,
    totalTime: 2048,
    throughput: 50000,
  };

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="Rehash 性能分析"
          subtitle="分而治之的代价有多大？"
        />
      </Sequence>

      {/* 第二段: 性能指标 */}
      <Sequence from={90} durationInFrames={180}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: '#ffffff', marginBottom: 24 }}>Rehash 性能指标</h2>
          <div style={{ display: 'flex', gap: 32 }}>
            <div style={{ flex: 1 }}>
              <PerformanceChart metrics={metrics} />
            </div>
            <div style={{ flex: 1 }}>
              <TimeBreakdown />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 影响分析 */}
      <Sequence from={270} durationInFrames={180}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: '#ffffff', marginBottom: 24 }}>Rehash 对系统的影响</h2>
          <div style={{ display: 'flex', gap: 32 }}>
            <ImpactAnalysis />
            <RehashTimeline />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default RehashPerformance;

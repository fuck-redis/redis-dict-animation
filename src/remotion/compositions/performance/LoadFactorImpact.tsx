/**
 * 负载因子对性能的影响
 * 视频时长: 50秒 (1500帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const FPS = 30;
const TOTAL_FRAMES = 1500; // 50秒

const LOAD_FACTORS = [
  { range: '0 - 0.5', color: '#4caf50', label: '优秀', probes: '< 1.2', desc: '负载较低，性能良好' },
  { range: '0.5 - 0.75', color: '#2196f3', label: '良好', probes: '1.2-1.5', desc: '负载正常，建议继续监控' },
  { range: '0.75 - 1.0', color: '#ff9800', label: '一般', probes: '1.5-2', desc: '负载较高，准备 Rehash' },
  { range: '> 1.0', color: '#f44336', label: '较差', probes: '> 2', desc: '立即 Rehash' },
];

function LoadFactorMeter({ value }: { value: number }) {
  const frame = useCurrentFrame();
  const displayValue = interpolate(frame, [0, 300], [0, value], { extrapolateLeft: 'clamp' });
  const color =
    displayValue < 0.5 ? '#4caf50' : displayValue < 0.75 ? '#2196f3' : displayValue < 1.0 ? '#ff9800' : '#f44336';

  return (
    <div style={{ textAlign: 'center', marginBottom: 40 }}>
      <div style={{ fontSize: 72, fontWeight: 'bold', color }}>{(displayValue * 100).toFixed(0)}%</div>
      <div style={{ fontSize: 18, color: '#a0a0a0' }}>负载因子</div>
    </div>
  );
}

function PerformanceTable() {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
            <th style={{ padding: 16, textAlign: 'left', color: '#a0a0a0' }}>负载因子范围</th>
            <th style={{ padding: 16, textAlign: 'left', color: '#a0a0a0' }}>查找性能</th>
            <th style={{ padding: 16, textAlign: 'left', color: '#a0a0a0' }}>冲突概率</th>
            <th style={{ padding: 16, textAlign: 'left', color: '#a0a0a0' }}>建议操作</th>
          </tr>
        </thead>
        <tbody>
          {LOAD_FACTORS.map((item, i) => (
            <tr
              key={i}
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <td style={{ padding: 16, color: item.color, fontWeight: 'bold' }}>{item.range}</td>
              <td style={{ padding: 16, color: 'white' }}>{item.probes} 次</td>
              <td style={{ padding: 16, color: '#a0a0a0' }}>
                {i === 0 ? '< 10%' : i === 1 ? '10-20%' : i === 2 ? '20-35%' : '> 35%'}
              </td>
              <td style={{ padding: 16, color: item.color }}>{item.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const LoadFactorImpact: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="负载因子"
          subtitle="哈希表性能的晴雨表"
        />
      </Sequence>

      {/* 第二段: 定义 */}
      <Sequence from={90} durationInFrames={390}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h1 style={{ fontSize: 48, color: '#e94560', margin: '0 0 24px 0' }}>
            负载因子 (Load Factor)
          </h1>
          <div
            style={{
              padding: 32,
              background: 'rgba(33, 150, 243, 0.2)',
              border: '2px solid #2196f3',
              borderRadius: 12,
              marginBottom: 32,
            }}
          >
            <div style={{ fontSize: 36, color: 'white', fontFamily: "'Courier New', monospace", textAlign: 'center' }}>
              负载因子 = 已使用节点数 / 哈希表大小
            </div>
            <div style={{ fontSize: 24, color: '#a0a0a0', textAlign: 'center', marginTop: 16 }}>
              = used / size
            </div>
          </div>

          <p style={{ fontSize: 22, color: '#ffffff', lineHeight: 1.6 }}>
            负载因子衡量哈希表的<strong style={{ color: '#ff9800' }}>填充程度</strong>。
            负载因子越高，冲突越多，性能越差。
          </p>
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 性能表格 */}
      <Sequence from={480} durationInFrames={720}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: 'white', marginBottom: 32 }}>负载因子与性能</h2>
          <PerformanceTable />
        </AbsoluteFill>
      </Sequence>

      {/* 第四段: 总结 */}
      <Sequence from={1200} durationInFrames={300}>
        <SceneNarrator
          title="监控负载因子"
          subtitle="保持 LF < 0.75 最佳"
          text="生产环境中应该监控负载因子，在达到 0.75 时开始准备 rehash，不要等到超过 1.0。"
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export default LoadFactorImpact;

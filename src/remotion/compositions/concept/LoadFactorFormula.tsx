/**
 * LoadFactorFormula
 * 视频时长: 8秒 (240帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 240; // 8秒 * 30fps

function FormulaBox({
  formula,
  color,
  opacity,
  scale,
}: {
  formula: string;
  color: string;
  opacity: number;
  scale: number;
}) {
  return (
    <div
      style={{
        padding: '32px 48px',
        background: `rgba(${color}, 0.15)`,
        border: `3px solid ${color}`,
        borderRadius: 16,
        opacity,
        transform: `scale(${scale})`,
        boxShadow: `0 8px 32px rgba(${color}, 0.3)`,
      }}
    >
      <div
        style={{
          fontSize: 42,
          fontWeight: 'bold',
          fontFamily: "'Courier New', monospace",
          color: 'white',
          textAlign: 'center',
        }}
      >
        {formula}
      </div>
    </div>
  );
}

function VariableBox({
  name,
  value,
  description,
  color,
  delay,
}: {
  name: string;
  value: string;
  description: string;
  color: string;
  delay: number;
}) {
  const frame = useCurrentFrame();

  const opacity = interpolate(Math.max(0, frame - delay), [0, 20], [0, 1], { extrapolateLeft: 'clamp' });
  const translateY = interpolate(Math.max(0, frame - delay), [0, 20], [30, 0], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        padding: '20px 28px',
        background: `rgba(${color}, 0.15)`,
        border: `2px solid ${color}`,
        borderRadius: 12,
        textAlign: 'center',
        opacity,
        transform: `translateY(${translateY}px)`,
        minWidth: 180,
      }}
    >
      <div style={{ fontSize: 18, color: color, fontWeight: 'bold', marginBottom: 8 }}>
        {name}
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 'bold',
          fontFamily: "'Courier New', monospace",
          color: 'white',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 14, color: '#a0a0a0', marginTop: 8 }}>{description}</div>
    </div>
  );
}

function LoadFactorMeter({ value, maxValue }: { value: number; maxValue: number }) {
  const frame = useCurrentFrame();
  const displayValue = interpolate(frame, [0, 180], [0, value], { extrapolateLeft: 'clamp' });
  const percentage = (displayValue / maxValue) * 100;

  const color =
    percentage < 50 ? '#4caf50' : percentage < 75 ? '#ff9800' : '#f44336';

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontSize: 72,
          fontWeight: 'bold',
          color,
          fontFamily: "'Courier New', monospace",
        }}
      >
        {displayValue.toFixed(1)}
      </div>
      <div style={{ fontSize: 18, color: '#a0a0a0', marginBottom: 16 }}>
        负载因子 = used / size
      </div>
      <div
        style={{
          width: 400,
          height: 24,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          overflow: 'hidden',
          border: '2px solid #333',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, width: 400, margin: '8px auto 0' }}>
        <span style={{ fontSize: 12, color: '#666' }}>0</span>
        <span style={{ fontSize: 12, color: '#4caf50' }}>0.5 (理想)</span>
        <span style={{ fontSize: 12, color: '#ff9800' }}>0.75</span>
        <span style={{ fontSize: 12, color: '#f44336' }}>1.0+</span>
      </div>
    </div>
  );
}

function CalculationSteps() {
  const frame = useCurrentFrame();

  const step1Opacity = interpolate(Math.max(0, frame - 60), [0, 20], [0, 1], { extrapolateLeft: 'clamp' });
  const step2Opacity = interpolate(Math.max(0, frame - 120), [0, 20], [0, 1], { extrapolateLeft: 'clamp' });
  const resultOpacity = interpolate(Math.max(0, frame - 180), [0, 20], [0, 1], { extrapolateLeft: 'clamp' });

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 24, color: '#e94560', marginBottom: 32, fontWeight: 'bold' }}>
        负载因子计算示例
      </div>

      <div style={{ marginBottom: 24, opacity: step1Opacity }}>
        <div style={{ fontSize: 16, color: '#888', marginBottom: 8 }}>已知条件</div>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
          <div style={{ padding: '12px 24px', background: 'rgba(33, 150, 243, 0.2)', borderRadius: 8 }}>
            <span style={{ color: '#2196f3' }}>used</span> = 6 个节点
          </div>
          <div style={{ padding: '12px 24px', background: 'rgba(76, 175, 80, 0.2)', borderRadius: 8 }}>
            <span style={{ color: '#4caf50' }}>size</span> = 8 个桶
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 24, opacity: step2Opacity }}>
        <div style={{ fontSize: 16, color: '#888', marginBottom: 8 }}>计算过程</div>
        <div
          style={{
            padding: '16px 24px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 8,
            fontFamily: "'Courier New', monospace",
            fontSize: 20,
            color: 'white',
          }}
        >
          loadFactor = used / size = 6 / 8
        </div>
      </div>

      <div style={{ opacity: resultOpacity }}>
        <div style={{ fontSize: 16, color: '#888', marginBottom: 8 }}>结果</div>
        <div
          style={{
            padding: '20px 40px',
            background: 'rgba(76, 175, 80, 0.2)',
            border: '3px solid #4caf50',
            borderRadius: 12,
            display: 'inline-block',
          }}
        >
          <span style={{ fontSize: 36, fontWeight: 'bold', color: '#4caf50' }}>0.75</span>
          <span style={{ fontSize: 18, color: '#a0a0a0', marginLeft: 16 }}>需要扩容</span>
        </div>
      </div>
    </div>
  );
}

function ThresholdIndicator() {
  const frame = useCurrentFrame();
  const thresholds = [
    { value: 0.5, label: '理想', color: '#4caf50', desc: '性能最佳' },
    { value: 0.75, label: '警告', color: '#ff9800', desc: '准备扩容' },
    { value: 1.0, label: '危险', color: '#f44336', desc: '立即扩容' },
  ];

  return (
    <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
      {thresholds.map((t, i) => {
        const delay = i * 40;
        const opacity = interpolate(Math.max(0, frame - delay), [0, 20], [0, 1], { extrapolateLeft: 'clamp' });
        const translateY = interpolate(Math.max(0, frame - delay), [0, 20], [20, 0], { extrapolateLeft: 'clamp' });

        return (
          <div
            key={t.label}
            style={{
              padding: '16px 24px',
              background: `rgba(${t.color}, 0.15)`,
              border: `2px solid ${t.color}`,
              borderRadius: 12,
              opacity,
              transform: `translateY(${translateY}px)`,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 14, color: '#888' }}>{t.label}</div>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: t.color }}>
              {t.value}
            </div>
            <div style={{ fontSize: 12, color: '#a0a0a0', marginTop: 4 }}>{t.desc}</div>
          </div>
        );
      })}
    </div>
  );
}

export const LoadFactorFormula: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* Sequence 1: Title */}
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="负载因子公式"
          subtitle="衡量哈希表填充程度的关键指标"
        />
      </Sequence>

      {/* Sequence 2: Formula */}
      <Sequence from={60} durationInFrames={90}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h2 style={{ color: '#ffffff', marginBottom: 48, fontSize: 32 }}>
            负载因子 (Load Factor)
          </h2>

          <FormulaBox
            formula="loadFactor = used / size"
            color="76, 175, 80"
            opacity={1}
            scale={1}
          />

          <div style={{ marginTop: 48, display: 'flex', gap: 32 }}>
            <VariableBox
              name="used"
              value="6"
              description="已使用的节点数"
              color="33, 150, 243"
              delay={30}
            />
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 32, color: '#4caf50' }}>
              ÷
            </div>
            <VariableBox
              name="size"
              value="8"
              description="桶的数量"
              color="76, 175, 80"
              delay={60}
            />
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 32, color: '#4caf50' }}>
              =
            </div>
            <VariableBox
              name="LF"
              value="0.75"
              description="负载因子"
              color="255, 152, 0"
              delay={90}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Sequence 3: Calculation Example */}
      <Sequence from={150} durationInFrames={90}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CalculationSteps />

          <div style={{ marginTop: 48 }}>
            <ThresholdIndicator />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default LoadFactorFormula;

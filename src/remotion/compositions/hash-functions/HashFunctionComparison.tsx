/**
 * 哈希函数对比
 * 视频时长: 20秒 (600帧 @ 30fps)
 * 雷达图对比4种哈希函数: 速度、分布、安全性、简洁性
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const TOTAL_FRAMES = 600; // 20秒

// 哈希函数数据类型
interface HashFunction {
  name: string;
  color: string;
  speed: number;
  distribution: number;
  security: number;
  simplicity: number;
  desc: string;
}

// 哈希函数数据
const HASH_FUNCTIONS: HashFunction[] = [
  {
    name: 'SipHash',
    color: '#4caf50',
    speed: 3,
    distribution: 4,
    security: 5,
    simplicity: 3,
    desc: 'Redis 默认，抗攻击',
  },
  {
    name: 'DJB2',
    color: '#2196f3',
    speed: 5,
    distribution: 3,
    security: 1,
    simplicity: 5,
    desc: '简单快速，非加密',
  },
  {
    name: 'FNV-1a',
    color: '#ff9800',
    speed: 5,
    distribution: 4,
    security: 1,
    simplicity: 4,
    desc: '分布良好，速度快',
  },
  {
    name: 'Murmur3',
    color: '#9c27b0',
    speed: 4,
    distribution: 5,
    security: 2,
    simplicity: 3,
    desc: '分布优秀，非加密',
  },
];

const METRICS = ['Speed', 'Distribution', 'Security', 'Simplicity'];

// 绘制雷达图
function RadarChart({
  data,
  size,
  opacity,
}: {
  data: { name: string; values: number[]; color: string; desc: string };
  size: number;
  opacity: number;
}) {
  const center = size / 2;
  const maxRadius = size / 2 - 40;
  const angleStep = (2 * Math.PI) / METRICS.length;

  // 计算顶点位置
  const getPoint = (index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const radius = (value / 5) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  // 背景网格
  const gridLevels = [1, 2, 3, 4, 5];

  // 计算数据点
  const points = data.values.map((v, i) => getPoint(i, v));
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  // 标签位置
  const labels = METRICS.map((metric, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const labelRadius = maxRadius + 30;
    return {
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle),
      text: metric,
    };
  });

  return (
    <div style={{ opacity, transition: 'opacity 0.3s ease' }}>
      <svg width={size} height={size}>
        {/* 背景网格 */}
        {gridLevels.map((level) => {
          const r = (level / 5) * maxRadius;
          const gridPoints = METRICS.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          });
          return (
            <polygon
              key={level}
              points={gridPoints.join(' ')}
              fill="none"
              stroke="#333"
              strokeWidth="1"
            />
          );
        })}

        {/* 轴线 */}
        {METRICS.map((_, i) => {
          const p = getPoint(i, 5);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke="#444"
              strokeWidth="1"
            />
          );
        })}

        {/* 数据区域 */}
        <path d={pathData} fill={data.color} fillOpacity={0.3} stroke={data.color} strokeWidth="2" />

        {/* 数据点 */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill={data.color} />
        ))}

        {/* 标签 */}
        {labels.map((label, i) => (
          <text
            key={i}
            x={label.x}
            y={label.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#888"
            fontSize="12"
          >
            {label.text}
          </text>
        ))}
      </svg>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <span style={{ fontSize: 20, fontWeight: 'bold', color: data.color }}>{data.name}</span>
        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{data.desc}</div>
      </div>
    </div>
  );
}

// 评分条
function RatingBar({
  label,
  value,
  maxValue,
  color,
  index,
}: {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  index: number;
}) {
  const frame = useCurrentFrame();
  const delay = index * 15;
  const progress = interpolate(Math.max(0, frame - delay), [0, 20], [0, value], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ color: '#888', fontSize: 14 }}>{label}</span>
        <span style={{ color, fontFamily: "'Courier New', monospace" }}>{value}/{maxValue}</span>
      </div>
      <div style={{ height: 8, background: '#222', borderRadius: 4, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${(progress / maxValue) * 100}%`,
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            transition: 'width 0.1s ease',
          }}
        />
      </div>
    </div>
  );
}

// 哈希函数卡片
function HashFunctionCard({
  func,
  index,
  isSelected,
  onClick,
}: {
  func: (typeof HASH_FUNCTIONS)[0];
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const frame = useCurrentFrame();
  const delay = index * 30;
  const opacity = interpolate(Math.max(0, frame - delay), [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
  });
  const translateY = interpolate(Math.max(0, frame - delay), [0, 20], [20, 0], {
    extrapolateLeft: 'clamp',
  });

  return (
    <div
      onClick={onClick}
      style={{
        padding: 16,
        background: isSelected ? `rgba(${func.color}, 0.2)` : 'rgba(255, 255, 255, 0.03)',
        border: `2px solid ${isSelected ? func.color : '#333'}`,
        borderRadius: 12,
        cursor: 'pointer',
        opacity,
        transform: `translateY(${translateY}px)`,
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: func.color,
          }}
        />
        <span style={{ fontSize: 18, fontWeight: 'bold', color: func.color }}>{func.name}</span>
      </div>

      <div style={{ marginBottom: 12 }}>
        {METRICS.map((metric, i) => (
          <RatingBar
            key={metric}
            label={metric}
            value={func[['speed', 'distribution', 'security', 'simplicity'][i] as keyof typeof func] as number}
            maxValue={5}
            color={func.color}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

export const HashFunctionComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const selectedIndex = Math.floor(frame / 150) % HASH_FUNCTIONS.length;
  const showRadar = frame >= 90 && frame < 510;
  const showCards = frame >= 90;

  const selectedFunc = HASH_FUNCTIONS[selectedIndex];

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="哈希函数对比"
          subtitle="速度、分布、安全性、简洁性"
        />
      </Sequence>

      {/* 第二段: 雷达图展示 */}
      <Sequence from={90} durationInFrames={420}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: 'white', marginBottom: 32 }}>哈希函数特性对比</h2>

          <div style={{ display: 'flex', gap: 48, justifyContent: 'center', alignItems: 'flex-start' }}>
            {/* 左侧: 雷达图 */}
            <div style={{ flex: '0 0 auto' }}>
              {showRadar && (
                <RadarChart
                  data={{
                    name: selectedFunc.name,
                    values: [
                      selectedFunc.speed,
                      selectedFunc.distribution,
                      selectedFunc.security,
                      selectedFunc.simplicity,
                    ],
                    color: selectedFunc.color,
                    desc: selectedFunc.desc,
                  }}
                  size={400}
                  opacity={1}
                />
              )}
            </div>

            {/* 右侧: 函数列表 */}
            <div style={{ flex: '1', maxWidth: 500 }}>
              {HASH_FUNCTIONS.map((func, i) => (
                <HashFunctionCard
                  key={func.name}
                  func={func}
                  index={i}
                  isSelected={i === selectedIndex}
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 总结 */}
      <Sequence from={510} durationInFrames={90}>
        <SceneNarrator
          title="选择合适的哈希函数"
          subtitle="Redis 默认使用 SipHash 平衡所有指标"
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export default HashFunctionComparison;

/**
 * MemoryvsSpeed
 * 视频时长: 10秒 (300帧 @ 30fps)
 * 内存使用vs速度权衡 - 展示内存使用和速度之间的权衡关系
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const TOTAL_FRAMES = 300;

function MemorySpeedChart() {
  const frame = useCurrentFrame();

  // 负载因子从0.1到2.0
  const loadFactors = [0.1, 0.3, 0.5, 0.7, 1.0, 1.3, 1.5, 1.7, 2.0];
  const memoryUsage = loadFactors.map(lf => lf * 50); // 内存使用 (MB)
  const speedScore = loadFactors.map(lf => Math.max(10, 100 - lf * 45)); // 速度分数

  const activeIndex = Math.min(loadFactors.length - 1, Math.floor(frame / 25));

  return (
    <div style={{ position: 'relative', height: 250, marginTop: 24 }}>
      {/* Y轴标签 */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 30, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 10, color: '#a0a0a0' }}>100</div>
        <div style={{ fontSize: 10, color: '#a0a0a0' }}>75</div>
        <div style={{ fontSize: 10, color: '#a0a0a0' }}>50</div>
        <div style={{ fontSize: 10, color: '#a0a0a0' }}>25</div>
        <div style={{ fontSize: 10, color: '#a0a0a0' }}>0</div>
      </div>

      {/* 图表区域 */}
      <div style={{ marginLeft: 30, position: 'relative', height: 200 }}>
        {/* 网格线 */}
        {[0, 25, 50, 75, 100].map(val => (
          <div
            key={val}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${100 - val}%`,
              borderTop: '1px dashed #333',
            }}
          />
        ))}

        {/* 内存使用线 (蓝色) */}
        <svg
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
        >
          <polyline
            fill="none"
            stroke={colors.primary}
            strokeWidth="3"
            points={loadFactors
              .map((lf, i) => {
                const x = (i / (loadFactors.length - 1)) * 400;
                const y = 200 - (memoryUsage[i] / 100) * 200;
                return `${x},${y}`;
              })
              .join(' ')}
          />
        </svg>

        {/* 速度分数线 (绿色) */}
        <svg
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
        >
          <polyline
            fill="none"
            stroke={colors.success}
            strokeWidth="3"
            points={loadFactors
              .map((lf, i) => {
                const x = (i / (loadFactors.length - 1)) * 400;
                const y = 200 - (speedScore[i] / 100) * 200;
                return `${x},${y}`;
              })
              .join(' ')}
          />
        </svg>

        {/* 数据点 */}
        {loadFactors.map((lf, i) => {
          const x = (i / (loadFactors.length - 1)) * 100;
          const memY = 200 - (memoryUsage[i] / 100) * 200;
          const spdY = 200 - (speedScore[i] / 100) * 200;
          const isActive = i === activeIndex;

          return (
            <React.Fragment key={i}>
              {/* 内存点 */}
              <div
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: memY,
                  width: isActive ? 12 : 8,
                  height: isActive ? 12 : 8,
                  background: colors.primary,
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  border: isActive ? `2px solid white` : 'none',
                }}
              />
              {/* 速度点 */}
              <div
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: spdY,
                  width: isActive ? 12 : 8,
                  height: isActive ? 12 : 8,
                  background: colors.success,
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  border: isActive ? `2px solid white` : 'none',
                }}
              />
            </React.Fragment>
          );
        })}
      </div>

      {/* X轴标签 */}
      <div style={{ marginLeft: 30, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#a0a0a0' }}>
        {loadFactors.map((lf, i) => (
          <div
            key={i}
            style={{
              width: 40,
              textAlign: 'center',
              color: i === activeIndex ? colors.warning : '#a0a0a0',
              fontWeight: i === activeIndex ? 'bold' : 'normal',
            }}
          >
            {lf.toFixed(1)}
          </div>
        ))}
      </div>

      {/* 图例 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 3, background: colors.primary }} />
          <span style={{ fontSize: 14, color: '#a0a0a0' }}>内存使用 (MB)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 3, background: colors.success }} />
          <span style={{ fontSize: 14, color: '#a0a0a0' }}>速度分数</span>
        </div>
      </div>
    </div>
  );
}

function TradeoffSlider() {
  const frame = useCurrentFrame();
  const loadFactor = interpolate(frame, [0, 300], [0.1, 2.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const memoryMB = (loadFactor * 64).toFixed(1);
  const speedPercent = Math.max(10, 100 - loadFactor * 45).toFixed(0);
  const collisionRisk = loadFactor > 1.0 ? '高' : loadFactor > 0.75 ? '中' : '低';

  return (
    <div style={{ marginTop: 32, padding: 24, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 12 }}>
      <div style={{ fontSize: 18, color: colors.primary, marginBottom: 16, textAlign: 'center' }}>
        负载因子调节: {loadFactor.toFixed(2)}
      </div>

      {/* 滑块 */}
      <div style={{ marginBottom: 24 }}>
        <input
          type="range"
          min="0.1"
          max="2.0"
          step="0.1"
          value={loadFactor}
          style={{
            width: '100%',
            height: 8,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${colors.success} 0%, ${colors.warning} 66%, ${colors.danger} 100%)`,
            outline: 'none',
            cursor: 'pointer',
          }}
          readOnly
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666', marginTop: 4 }}>
          <span>0.1 (省内存)</span>
          <span>1.0 (平衡)</span>
          <span>2.0 (高性能下降)</span>
        </div>
      </div>

      {/* 指标 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div style={{ textAlign: 'center', padding: 16, background: 'rgba(33, 150, 243, 0.2)', borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#a0a0a0' }}>内存使用</div>
          <div style={{ fontSize: 28, color: colors.primary, fontWeight: 'bold' }}>{memoryMB} MB</div>
        </div>
        <div style={{ textAlign: 'center', padding: 16, background: 'rgba(76, 175, 80, 0.2)', borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#a0a0a0' }}>速度分数</div>
          <div style={{ fontSize: 28, color: colors.success, fontWeight: 'bold' }}>{speedPercent}%</div>
        </div>
        <div style={{ textAlign: 'center', padding: 16, background: 'rgba(255, 152, 0, 0.2)', borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#a0a0a0' }}>冲突风险</div>
          <div
            style={{
              fontSize: 28,
              color: collisionRisk === '高' ? colors.danger : collisionRisk === '中' ? colors.warning : colors.success,
              fontWeight: 'bold',
            }}
          >
            {collisionRisk}
          </div>
        </div>
      </div>
    </div>
  );
}

function Recommendation() {
  const frame = useCurrentFrame();
  const show = frame > 220;

  if (!show) return null;

  const opacity = interpolate(frame, [220, 240], [0, 1], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        marginTop: 24,
        padding: 24,
        background: 'rgba(76, 175, 80, 0.2)',
        border: `2px solid ${colors.success}`,
        borderRadius: 12,
        opacity,
      }}
    >
      <div style={{ fontSize: 20, color: colors.success, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 }}>
        最佳实践建议
      </div>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        <div
          style={{
            padding: 16,
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 8,
            textAlign: 'center',
            flex: 1,
          }}
        >
          <div style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 4 }}>日常使用</div>
          <div style={{ fontSize: 18, color: colors.success, fontWeight: 'bold' }}>LF = 1.0</div>
          <div style={{ fontSize: 12, color: '#666' }}>Redis 默认值</div>
        </div>
        <div
          style={{
            padding: 16,
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 8,
            textAlign: 'center',
            flex: 1,
          }}
        >
          <div style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 4 }}>内存敏感</div>
          <div style={{ fontSize: 18, color: colors.primary, fontWeight: 'bold' }}>LF = 0.5</div>
          <div style={{ fontSize: 12, color: '#666' }}>节省内存</div>
        </div>
        <div
          style={{
            padding: 16,
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 8,
            textAlign: 'center',
            flex: 1,
          }}
        >
          <div style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 4 }}>性能敏感</div>
          <div style={{ fontSize: 18, color: colors.warning, fontWeight: 'bold' }}>LF {'<'} 0.75</div>
          <div style={{ fontSize: 12, color: '#666' }}>更高性能</div>
        </div>
      </div>
    </div>
  );
}

function AnimatedComponent() {
  const frame = useCurrentFrame();

  return (
    <div style={{ padding: 48 }}>
      <h2 style={{ fontSize: 36, color: colors.warning, textAlign: 'center', marginBottom: 8 }}>
        内存使用 vs 速度权衡
      </h2>
      <p style={{ fontSize: 20, color: '#a0a0a0', textAlign: 'center', marginBottom: 24 }}>
        负载因子越低，内存占用越高但速度越快
      </p>

      <MemorySpeedChart />
      <TradeoffSlider />
      <Recommendation />
    </div>
  );
}

export const MemoryvsSpeed: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <SceneNarrator
          title="内存与速度"
          subtitle="哈希表的经典权衡"
        />
      </Sequence>
      <Sequence from={60} durationInFrames={TOTAL_FRAMES - 60}>
        <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <AnimatedComponent />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default MemoryvsSpeed;

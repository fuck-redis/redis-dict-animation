/**
 * 性能优化建议
 * 视频时长: 55秒 (1650帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const FPS = 30;
const TOTAL_FRAMES = 1650; // 55秒

const OPTIMIZATIONS = [
  {
    icon: '🎯',
    title: '合理设置初始大小',
    desc: '根据预期数据量设置初始大小，避免频繁 rehash。通常设置为预期量的 1.5-2 倍。',
    code: 'initialSize = nextPower(expectedCount * 2)',
  },
  {
    icon: '⚖️',
    title: '监控负载因子',
    desc: '定期检查负载因子，在达到 0.75 时开始准备 rehash，不要等到超过 1.0。',
    code: 'if (loadFactor > 0.75) prepareRehash()',
  },
  {
    icon: '🔄',
    title: '利用渐进式 Rehash',
    desc: "Redis 的渐进式 rehash 确保了无阻塞操作，但在高负载时可能需要调整批量大小。",
    code: 'rehashBatchSize = min(used / 100, 100)',
  },
  {
    icon: '🔐',
    title: '使用安全哈希函数',
    desc: '生产环境必须使用 SipHash 等抗攻击哈希函数，防止哈希洪水攻击。',
    code: 'hashFunc = SipHash // 防御恶意输入',
  },
  {
    icon: '📊',
    title: '定期清理过期数据',
    desc: '及时清理不再使用的键，避免哈希表无限增长，保持合理的负载因子。',
    code: 'expireUnusedKeys() // 定期执行',
  },
  {
    icon: '⚡',
    title: '避免大键值对',
    desc: '过大的 value 会影响内存和 rehash 性能，考虑拆分或使用其他数据结构。',
    code: 'maxValueSize = 10KB // 建议上限',
  },
];

function OptimizationCard({ item, index }: { item: typeof OPTIMIZATIONS[0]; index: number }) {
  const frame = useCurrentFrame();
  const delay = index * 40;
  const opacity = interpolate(Math.max(0, frame - delay), [0, 20], [0, 1], { extrapolateLeft: 'clamp' });
  const translateX = interpolate(Math.max(0, frame - delay), [0, 20], [-20, 0], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        display: 'flex',
        gap: 20,
        padding: 20,
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        marginBottom: 16,
        opacity,
        transform: `translateX(${translateX}px)`,
      }}
    >
      <span style={{ fontSize: 36 }}>{item.icon}</span>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: 20, color: 'white' }}>{item.title}</h3>
        <p style={{ margin: '8px 0 12px 0', fontSize: 14, color: '#a0a0a0' }}>{item.desc}</p>
        <div
          style={{
            padding: '8px 12px',
            background: '#1e1e1e',
            borderRadius: 4,
            fontFamily: "'Courier New', monospace",
            fontSize: 13,
            color: '#4caf50',
          }}
        >
          {item.code}
        </div>
      </div>
    </div>
  );
}

export const OptimizationTips: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="性能优化"
          subtitle="最佳实践建议"
        />
      </Sequence>

      {/* 第二段: 优化建议列表 */}
      <Sequence from={90} durationInFrames={1560}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: 'white', marginBottom: 32 }}>Redis Dict 优化最佳实践</h2>
          {OPTIMIZATIONS.map((item, i) => (
            <OptimizationCard key={i} item={item} index={i} />
          ))}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default OptimizationTips;

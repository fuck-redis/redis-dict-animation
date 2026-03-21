/**
 * 安全 vs 非安全迭代器
 * 视频时长: 60秒 (1800帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const FPS = 30;
const TOTAL_FRAMES = 1800; // 60秒

function SafeIteratorDemo() {
  const frame = useCurrentFrame();
  const phase = Math.floor(frame / 90) % 3;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: '#4caf50', marginBottom: 24 }}>🛡️ 安全迭代器 (Safe Iterator)</h2>

      <div
        style={{
          padding: 24,
          background: 'rgba(76, 175, 80, 0.1)',
          border: '2px solid #4caf50',
          borderRadius: 12,
          marginBottom: 24,
        }}
      >
        <p style={{ color: 'white', margin: 0, fontSize: 16 }}>
          安全迭代器在迭代期间<strong style={{ color: '#4caf50' }}>禁止触发 rehash</strong>。
          迭代器持有 <code>dict-&gt;iterators</code> 计数，当计数大于 0 时，
          任何会触发 rehash 的操作都会被推迟。
        </p>
      </div>

      <div
        style={{
          background: '#1e1e1e',
          borderRadius: 8,
          padding: 20,
          fontFamily: "'Courier New', monospace",
          fontSize: 14,
          marginBottom: 24,
        }}
      >
        <div style={{ color: '#6a9955' }}>// 安全迭代器的工作原理</div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>
          de = dictNext(&iter);
          <span style={{ color: '#4ec9b0' }}> // iterators++ (现在是1)</span>
        </div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>while (de) {'{'}</div>
        <div style={{ color: '#6a9955', paddingLeft: 20, marginTop: 8 }}>
          // 此时任何 dictAdd/dictDelete 都不会触发 rehash
        </div>
        <div style={{ color: '#dcdcaa', paddingLeft: 20, marginTop: 8 }}>process(de);</div>
        <div style={{ color: '#dcdcaa', paddingLeft: 20, marginTop: 8 }}>de = dictNext(&iter);</div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>{'}'}</div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>
          dictReleaseIterator(&iter);
          <span style={{ color: '#4ec9b0' }}> // iterators-- (现在是0)</span>
        </div>
        <div style={{ color: '#6a9955', paddingLeft: 20, marginTop: 8 }}>
          // rehash 可以继续了
        </div>
      </div>

      {phase >= 2 && (
        <div
          style={{
            padding: 16,
            background: 'rgba(76, 175, 80, 0.2)',
            border: '2px solid #4caf50',
            borderRadius: 8,
            color: 'white',
          }}
        >
          ✅ 迭代过程中元素完整遍历，不会遗漏
        </div>
      )}
    </div>
  );
}

function UnsafeIteratorDemo() {
  const frame = useCurrentFrame();
  const showWarning = frame >= 180;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: '#ff9800', marginBottom: 24 }}>⚠️ 非安全迭代器 (Unsafe Iterator)</h2>

      <div
        style={{
          padding: 24,
          background: 'rgba(255, 152, 0, 0.1)',
          border: '2px solid #ff9800',
          borderRadius: 12,
          marginBottom: 24,
        }}
      >
        <p style={{ color: 'white', margin: 0, fontSize: 16 }}>
          非安全迭代器在迭代期间<strong style={{ color: '#ff9800' }}>不增加 iterators 计数</strong>，
          因此 rehash 仍可能发生。迭代器必须快速完成，避免在 rehash 期间长时间持有。
        </p>
      </div>

      <div
        style={{
          background: '#1e1e1e',
          borderRadius: 8,
          padding: 20,
          fontFamily: "'Courier New', monospace",
          fontSize: 14,
          marginBottom: 24,
        }}
      >
        <div style={{ color: '#6a9955' }}>// 非安全迭代器的工作原理</div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>
          de = dictNext(&iter);
          <span style={{ color: '#f44336' }}> // iterators 仍然是0！</span>
        </div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>while (de) {'{'}</div>
        <div style={{ color: '#6a9955', paddingLeft: 20, marginTop: 8 }}>
          // 如果此时发生 rehash...
        </div>
        <div style={{ color: '#6a9955', paddingLeft: 20, marginTop: 8 }}>
          // 同一元素可能被重复访问，或被遗漏
        </div>
        <div style={{ color: '#dcdcaa', paddingLeft: 20, marginTop: 8 }}>process(de);</div>
        <div style={{ color: '#dcdcaa', paddingLeft: 20, marginTop: 8 }}>de = dictNext(&iter);</div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>{'}'}</div>
      </div>

      {showWarning && (
        <div
          style={{
            padding: 16,
            background: 'rgba(244, 67, 54, 0.2)',
            border: '2px solid #f44336',
            borderRadius: 8,
            color: 'white',
          }}
        >
          ⚠️ 迭代期间可能发生 rehash，可能出现元素遗漏或重复
        </div>
      )}
    </div>
  );
}

function ComparisonTable() {
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
            <th style={{ padding: 16, textAlign: 'left', color: '#a0a0a0' }}>特性</th>
            <th style={{ padding: 16, textAlign: 'left', color: '#4caf50' }}>安全迭代器</th>
            <th style={{ padding: 16, textAlign: 'left', color: '#ff9800' }}>非安全迭代器</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['迭代器计数', '增加', '不增加'],
            ['Rehash 安全', '完全安全', '不安全'],
            ['元素重复', '不重复', '可能重复'],
            ['性能影响', '可能有延迟', '较小'],
            ['使用场景', '需要修改数据', '只读遍历'],
          ].map(([feature, safe, unsafe], i) => (
            <tr key={i} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <td style={{ padding: 16, color: '#a0a0a0' }}>{feature}</td>
              <td style={{ padding: 16, color: '#4caf50' }}>{safe}</td>
              <td style={{ padding: 16, color: '#ff9800' }}>{unsafe}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const SafeVsUnsafe: React.FC = () => {
  const frame = useCurrentFrame();
  const section = Math.floor(frame / 480);

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="迭代器类型"
          subtitle="安全 vs 非安全"
        />
      </Sequence>

      {/* 第二段: 安全迭代器 */}
      <Sequence from={90} durationInFrames={540}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <SafeIteratorDemo />
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 非安全迭代器 */}
      <Sequence from={630} durationInFrames={540}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <UnsafeIteratorDemo />
        </AbsoluteFill>
      </Sequence>

      {/* 第四段: 对比表格 */}
      <Sequence from={1170} durationInFrames={630}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: 'white', marginBottom: 32 }}>对比总结</h2>
          <ComparisonTable />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default SafeVsUnsafe;

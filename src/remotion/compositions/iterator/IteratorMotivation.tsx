/**
 * IteratorMotivation - 为什么需要迭代器
 * 视频时长: 20秒 (600帧 @ 30fps)
 * 内容: 展示3个需要迭代器的原因：1) 遍历所有条目 2) 并发修改问题 3) 迭代器安全机制
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const FPS = 30;
const TOTAL_FRAMES = 600; // 20秒

// 原因1: 遍历所有条目
function Reason1Traverse() {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e94560, #ff6b6b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          1
        </div>
        <div>
          <h2 style={{ color: '#e94560', margin: 0 }}>需要遍历所有条目</h2>
          <p style={{ color: '#888', margin: '4px 0 0 0', fontSize: 14 }}>
            KEYS, SCAN, FLUSHDB 等命令需要访问字典中的每一个条目
          </p>
        </div>
      </div>

      {/* 字典可视化 */}
      <div
        style={{
          background: '#0d0d0d',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <div style={{ color: '#888', fontSize: 12, marginBottom: 16 }}>字典结构</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              style={{
                width: 60,
                height: 60,
                background: 'rgba(33, 150, 243, 0.1)',
                border: '2px solid #2196f3',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2196f3',
                fontFamily: "'Courier New', monospace",
                fontSize: 11,
                opacity: interpolate(frame, [0, 50], [0.3, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              }}
            >
              bucket[{i}]
            </div>
          ))}
        </div>

        {/* 遍历指示器 */}
        <div style={{ position: 'relative', height: 40 }}>
          <div
            style={{
              position: 'absolute',
              left: `${progress * 100}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 24,
              height: 24,
              background: '#e94560',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 12,
              fontWeight: 'bold',
              boxShadow: '0 0 20px rgba(233, 69, 96, 0.5)',
              transition: 'left 0.1s linear',
            }}
          >
            cursor
          </div>
          <div
            style={{
              position: 'absolute',
              left: `${progress * 100}%`,
              top: 0,
              transform: 'translateX(-50%)',
              width: 2,
              height: 12,
              background: '#e94560',
              opacity: 0.5,
            }}
          />
        </div>
      </div>

      <div
        style={{
          padding: 16,
          background: 'rgba(233, 69, 96, 0.1)',
          border: '2px solid #e94560',
          borderRadius: 8,
        }}
      >
        <p style={{ color: 'white', margin: 0, fontSize: 14 }}>
          <strong style={{ color: '#e94560' }}>问题:</strong> 如何系统地访问哈希表中的每一个元素？
        </p>
      </div>
    </div>
  );
}

// 原因2: 并发修改问题
function Reason2ConcurrentModification() {
  const frame = useCurrentFrame();
  const showProblem = frame >= 100;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff9800, #ffc107)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          2
        </div>
        <div>
          <h2 style={{ color: '#ff9800', margin: 0 }}>并发修改问题</h2>
          <p style={{ color: '#888', margin: '4px 0 0 0', fontSize: 14 }}>
            迭代过程中如果发生 rehash，会导致元素遗漏或重复
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* 问题示意 */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              background: '#0d0d0d',
              borderRadius: 12,
              padding: 20,
              height: 180,
            }}
          >
            <div style={{ color: '#f44336', fontSize: 14, fontWeight: 'bold', marginBottom: 12 }}>
              问题场景
            </div>
            <div
              style={{
                background: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid #f44336',
                borderRadius: 8,
                padding: 12,
                fontFamily: "'Courier New', monospace",
                fontSize: 12,
                color: '#d4d4d4',
              }}
            >
              <div>// 迭代进行中...</div>
              <div style={{ color: '#dcdcaa', marginTop: 8 }}>de = dictNext(&iter);</div>
              <div style={{ marginTop: 8 }}>
                // 此时另一个线程调用 dictDelete
                <span style={{ color: '#f44336' }}> -&gt; 触发 rehash!</span>
              </div>
              <div style={{ color: '#dcdcaa', marginTop: 8 }}>process(de);</div>
            </div>
          </div>
        </div>

        {/* 问题结果 */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              background: '#0d0d0d',
              borderRadius: 12,
              padding: 20,
              height: 180,
            }}
          >
            <div style={{ color: '#ffc107', fontSize: 14, fontWeight: 'bold', marginBottom: 12 }}>
              可能发生的问题
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  padding: 12,
                  background: 'rgba(244, 67, 54, 0.1)',
                  border: '1px solid #f44336',
                  borderRadius: 6,
                }}
              >
                <span style={{ color: '#f44336' }}>元素遗漏</span>
                <div style={{ color: '#888', fontSize: 11, marginTop: 4 }}>
                  元素被迁移到新表，遍历时访问不到
                </div>
              </div>
              <div
                style={{
                  padding: 12,
                  background: 'rgba(255, 152, 0, 0.1)',
                  border: '1px solid #ff9800',
                  borderRadius: 6,
                }}
              >
                <span style={{ color: '#ff9800' }}>元素重复</span>
                <div style={{ color: '#888', fontSize: 11, marginTop: 4 }}>
                  同一元素被多次访问
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showProblem && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: 'rgba(244, 67, 54, 0.1)',
            border: '2px solid #f44336',
            borderRadius: 8,
          }}
        >
          <p style={{ color: 'white', margin: 0, fontSize: 13 }}>
            <strong style={{ color: '#f44336' }}>核心问题:</strong> 迭代器的当前状态与字典的实际状态可能不一致
          </p>
        </div>
      )}
    </div>
  );
}

// 原因3: 迭代器安全机制
function Reason3SafetyMechanism() {
  const frame = useCurrentFrame();
  const showMechanism = frame >= 80;
  const counterValue = showMechanism ? 1 : 0;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4caf50, #81c784)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          3
        </div>
        <div>
          <h2 style={{ color: '#4caf50', margin: 0 }}>迭代器安全机制</h2>
          <p style={{ color: '#888', margin: '4px 0 0 0', fontSize: 14 }}>
            通过 iterators 计数器防止 rehash，保证遍历一致性
          </p>
        </div>
      </div>

      {/* iterators 计数器可视化 */}
      <div
        style={{
          background: '#0d0d0d',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', gap: 48, justifyContent: 'center', alignItems: 'center' }}>
          {/* 字典 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>dict</div>
            <div
              style={{
                width: 100,
                height: 100,
                background: 'rgba(33, 150, 243, 0.1)',
                border: '2px solid #2196f3',
                borderRadius: 12,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ color: '#2196f3', fontSize: 11 }}>ht[0]</div>
              <div style={{ color: '#2196f3', fontSize: 11 }}>ht[1]</div>
            </div>
          </div>

          {/* iterators 计数器 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>iterators</div>
            <div
              style={{
                width: 80,
                height: 80,
                background: showMechanism ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: `3px solid ${showMechanism ? '#4caf50' : '#444'}`,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                fontWeight: 'bold',
                color: showMechanism ? '#4caf50' : '#666',
                transition: 'all 0.3s ease',
              }}
            >
              {counterValue}
            </div>
          </div>

          {/* 迭代器 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>iterator</div>
            <div
              style={{
                width: 100,
                height: 100,
                background: showMechanism ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.1)',
                border: `2px solid ${showMechanism ? '#4caf50' : '#ff9800'}`,
                borderRadius: 12,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                color: showMechanism ? '#4caf50' : '#ff9800',
              }}
            >
              <div>safe={showMechanism ? '1' : '0'}</div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 20,
            padding: 12,
            background: showMechanism ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 255, 255, 0.02)',
            border: `2px solid ${showMechanism ? '#4caf50' : '#444'}`,
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <div style={{ color: showMechanism ? '#4caf50' : '#666', fontSize: 14 }}>
            {showMechanism
              ? 'iterators > 0 时，rehash 被暂停'
              : 'iterators = 0 时，rehash 可以进行'}
          </div>
        </div>
      </div>

      {/* 代码示例 */}
      <div
        style={{
          background: '#1e1e1e',
          borderRadius: 8,
          padding: 16,
          fontFamily: "'Courier New', monospace",
          fontSize: 12,
        }}
      >
        <div style={{ color: '#6a9955' }}>// 安全迭代器获取</div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>
          iter = dictGetSafeIterator(d);
          <span style={{ color: '#4caf50' }}> // dict-&gt;iterators++</span>
        </div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>
          <span style={{ color: '#6a9955' }}>// ... 遍历过程 ...</span>
        </div>
        <div style={{ color: '#d4d4d4', marginTop: 8 }}>
          dictReleaseIterator(iter);
          <span style={{ color: '#4caf50' }}> // dict-&gt;iterators--</span>
        </div>
      </div>
    </div>
  );
}

export const IteratorMotivation: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="为什么需要迭代器?"
          subtitle="遍历、安全与一致性"
        />
      </Sequence>

      {/* 原因1: 遍历所有条目 */}
      <Sequence from={90} durationInFrames={165}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1f3d 100%)',
            padding: 48,
          }}
        >
          <Reason1Traverse />
        </AbsoluteFill>
      </Sequence>

      {/* 原因2: 并发修改问题 */}
      <Sequence from={255} durationInFrames={165}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #2e2520 100%)',
            padding: 48,
          }}
        >
          <Reason2ConcurrentModification />
        </AbsoluteFill>
      </Sequence>

      {/* 原因3: 迭代器安全机制 */}
      <Sequence from={420} durationInFrames={180}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #1f2e1f 100%)',
            padding: 48,
          }}
        >
          <Reason3SafetyMechanism />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default IteratorMotivation;

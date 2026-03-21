/**
 * DictIteratorStructure - 迭代器数据结构可视化
 * 视频时长: 20秒 (600帧 @ 30fps)
 * 内容: 可视化 dictIterator 结构体的所有字段
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const FPS = 30;
const TOTAL_FRAMES = 600; // 20秒

// 结构体字段类型
interface IteratorField {
  name: string;
  type: string;
  description: string;
  color: string;
}

// 迭代器字段定义
const iteratorFields: IteratorField[] = [
  {
    name: 'dict *d',
    type: 'dict*',
    description: '指向所属字典的指针',
    color: '#2196f3',
  },
  {
    name: 'long index',
    type: 'long',
    description: '当前遍历的桶索引',
    color: '#ff9800',
  },
  {
    name: 'int table',
    type: 'int',
    description: '当前遍历的哈希表 (0 或 1)',
    color: '#9c27b0',
  },
  {
    name: 'int safe',
    type: 'int',
    description: '是否为安全迭代器 (1=安全, 0=非安全)',
    color: '#4caf50',
  },
  {
    name: 'dictEntry *entry',
    type: 'dictEntry*',
    description: '当前遍历到的节点',
    color: '#e94560',
  },
  {
    name: 'dictEntry *nextEntry',
    type: 'dictEntry*',
    description: '下一个节点 (防止 rehash 时丢失)',
    color: '#00bcd4',
  },
];

// 结构体可视化组件
function StructureVisualization() {
  const frame = useCurrentFrame();
  const showFields = frame >= 80;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 8 }}>dictIterator 结构体</h2>
      <p style={{ color: '#888', marginBottom: 32, fontSize: 14 }}>
        迭代器维护遍历过程中的所有状态信息
      </p>

      <div style={{ display: 'flex', gap: 32 }}>
        {/* 结构体图示 */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              background: '#0d0d0d',
              borderRadius: 12,
              padding: 20,
              border: '2px solid #333',
            }}
          >
            <div
              style={{
                padding: '8px 16px',
                background: 'rgba(233, 69, 96, 0.2)',
                border: '2px solid #e94560',
                borderRadius: '8px 8px 0 0',
                color: '#e94560',
                fontWeight: 'bold',
                fontSize: 16,
                textAlign: 'center',
              }}
            >
              dictIterator
            </div>

            <div
              style={{
                border: '2px solid #333',
                borderTop: 'none',
                borderRadius: '0 0 8px 8px',
                overflow: 'hidden',
              }}
            >
              {iteratorFields.map((field, index) => {
                const isVisible = frame >= 80 + index * 30;
                const fieldProgress = isVisible
                  ? interpolate(frame - 80 - index * 30, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
                  : 0;

                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                      borderBottom: index < iteratorFields.length - 1 ? '1px solid #222' : 'none',
                      opacity: isVisible ? 1 : 0.3,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: field.color,
                        marginRight: 12,
                        boxShadow: isVisible ? `0 0 10px ${field.color}80` : 'none',
                        transform: isVisible ? `scale(${0.5 + fieldProgress * 0.5})` : 'scale(0.5)',
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: "'Courier New', monospace",
                          fontSize: 13,
                          color: field.color,
                          opacity: fieldProgress,
                        }}
                      >
                        {field.name}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: '#666',
                        opacity: fieldProgress,
                      }}
                    >
                      {field.type}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 字段说明 */}
        <div style={{ flex: 1 }}>
          <div style={{ color: '#888', fontSize: 12, marginBottom: 16 }}>字段说明:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {iteratorFields.map((field, index) => {
              const isVisible = frame >= 100 + index * 30;
              return (
                <div
                  key={index}
                  style={{
                    padding: 12,
                    background: isVisible ? `${field.color}15` : 'rgba(255,255,255,0.02)',
                    border: `2px solid ${isVisible ? field.color : '#333'}`,
                    borderRadius: 8,
                    opacity: isVisible ? 1 : 0.5,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      color: isVisible ? field.color : '#666',
                      fontWeight: 'bold',
                      fontSize: 13,
                      fontFamily: "'Courier New', monospace",
                    }}
                  >
                    {field.name}
                  </div>
                  <div
                    style={{
                      color: '#888',
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    {field.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// nextEntry 作用演示
function NextEntryDemo() {
  const frame = useCurrentFrame();
  const showRehash = frame >= 150;
  const rehashProgress = showRehash ? interpolate(frame - 150, [0, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: '#00bcd4', marginBottom: 8 }}>nextEntry 的作用</h2>
      <p style={{ color: '#888', marginBottom: 32, fontSize: 14 }}>
        保存下一个节点的引用，防止 rehash 时遍历链断裂
      </p>

      <div style={{ display: 'flex', gap: 32 }}>
        {/* 左侧：rehash 前 */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              padding: 12,
              background: 'rgba(33, 150, 243, 0.1)',
              border: '2px solid #2196f3',
              borderRadius: 8,
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            <span style={{ color: '#2196f3', fontWeight: 'bold' }}>Rehash 前</span>
          </div>

          <div
            style={{
              background: '#0d0d0d',
              borderRadius: 8,
              padding: 20,
            }}
          >
            {/* 桶 */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  background: 'rgba(33, 150, 243, 0.2)',
                  border: '2px solid #2196f3',
                  borderRadius: 6,
                  color: '#2196f3',
                  fontSize: 12,
                }}
              >
                bucket[2]
              </div>
            </div>

            {/* 链表 */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 60,
                  height: 50,
                  background: 'rgba(233, 69, 96, 0.2)',
                  border: '2px solid #e94560',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#e94560',
                  fontSize: 11,
                  fontFamily: "'Courier New', monospace",
                }}
              >
                entry A
              </div>
              <div style={{ color: '#666', fontSize: 16 }}>-&gt;</div>
              <div
                style={{
                  width: 60,
                  height: 50,
                  background: 'rgba(0, 188, 212, 0.2)',
                  border: '2px solid #00bcd4',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00bcd4',
                  fontSize: 11,
                  fontFamily: "'Courier New', monospace",
                }}
              >
                entry B
              </div>
              <div style={{ color: '#666', fontSize: 16 }}>-&gt;</div>
              <div
                style={{
                  width: 50,
                  height: 50,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid #333',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  fontSize: 11,
                }}
              >
                NULL
              </div>
            </div>

            <div style={{ marginTop: 16, padding: 8, background: 'rgba(0, 188, 212, 0.1)', borderRadius: 6 }}>
              <div style={{ color: '#00bcd4', fontSize: 11, fontFamily: "'Courier New', monospace" }}>
                iterator.entry = A
              </div>
              <div style={{ color: '#00bcd4', fontSize: 11, fontFamily: "'Courier New', monospace", marginTop: 4 }}>
                iterator.nextEntry = B
              </div>
            </div>
          </div>
        </div>

        {/* 中间箭头 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              padding: '20px 12px',
              background: showRehash ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              borderRadius: 8,
              color: showRehash ? '#ff9800' : '#666',
              fontSize: 24,
              transition: 'all 0.3s ease',
            }}
          >
            {showRehash ? '=&gt;' : '|'}
          </div>
        </div>

        {/* 右侧：rehash 后 */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              padding: 12,
              background: 'rgba(255, 152, 0, 0.1)',
              border: '2px solid #ff9800',
              borderRadius: 8,
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            <span style={{ color: '#ff9800', fontWeight: 'bold' }}>Rehash 后 (A 被迁移)</span>
          </div>

          <div
            style={{
              background: '#0d0d0d',
              borderRadius: 8,
              padding: 20,
              opacity: showRehash ? 1 : 0.5,
              transition: 'opacity 0.3s ease',
            }}
          >
            {/* ht[0] */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#666', fontSize: 11, marginBottom: 8 }}>ht[0]:</div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 60,
                    height: 50,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '2px solid #333',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    fontSize: 11,
                  }}
                >
                  NULL
                </div>
              </div>
            </div>

            {/* ht[1] */}
            <div>
              <div style={{ color: '#ff9800', fontSize: 11, marginBottom: 8 }}>ht[1]:</div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 60,
                    height: 50,
                    background: 'rgba(233, 69, 96, 0.2)',
                    border: `2px solid ${rehashProgress > 0.3 ? '#4caf50' : '#e94560'}`,
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: rehashProgress > 0.3 ? '#4caf50' : '#e94560',
                    fontSize: 11,
                    fontFamily: "'Courier New', monospace",
                    transition: 'border-color 0.3s ease',
                  }}
                >
                  entry A
                </div>
                <div style={{ color: '#666', fontSize: 16 }}>-&gt;</div>
                <div
                  style={{
                    width: 60,
                    height: 50,
                    background: 'rgba(0, 188, 212, 0.2)',
                    border: '2px solid #00bcd4',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00bcd4',
                    fontSize: 11,
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  entry B
                </div>
                <div style={{ color: '#666', fontSize: 16 }}>-&gt;</div>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '2px solid #333',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    fontSize: 11,
                  }}
                >
                  NULL
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 16,
                padding: 8,
                background: rehashProgress > 0.5 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                borderRadius: 6,
                transition: 'background 0.3s ease',
              }}
            >
              <div style={{ color: rehashProgress > 0.5 ? '#4caf50' : '#ff9800', fontSize: 11 }}>
                {rehashProgress > 0.5
                  ? '通过 nextEntry=B 继续遍历'
                  : 'entry 指向的节点已被迁移...'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showRehash && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            background: 'rgba(0, 188, 212, 0.1)',
            border: '2px solid #00bcd4',
            borderRadius: 8,
          }}
        >
          <p style={{ color: 'white', margin: 0, fontSize: 14 }}>
            <strong style={{ color: '#00bcd4' }}>关键点:</strong> nextEntry 保存了下一个节点的引用，
            即使当前节点在迭代过程中被 rehash 迁移到 ht[1]，我们仍然能通过 nextEntry 找到并访问后续节点。
          </p>
        </div>
      )}
    </div>
  );
}

// 迭代器状态机
function IteratorStateMachine() {
  const frame = useCurrentFrame();
  const states = ['初始化', '获取节点', '处理节点', '获取下一个', '释放迭代器'];
  const currentStateIndex = Math.min(Math.floor(frame / 40), states.length - 1);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 8 }}>迭代器状态流转</h2>
      <p style={{ color: '#888', marginBottom: 32, fontSize: 14 }}>
        迭代器在遍历过程中的状态变化
      </p>

      {/* 状态图 */}
      <div
        style={{
          background: '#0d0d0d',
          borderRadius: 12,
          padding: 32,
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {states.map((state, index) => {
            const isActive = index === currentStateIndex;
            const isPast = index < currentStateIndex;
            const isFuture = index > currentStateIndex;

            return (
              <React.Fragment key={index}>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: isActive
                        ? 'linear-gradient(135deg, #e94560, #ff6b6b)'
                        : isPast
                        ? 'rgba(76, 175, 80, 0.2)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: `3px solid ${isActive ? '#e94560' : isPast ? '#4caf50' : '#333'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isActive ? 'white' : isPast ? '#4caf50' : '#666',
                      fontWeight: 'bold',
                      fontSize: 12,
                      boxShadow: isActive ? '0 0 30px rgba(233, 69, 96, 0.4)' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {index + 1}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      color: isActive ? '#e94560' : isPast ? '#4caf50' : '#666',
                      fontWeight: isActive ? 'bold' : 'normal',
                    }}
                  >
                    {state}
                  </div>
                </div>
                {index < states.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: 3,
                      background: isPast ? '#4caf50' : '#333',
                      margin: '0 16px',
                      marginBottom: 32,
                      transition: 'background 0.3s ease',
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 当前状态说明 */}
      <div
        style={{
          padding: 20,
          background: 'rgba(233, 69, 96, 0.1)',
          border: '2px solid #e94560',
          borderRadius: 8,
        }}
      >
        <div style={{ color: '#e94560', fontWeight: 'bold', marginBottom: 8 }}>
          当前状态: {states[currentStateIndex]}
        </div>
        <div style={{ color: '#a0a0a0', fontSize: 13 }}>
          {currentStateIndex === 0 && 'dictGetSafeIterator() 创建迭代器，dict->iterators++'}
          {currentStateIndex === 1 && 'dictNext() 获取当前 entry，保存 nextEntry 以防 rehash'}
          {currentStateIndex === 2 && '回调函数处理当前节点，此时 dictDelete 不会触发 rehash'}
          {currentStateIndex === 3 && 'dictNext() 通过 nextEntry 获取下一个节点'}
          {currentStateIndex === 4 && 'dictReleaseIterator() 释放迭代器，dict->iterators--'}
        </div>
      </div>
    </div>
  );
}

export const DictIteratorStructure: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="dictIterator 结构体"
          subtitle="迭代器的内部结构"
        />
      </Sequence>

      {/* 结构体可视化 */}
      <Sequence from={90} durationInFrames={200}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <StructureVisualization />
        </AbsoluteFill>
      </Sequence>

      {/* nextEntry 作用演示 */}
      <Sequence from={290} durationInFrames={180}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #1a2e2e 100%)',
            padding: 48,
          }}
        >
          <NextEntryDemo />
        </AbsoluteFill>
      </Sequence>

      {/* 迭代器状态机 */}
      <Sequence from={470} durationInFrames={130}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #2e1f2e 100%)',
            padding: 48,
          }}
        >
          <IteratorStateMachine />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default DictIteratorStructure;

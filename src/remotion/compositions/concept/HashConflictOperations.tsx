/**
 * 哈希冲突操作演示
 * 视频时长: 20秒 (600帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const TOTAL_FRAMES = 600;

function ChainNode({
  key,
  value,
  highlighted,
  isSearching,
  x,
  y,
  opacity = 1,
}: {
  key: string;
  value: string;
  highlighted: boolean;
  isSearching: boolean;
  x: number;
  y: number;
  opacity?: number;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `scale(${highlighted ? 1.1 : 1})`,
        opacity,
        transition: 'all 0.3s ease',
        padding: '16px 20px',
        background: isSearching
          ? 'rgba(255, 235, 59, 0.3)'
          : highlighted
          ? 'rgba(76, 175, 80, 0.3)'
          : 'rgba(255, 255, 255, 0.95)',
        border: `3px solid ${isSearching ? '#ffc107' : highlighted ? '#4caf50' : '#2196f3'}`,
        borderRadius: 10,
        minWidth: 140,
        boxShadow: highlighted ? '0 4px 20px rgba(76, 175, 80, 0.4)' : '0 2px 10px rgba(0,0,0,0.2)',
      }}
    >
      <div style={{ textAlign: 'center', fontFamily: "'Courier New', monospace" }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1565c0' }}>"{key}"</div>
        <div style={{ fontSize: 14, color: '#666', margin: '4px 0' }}>:</div>
        <div style={{ fontSize: 16, color: '#388e3c' }}>"{value}"</div>
      </div>
    </div>
  );
}

function Arrow({ x, y, direction = 'down' }: { x: number; y: number; direction?: 'down' | 'right' }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        color: '#4caf50',
        fontSize: 24,
        fontWeight: 'bold',
      }}
    >
      {direction === 'down' ? '↓' : '→'}
    </div>
  );
}

function InsertOperation() {
  const frame = useCurrentFrame();

  const phase = Math.floor(frame / 60);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 24 }}>插入操作 (头插法)</h2>
      <p style={{ color: '#a0a0a0', marginBottom: 32 }}>阶段 {phase + 1}/4: 演示如何插入新节点</p>

      <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 300, height: 300 }}>
          {/* 桶 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 80,
              width: 100,
              height: 60,
              background: 'rgba(33, 150, 243, 0.3)',
              border: '3px solid #2196f3',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            桶 2
          </div>

          {/* 链表 */}
          {phase >= 1 && (
            <>
              <ChainNode key="city" value="NYC" highlighted={false} isSearching={false} x={60} y={80} />
              <Arrow x={140} y={145} />
            </>
          )}
          {phase >= 2 && (
            <>
              <ChainNode key="name" value="Bob" highlighted={false} isSearching={false} x={60} y={160} />
              <Arrow x={140} y={225} />
            </>
          )}
          {phase >= 3 && (
            <>
              <ChainNode key="email" value="e@test.com" highlighted={true} isSearching={false} x={60} y={240} />
            </>
          )}
        </div>

        <div style={{ flex: 1 }}>
          {phase === 0 && (
            <div style={{ padding: 20, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 8, color: 'white' }}>
              <p style={{ fontSize: 18 }}>插入 "email" → "e@test.com"</p>
              <p style={{ marginTop: 16, color: '#a0a0a0' }}>h("email") = 5 % 4 = 2</p>
            </div>
          )}
          {phase === 1 && (
            <div style={{ padding: 20, background: 'rgba(76, 175, 80, 0.2)', borderRadius: 8, color: 'white' }}>
              <p style={{ color: '#4caf50', fontWeight: 'bold' }}>1. 找到桶 2，发现已有 city</p>
              <p style={{ marginTop: 8, color: '#a0a0a0' }}>遍历链表到末尾...</p>
            </div>
          )}
          {phase === 2 && (
            <div style={{ padding: 20, background: 'rgba(76, 175, 80, 0.2)', borderRadius: 8, color: 'white' }}>
              <p style={{ color: '#4caf50', fontWeight: 'bold' }}>2. 继续遍历，找到 name</p>
              <p style={{ marginTop: 8, color: '#a0a0a0' }}>name.next = NULL，说明是链尾</p>
            </div>
          )}
          {phase >= 3 && (
            <div style={{ padding: 20, background: 'rgba(76, 175, 80, 0.2)', borderRadius: 8, color: 'white' }}>
              <p style={{ color: '#4caf50', fontWeight: 'bold' }}>3. 将新节点插入到头部!</p>
              <p style={{ marginTop: 8, color: '#a0a0a0' }}>email.next = name (原头节点)</p>
              <p style={{ marginTop: 8, color: '#ff9800' }}>新头: email → name → city</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LookupOperation() {
  const frame = useCurrentFrame();

  const searchingIndex = Math.floor(frame / 40) % 4;
  const found = frame >= 160;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 24 }}>查找操作</h2>
      <p style={{ color: '#a0a0a0', marginBottom: 32 }}>在链表中查找 "name"</p>

      <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 300, height: 300 }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 80,
              width: 100,
              height: 60,
              background: 'rgba(33, 150, 243, 0.3)',
              border: '3px solid #2196f3',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            桶 2
          </div>

          <ChainNode
            key="email"
            value="e@test.com"
            highlighted={searchingIndex === 0}
            isSearching={searchingIndex === 0 && !found}
            x={60}
            y={80}
          />
          <Arrow x={140} y={145} />

          <ChainNode
            key="name"
            value="Bob"
            highlighted={found ? true : searchingIndex === 1}
            isSearching={searchingIndex === 1 && !found}
            x={60}
            y={160}
          />
          <Arrow x={140} y={225} />

          <ChainNode
            key="city"
            value="NYC"
            highlighted={false}
            isSearching={searchingIndex === 2}
            x={60}
            y={240}
          />
        </div>

        <div style={{ flex: 1 }}>
          {searchingIndex === 0 && !found && (
            <div style={{ padding: 20, background: 'rgba(255, 193, 7, 0.2)', borderRadius: 8, color: 'white' }}>
              <p style={{ color: '#ffc107', fontWeight: 'bold' }}>1. 检查 email</p>
              <p style={{ marginTop: 8, color: '#a0a0a0' }}>email ≠ name，继续遍历</p>
            </div>
          )}
          {searchingIndex === 1 && !found && (
            <div style={{ padding: 20, background: 'rgba(255, 193, 7, 0.2)', borderRadius: 8, color: 'white' }}>
              <p style={{ color: '#ffc107', fontWeight: 'bold' }}>2. 检查 name</p>
              <p style={{ marginTop: 8, color: '#a0a0a0' }}>name === name，找到!</p>
            </div>
          )}
          {found && (
            <div style={{ padding: 20, background: 'rgba(76, 175, 80, 0.2)', borderRadius: 8, color: 'white' }}>
              <p style={{ color: '#4caf50', fontWeight: 'bold' }}>查找成功!</p>
              <p style={{ marginTop: 8 }}>返回 name → "Bob"</p>
              <p style={{ marginTop: 8, color: '#a0a0a0' }}>时间复杂度: O(k)，k = 链长</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DeleteOperation() {
  const frame = useCurrentFrame();

  const phase = Math.floor(frame / 60);
  const deletedIndex = phase >= 2 ? 1 : -1;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 24 }}>删除操作</h2>
      <p style={{ color: '#a0a0a0', marginBottom: 32 }}>删除链表中 "name" 节点</p>

      <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 350, height: 320 }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 120,
              width: 100,
              height: 60,
              background: 'rgba(33, 150, 243, 0.3)',
              border: '3px solid #2196f3',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            桶 2
          </div>

          <ChainNode
            key="email"
            value="e@test.com"
            highlighted={phase === 1}
            isSearching={phase === 0}
            x={100}
            y={80}
          />
          <Arrow x={180} y={145} />

          {deletedIndex !== 1 ? (
            <ChainNode
              key="name"
              value="Bob"
              highlighted={phase === 1 || phase === 2}
              isSearching={phase === 0}
              x={100}
              y={160}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                left: 100,
                top: 160,
                padding: '16px 20px',
                background: 'rgba(244, 67, 54, 0.3)',
                border: '3px dashed #f44336',
                borderRadius: 10,
                minWidth: 140,
                opacity: 0.6,
              }}
            >
              <div style={{ textAlign: 'center', fontFamily: "'Courier New', monospace", color: '#f44336' }}>
                "name" : "Bob"
              </div>
            </div>
          )}
          <Arrow x={180} y={225} />

          <ChainNode
            key="city"
            value="NYC"
            highlighted={phase >= 3}
            isSearching={false}
            x={100}
            y={240}
          />

          {/* relink arrow */}
          {phase >= 3 && (
            <div
              style={{
                position: 'absolute',
                left: 260,
                top: 160,
                color: '#4caf50',
                fontSize: 20,
                fontWeight: 'bold',
              }}
            >
              ↷ relink
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          {phase === 0 && (
            <div style={{ padding: 20, background: 'rgba(255, 193, 7, 0.2)', borderRadius: 8, color: 'white' }}>
              <p style={{ color: '#ffc107', fontWeight: 'bold' }}>1. 找到要删除的节点 "name"</p>
              <p style={{ marginTop: 8, color: '#a0a0a0' }}>记录: prev = email, target = name</p>
            </div>
          )}
          {phase === 1 && (
            <div style={{ padding: 20, background: 'rgba(244, 67, 54, 0.2)', borderRadius: 8, color: 'white' }}>
              <p style={{ color: '#f44336', fontWeight: 'bold' }}>2. 标记删除目标</p>
              <p style={{ marginTop: 8, color: '#a0a0a0' }}>email.next = name.next (city)</p>
            </div>
          )}
          {phase >= 2 && (
            <div style={{ padding: 20, background: 'rgba(76, 175, 80, 0.2)', borderRadius: 8, color: 'white' }}>
              <p style={{ color: '#4caf50', fontWeight: 'bold' }}>3. 删除完成!</p>
              <p style={{ marginTop: 8 }}>新链: email → city</p>
              <p style={{ marginTop: 8, color: '#a0a0a0' }}>释放节点内存</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const HashConflictOperations: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="冲突链操作"
          subtitle="插入、查找、删除"
        />
      </Sequence>

      {/* 第二段: 插入操作 */}
      <Sequence from={90} durationInFrames={150}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <InsertOperation />
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 查找操作 */}
      <Sequence from={240} durationInFrames={180}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <LookupOperation />
        </AbsoluteFill>
      </Sequence>

      {/* 第四段: 删除操作 */}
      <Sequence from={420} durationInFrames={180}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <DeleteOperation />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default HashConflictOperations;

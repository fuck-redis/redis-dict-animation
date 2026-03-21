/**
 * 双表协同工作机制
 * 视频时长: 55秒 (1650帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const FPS = 30;
const TOTAL_FRAMES = 1650; // 55秒

function OperationDemo({ operation }: { operation: 'get' | 'set' | 'delete' }) {
  const frame = useCurrentFrame();
  const isRehashing = frame >= 60;

  const operationColors = {
    get: '#2196f3',
    set: '#4caf50',
    delete: '#f44336',
  };

  const operationNames = {
    get: '查询 (GET)',
    set: '插入 (SET)',
    delete: '删除 (DEL)',
  };

  return (
    <div
      style={{
        padding: 24,
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        border: `2px solid ${operationColors[operation]}`,
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: operationColors[operation],
          marginBottom: 20,
        }}
      >
        {operationNames[operation]} 操作
        {isRehashing && (
          <span style={{ fontSize: 14, color: '#ff9800', marginLeft: 12 }}>
            (Rehash 期间)
          </span>
        )}
      </div>

      {operation === 'get' && (
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 15 }}>
          <div style={{ color: '#a0a0a0', marginBottom: 12 }}>
            // 先查 ht[0]
          </div>
          <div style={{ color: 'white' }}>
            entry = dictFind(ht[0], key);
          </div>
          {isRehashing && (
            <>
              <div style={{ color: '#a0a0a0', marginTop: 12, marginBottom: 12 }}>
                // 未找到？再查 ht[1]
              </div>
              <div style={{ color: '#4caf50' }}>
                if (!entry && isRehashing()) {'{'}
              </div>
              <div style={{ color: '#4caf50', paddingLeft: 20 }}>
                entry = dictFind(ht[1], key);
              </div>
              <div style={{ color: '#4caf50' }}>{'}'}</div>
            </>
          )}
        </div>
      )}

      {operation === 'set' && (
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 15 }}>
          <div style={{ color: '#a0a0a0', marginBottom: 12 }}>
            // Rehash 期间直接写入 ht[1]
          </div>
          {isRehashing ? (
            <div style={{ color: '#4caf50' }}>
              if (isRehashing()) {'{'}
            </div>
          ) : (
            <div style={{ color: '#a0a0a0' }}>
              if (isRehashing()) ...
            </div>
          )}
          <div style={{ color: isRehashing ? '#4caf50' : 'white', paddingLeft: isRehashing ? 20 : 0 }}>
            dictAdd(ht[1], key, value);
          </div>
          {isRehashing && (
            <div style={{ color: '#4caf50' }}>{'}'}</div>
          )}
          {!isRehashing && (
            <>
              <div style={{ color: '#a0a0a0', marginTop: 12, marginBottom: 12 }}>
                // 非 Rehash 期间写入 ht[0]
              </div>
              <div style={{ color: 'white' }}>
                else {'{'}
              </div>
              <div style={{ color: 'white', paddingLeft: 20 }}>
                dictAdd(ht[0], key, value);
              </div>
              <div style={{ color: 'white' }}>{'}'}</div>
            </>
          )}
        </div>
      )}

      {operation === 'delete' && (
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 15 }}>
          <div style={{ color: '#a0a0a0', marginBottom: 12 }}>
            // 需要在两个表都尝试删除
          </div>
          <div style={{ color: 'white' }}>
            deleted = dictDelete(ht[0], key);
          </div>
          <div style={{ color: '#a0a0a0', marginTop: 12, marginBottom: 12 }}>
            if (!deleted && isRehashing()) {'{'}
          </div>
          <div style={{ color: '#4caf50', paddingLeft: 20 }}>
            deleted = dictDelete(ht[1], key);
          </div>
          <div style={{ color: '#a0a0a0' }}>{'}'}</div>
        </div>
      )}
    </div>
  );
}

function DualTableDiagram() {
  const frame = useCurrentFrame();
  const isRehashing = frame >= 120;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 32 }}>双表协同</h2>

      <div style={{ display: 'flex', gap: 40, marginBottom: 32 }}>
        {/* ht[0] */}
        <div
          style={{
            flex: 1,
            padding: 24,
            background: 'rgba(33, 150, 243, 0.1)',
            border: '3px solid #2196f3',
            borderRadius: 12,
            opacity: isRehashing ? 0.7 : 1,
            transition: 'opacity 0.3s ease',
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#2196f3', marginBottom: 16 }}>
            ht[0]
          </div>
          <div style={{ color: '#a0a0a0', fontSize: 14 }}>
            {isRehashing ? '源表 - 正在迁移' : '主表 - 正常读写'}
          </div>
          <div style={{ marginTop: 16, fontSize: 13, color: '#666' }}>
            {isRehashing ? '数据逐步移出...' : '所有操作在这里执行'}
          </div>
        </div>

        {/* ht[1] */}
        <div
          style={{
            flex: 1,
            padding: 24,
            background: isRehashing ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 255, 255, 0.02)',
            border: `3px solid ${isRehashing ? '#ff9800' : '#444'}`,
            borderRadius: 12,
            opacity: isRehashing ? 1 : 0.5,
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 'bold', color: isRehashing ? '#ff9800' : '#666', marginBottom: 16 }}>
            ht[1]
          </div>
          <div style={{ color: isRehashing ? '#a0a0a0' : '#666', fontSize: 14 }}>
            {isRehashing ? '目标表 - 接收新数据' : '备用 - Rehash 时激活'}
          </div>
          <div style={{ marginTop: 16, fontSize: 13, color: '#666' }}>
            {isRehashing ? '新写入直接进入这里' : '等待 Rehash'}
          </div>
        </div>
      </div>

      {/* rehashidx 指示器 */}
      {isRehashing && (
        <div
          style={{
            padding: 16,
            background: 'rgba(255, 152, 0, 0.2)',
            border: '2px solid #ff9800',
            borderRadius: 8,
            marginBottom: 24,
          }}
        >
          <div style={{ color: '#ff9800', fontWeight: 'bold', marginBottom: 8 }}>
            rehashidx = {Math.floor((frame - 120) / 30) % 4}
          </div>
          <div style={{ color: '#a0a0a0', fontSize: 14 }}>
            记录当前正在迁移的桶索引，每次操作递增
          </div>
        </div>
      )}
    </div>
  );
}

export const DualTableMechanism: React.FC = () => {
  const frame = useCurrentFrame();
  const section = Math.floor(frame / 150) % 4;

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="双表协同机制"
          subtitle="Rehash 期间如何保证读写"
        />
      </Sequence>

      {/* 第二段: 双表示意图 */}
      <Sequence from={90} durationInFrames={420}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <DualTableDiagram />
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: GET 操作 */}
      <Sequence from={510} durationInFrames={390}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: 'white', marginBottom: 32 }}>Rehash 期间的操作策略</h2>
          <OperationDemo operation="get" />
        </AbsoluteFill>
      </Sequence>

      {/* 第四段: SET 操作 */}
      <Sequence from={900} durationInFrames={390}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: 'white', marginBottom: 32 }}>Rehash 期间的操作策略</h2>
          <OperationDemo operation="set" />
        </AbsoluteFill>
      </Sequence>

      {/* 第五段: DELETE 操作 */}
      <Sequence from={1290} durationInFrames={360}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: 'white', marginBottom: 32 }}>Rehash 期间的操作策略</h2>
          <OperationDemo operation="delete" />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default DualTableMechanism;

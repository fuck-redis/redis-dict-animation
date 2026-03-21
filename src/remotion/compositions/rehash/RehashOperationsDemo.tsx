/**
 * Rehash 期间操作演示
 * 视频时长: 20秒 (600帧 @ 30fps)
 * 展示 GET/SET/DEL 操作在 Rehash 期间如何处理
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const TOTAL_FRAMES = 600; // 20秒

// 操作类型配置
const OPERATIONS = [
  {
    type: 'get' as const,
    name: 'GET',
    color: '#2196f3', // blue - good
    icon: '📖',
    description: '查询操作',
    codeNormal: `entry = dictFind(d, key);
return entry ? entry->v : NULL;`,
    codeRehashing: `entry = dictFind(ht[0], key);
if (!entry && isRehashing) {
  entry = dictFind(ht[1], key);
}
return entry ? entry->v : NULL;`,
    flow: ['ht[0] 查询', '未找到?', 'ht[1] 查询', '返回结果'],
  },
  {
    type: 'set' as const,
    name: 'SET',
    color: '#4caf50', // green - good
    icon: '✏️',
    description: '写入操作',
    codeNormal: `dictAdd(ht[0], key, value);`,
    codeRehashing: `if (isRehashing) {
  dictAdd(ht[1], key, value);
} else {
  dictAdd(ht[0], key, value);
}`,
    flow: ['判断状态', '写入目标表', 'ht[1] 接收', '完成'],
  },
  {
    type: 'del' as const,
    name: 'DEL',
    color: '#e94560', // red - warning
    icon: '🗑️',
    description: '删除操作',
    codeNormal: `dictDelete(ht[0], key);`,
    codeRehashing: `deleted = dictDelete(ht[0], key);
if (!deleted && isRehashing) {
  deleted = dictDelete(ht[1], key);
}`,
    flow: ['ht[0] 删除', '成功?', 'ht[1] 删除', '完成'],
  },
];

interface OperationFlowProps {
  operation: typeof OPERATIONS[0];
  isRehashing: boolean;
  flowIndex: number;
}

function OperationFlow({ operation, isRehashing, flowIndex }: OperationFlowProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
      {operation.flow.map((step, i) => (
        <React.Fragment key={i}>
          <div
            style={{
              padding: '8px 16px',
              background: i <= flowIndex ? `rgba(${hexToRgb(operation.color)}, 0.3)` : 'rgba(255,255,255,0.05)',
              border: `2px solid ${i <= flowIndex ? operation.color : '#444'}`,
              borderRadius: 8,
              color: i <= flowIndex ? '#fff' : '#666',
              fontSize: 14,
              transition: 'all 0.3s ease',
            }}
          >
            {step}
          </div>
          {i < operation.flow.length - 1 && (
            <div style={{ color: '#666', fontSize: 20 }}>→</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// 辅助函数
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '255,255,255';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

function DualTableState({ isRehashing, rehashIdx }: { isRehashing: boolean; rehashIdx: number }) {
  return (
    <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
      {/* ht[0] */}
      <div
        style={{
          flex: 1,
          padding: 20,
          background: 'rgba(33, 150, 243, 0.1)',
          border: '2px solid #2196f3',
          borderRadius: 12,
          opacity: isRehashing ? 0.7 : 1,
          transition: 'opacity 0.3s ease',
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 'bold', color: '#2196f3', marginBottom: 12 }}>
          ht[0]
          {isRehashing && <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>(源表)</span>}
        </div>
        <div style={{ fontSize: 13, color: '#888' }}>
          {isRehashing ? '正在迁出数据...' : '主表 - 读写在此'}
        </div>
        {isRehashing && (
          <div style={{ marginTop: 12, fontSize: 12, color: '#ff9800' }}>
            rehashidx: {rehashIdx}
          </div>
        )}
      </div>

      {/* ht[1] */}
      <div
        style={{
          flex: 1,
          padding: 20,
          background: isRehashing ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255,255,255,0.02)',
          border: `2px solid ${isRehashing ? '#ff9800' : '#444'}`,
          borderRadius: 12,
          opacity: isRehashing ? 1 : 0.5,
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 'bold', color: isRehashing ? '#ff9800' : '#666', marginBottom: 12 }}>
          ht[1]
          {isRehashing && <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>(目标表)</span>}
        </div>
        <div style={{ fontSize: 13, color: isRehashing ? '#a0a0a0' : '#666' }}>
          {isRehashing ? '接收新写入' : '备用表'}
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ code, highlightLines = [] }: { code: string; highlightLines?: number[] }) {
  const lines = code.split('\n');
  return (
    <div
      style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 14,
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 8,
        padding: 16,
        border: '1px solid #333',
      }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            color: highlightLines.includes(i) ? '#4caf50' : '#ccc',
            padding: '2px 0',
            background: highlightLines.includes(i) ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
            borderLeft: highlightLines.includes(i) ? '3px solid #4caf50' : '3px solid transparent',
            paddingLeft: highlightLines.includes(i) ? 8 : 0,
          }}
        >
          {line || ' '}
        </div>
      ))}
    </div>
  );
}

export const RehashOperationsDemo: React.FC = () => {
  const frame = useCurrentFrame();

  // 时间分配: 每种操作 180 帧 (6秒)
  // 0-180: GET, 180-360: SET, 360-540: DEL, 540-600: 总结
  const cycleFrame = frame % 540;
  const operationIndex = Math.floor(cycleFrame / 180);
  const operation = OPERATIONS[operationIndex];

  // 是否在 rehash 状态 (用 frame > 60 来模拟开始 rehash)
  const isRehashing = frame >= 60;
  const localFrame = frame % 180;

  // 流程进度
  const flowProgress = localFrame / 180;
  const flowIndex = Math.min(3, Math.floor(flowProgress * 4));

  // rehashidx 模拟
  const rehashIdx = Math.floor(frame / 30) % 8;

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="Rehash 期间的操作"
          subtitle="读写如何平滑过渡？"
        />
      </Sequence>

      {/* 第二段: 操作演示 */}
      <Sequence from={90} durationInFrames={510}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          {/* 状态指示器 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <div
              style={{
                padding: '8px 20px',
                background: isRehashing ? 'rgba(255, 152, 0, 0.2)' : 'rgba(76, 175, 80, 0.2)',
                border: `2px solid ${isRehashing ? '#ff9800' : '#4caf50'}`,
                borderRadius: 8,
                color: isRehashing ? '#ff9800' : '#4caf50',
                fontWeight: 'bold',
              }}
            >
              {isRehashing ? 'Rehash 进行中' : '正常状态'}
            </div>
            <div style={{ color: '#666', fontSize: 14 }}>
              帧: {frame} | 操作: {operation.name}
            </div>
          </div>

          {/* 操作卡片 */}
          <div style={{ display: 'flex', gap: 32 }}>
            {/* 左侧: 操作信息 */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  padding: 24,
                  background: `rgba(${hexToRgb(operation.color)}, 0.1)`,
                  border: `3px solid ${operation.color}`,
                  borderRadius: 16,
                  marginBottom: 24,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 48 }}>{operation.icon}</span>
                  <div>
                    <div style={{ fontSize: 32, fontWeight: 'bold', color: operation.color }}>
                      {operation.name}
                    </div>
                    <div style={{ fontSize: 16, color: '#a0a0a0' }}>
                      {operation.description}
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作流程 */}
              <OperationFlow
                operation={operation}
                isRehashing={isRehashing}
                flowIndex={flowIndex}
              />

              {/* 双表状态 */}
              <DualTableState isRehashing={isRehashing} rehashIdx={rehashIdx} />
            </div>

            {/* 右侧: 代码对比 */}
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#fff', marginBottom: 16 }}>代码逻辑</h3>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>
                  正常状态:
                </div>
                <CodeBlock code={operation.codeNormal} />
              </div>

              <div>
                <div
                  style={{
                    fontSize: 14,
                    color: '#ff9800',
                    marginBottom: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      padding: '2px 8px',
                      background: 'rgba(255, 152, 0, 0.2)',
                      borderRadius: 4,
                      fontSize: 12,
                    }}
                  >
                    Rehash 期间
                  </span>
                </div>
                <CodeBlock
                  code={operation.codeRehashing}
                  highlightLines={operation.type === 'get' ? [1, 2, 3] : operation.type === 'set' ? [1, 3] : [1, 2, 3]}
                />
              </div>

              {/* 关键点 */}
              <div
                style={{
                  marginTop: 24,
                  padding: 16,
                  background: 'rgba(76, 175, 80, 0.1)',
                  border: '2px solid #4caf50',
                  borderRadius: 8,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 'bold', color: '#4caf50', marginBottom: 8 }}>
                  关键设计
                </div>
                <ul style={{ margin: 0, paddingLeft: 20, color: '#a0a0a0', fontSize: 13 }}>
                  <li>GET: 优先查 ht[0]，未找到再查 ht[1]</li>
                  <li>SET: Rehash 期间写入 ht[1]</li>
                  <li>DEL: 两个表都需要检查和删除</li>
                </ul>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default RehashOperationsDemo;

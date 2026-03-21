/**
 * DictScanComparisonTable - dictScan vs dictScanSafe 对比表
 * 视频时长: 20秒 (600帧 @ 30fps)
 * 内容: 动画表格逐行对比 dictScan 和 dictScanSafe
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const FPS = 30;
const TOTAL_FRAMES = 600; // 20秒

// 对比数据
const comparisonData = [
  {
    feature: '函数名',
    dictScan: 'dictScan()',
    dictScanSafe: 'dictScanSafe()',
    dictScanColor: '#ff9800',
    dictScanSafeColor: '#4caf50',
  },
  {
    feature: '迭代器类型',
    dictScan: '非安全迭代器',
    dictScanSafe: '安全迭代器',
    dictScanColor: '#f44336',
    dictScanSafeColor: '#4caf50',
  },
  {
    feature: 'iterators 计数',
    dictScan: '不增加',
    dictScanSafe: '增加',
    dictScanColor: '#f44336',
    dictScanSafeColor: '#4caf50',
  },
  {
    feature: 'Rehash 安全',
    dictScan: '不安全',
    dictScanSafe: '安全',
    dictScanColor: '#f44336',
    dictScanSafeColor: '#4caf50',
  },
  {
    feature: '元素重复/遗漏',
    dictScan: '可能发生',
    dictScanSafe: '不会发生',
    dictScanColor: '#f44336',
    dictScanSafeColor: '#4caf50',
  },
  {
    feature: '性能影响',
    dictScan: '较小',
    dictScanSafe: '可能有延迟',
    dictScanColor: '#4caf50',
    dictScanSafeColor: '#ff9800',
  },
  {
    feature: '典型用途',
    dictScan: 'KEYS 命令',
    dictScanSafe: 'SCAN, 过期清理',
    dictScanColor: '#ff9800',
    dictScanSafeColor: '#4caf50',
  },
  {
    feature: '使用场景',
    dictScan: '只读遍历',
    dictScanSafe: '需要修改数据',
    dictScanColor: '#ff9800',
    dictScanSafeColor: '#4caf50',
  },
];

function AnimatedTableRow({
  feature,
  dictScan,
  dictScanSafe,
  dictScanColor,
  dictScanSafeColor,
  rowIndex,
  isVisible,
  animationProgress,
}: {
  feature: string;
  dictScan: string;
  dictScanSafe: string;
  dictScanColor: string;
  dictScanSafeColor: string;
  rowIndex: number;
  isVisible: boolean;
  animationProgress: number;
}) {
  const rowProgress = interpolate(animationProgress, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <tr
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        opacity: isVisible ? 1 : 0.3,
        transition: 'opacity 0.3s ease',
      }}
    >
      <td
        style={{
          padding: 16,
          color: '#a0a0a0',
          fontWeight: 500,
        }}
      >
        {feature}
      </td>
      <td
        style={{
          padding: 16,
          color: dictScanColor,
          transform: `translateX(${(1 - rowProgress) * -20}px)`,
          opacity: isVisible ? rowProgress : 0,
        }}
      >
        {isVisible && rowProgress > 0.5 ? dictScan : ''}
        {!isVisible || rowProgress <= 0.5 ? (
          <span style={{ opacity: 0.3 }}>{dictScan}</span>
        ) : null}
      </td>
      <td
        style={{
          padding: 16,
          color: dictScanSafeColor,
          transform: `translateX(${(1 - rowProgress) * 20}px)`,
          opacity: isVisible ? rowProgress : 0,
        }}
      >
        {isVisible && rowProgress > 0.5 ? dictScanSafe : ''}
        {!isVisible || rowProgress <= 0.5 ? (
          <span style={{ opacity: 0.3 }}>{dictScanSafe}</span>
        ) : null}
      </td>
    </tr>
  );
}

function ComparisonTableScene() {
  const frame = useCurrentFrame();
  const totalRows = comparisonData.length;
  const rowDuration = 50;
  const currentRow = Math.min(Math.floor(frame / rowDuration), totalRows);
  const rowProgress = (frame % rowDuration) / rowDuration;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 8 }}>dictScan vs dictScanSafe</h2>
      <p style={{ color: '#888', marginBottom: 32, fontSize: 14 }}>
        逐行对比两种扫描方式的核心差异
      </p>

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
              <th style={{ padding: 16, textAlign: 'left', color: '#a0a0a0', fontWeight: 600 }}>
                特性
              </th>
              <th style={{ padding: 16, textAlign: 'left', color: '#ff9800', fontWeight: 600 }}>
                dictScan
              </th>
              <th style={{ padding: 16, textAlign: 'left', color: '#4caf50', fontWeight: 600 }}>
                dictScanSafe
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, index) => (
              <AnimatedTableRow
                key={index}
                feature={row.feature}
                dictScan={row.dictScan}
                dictScanSafe={row.dictScanSafe}
                dictScanColor={row.dictScanColor}
                dictScanSafeColor={row.dictScanSafeColor}
                rowIndex={index}
                isVisible={index < currentRow}
                animationProgress={index === currentRow - 1 ? rowProgress : index < currentRow - 1 ? 1 : 0}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* 进度指示 */}
      <div style={{ marginTop: 16 }}>
        <div style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>
          当前行: {currentRow} / {totalRows}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {Array.from({ length: totalRows }, (_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 4,
                background: i < currentRow ? '#4caf50' : i === currentRow ? '#ff9800' : '#333',
                borderRadius: 2,
                transition: 'background 0.2s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CodeComparisonScene() {
  const frame = useCurrentFrame();
  const showSafe = frame >= 120;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 8 }}>代码层面的区别</h2>
      <p style={{ color: '#888', marginBottom: 32, fontSize: 14 }}>
        dictScan 使用非安全迭代器，dictScanSafe 使用安全迭代器
      </p>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* dictScan */}
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
            <span style={{ color: '#ff9800', fontWeight: 'bold' }}>dictScan (非安全)</span>
          </div>
          <div
            style={{
              background: '#1e1e1e',
              borderRadius: 8,
              padding: 16,
              fontFamily: "'Courier New', monospace",
              fontSize: 12,
            }}
          >
            <div style={{ color: '#6a9955' }}>// dictScan 内部</div>
            <div style={{ color: '#d4d4d4', marginTop: 8 }}>
              <span style={{ color: '#c586c0' }}>unsigned long</span> dictScan(
            </div>
            <div style={{ color: '#d4d4d4', paddingLeft: 16, marginTop: 4 }}>
              dict *d,
            </div>
            <div style={{ color: '#d4d4d4', paddingLeft: 16 }}>
              <span style={{ color: '#c586c0' }}>unsigned long</span> v,
            </div>
            <div style={{ color: '#d4d4d4', paddingLeft: 16 }}>
              dictScanCallback *fn,
            </div>
            <div style={{ color: '#d4d4d4', paddingLeft: 16 }}>
              void *privdata
            </div>
            <div style={{ color: '#d4d4d4' }}>) {'{'}</div>
            <div style={{ color: '#dcdcaa', paddingLeft: 16, marginTop: 8 }}>
              dictEntry *de;
            </div>
            <div style={{ color: '#dcdcaa', paddingLeft: 16, marginTop: 8 }}>
              de = dictScan(d, v, ...);
            </div>
            <div style={{ color: '#d4d4d4', marginTop: 8 }}>{`},`}</div>
          </div>
          <div
            style={{
              marginTop: 12,
              padding: 8,
              background: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid #f44336',
              borderRadius: 6,
            }}
          >
            <span style={{ color: '#f44336', fontSize: 12 }}>不增加 iterators 计数</span>
          </div>
        </div>

        {/* dictScanSafe */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              padding: 12,
              background: 'rgba(76, 175, 80, 0.1)',
              border: '2px solid #4caf50',
              borderRadius: 8,
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            <span style={{ color: '#4caf50', fontWeight: 'bold' }}>dictScanSafe (安全)</span>
          </div>
          <div
            style={{
              background: '#1e1e1e',
              borderRadius: 8,
              padding: 16,
              fontFamily: "'Courier New', monospace",
              fontSize: 12,
            }}
          >
            <div style={{ color: '#6a9955' }}>// dictScanSafe 内部</div>
            <div style={{ color: '#d4d4d4', marginTop: 8 }}>
              <span style={{ color: '#c586c0' }}>unsigned long</span> dictScanSafe(
            </div>
            <div style={{ color: '#d4d4d4', paddingLeft: 16, marginTop: 4 }}>
              dict *d,
            </div>
            <div style={{ color: '#d4d4d4', paddingLeft: 16 }}>
              <span style={{ color: '#c586c0' }}>unsigned long</span> v,
            </div>
            <div style={{ color: '#d4d4d4', paddingLeft: 16 }}>
              dictScanCallback *fn,
            </div>
            <div style={{ color: '#d4d4d4', paddingLeft: 16 }}>
              void *privdata
            </div>
            <div style={{ color: '#d4d4d4' }}>) {'{'}</div>
            <div style={{ color: '#dcdcaa', paddingLeft: 16, marginTop: 8 }}>
              dictEntry *de;
            </div>
            <div style={{ color: '#4caf50', paddingLeft: 16, marginTop: 8 }}>
              iter = dictGetSafeIterator(d);
              <span style={{ color: '#6a9955' }}> // +1</span>
            </div>
            <div style={{ color: '#dcdcaa', paddingLeft: 16, marginTop: 8 }}>
              de = dictScan(d, v, ...);
            </div>
            <div style={{ color: '#4caf50', paddingLeft: 16, marginTop: 8 }}>
              dictReleaseIterator(iter);
              <span style={{ color: '#6a9955' }}> // -1</span>
            </div>
            <div style={{ color: '#d4d4d4', marginTop: 8 }}>{`},`}</div>
          </div>
          <div
            style={{
              marginTop: 12,
              padding: 8,
              background: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid #4caf50',
              borderRadius: 6,
            }}
          >
            <span style={{ color: '#4caf50', fontSize: 12 }}>增加 iterators 计数保护</span>
          </div>
        </div>
      </div>

      {showSafe && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            background: 'rgba(76, 175, 80, 0.1)',
            border: '2px solid #4caf50',
            borderRadius: 8,
          }}
        >
          <p style={{ color: 'white', margin: 0, fontSize: 14 }}>
            <strong style={{ color: '#4caf50' }}>关键区别:</strong> dictScanSafe 在调用前后分别增加和减少 iterators 计数，
            确保迭代期间不会发生 rehash。
          </p>
        </div>
      )}
    </div>
  );
}

function VisualComparisonScene() {
  const frame = useCurrentFrame();
  const cursorPosition = (frame * 8) / 30 % 8;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 8 }}>遍历过程对比</h2>
      <p style={{ color: '#888', marginBottom: 32, fontSize: 14 }}>
        非安全迭代器可能在遍历过程中遇到 rehash 导致数据不一致
      </p>

      <div style={{ display: 'flex', gap: 32 }}>
        {/* dictScan 示意 */}
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
            <span style={{ color: '#ff9800', fontWeight: 'bold' }}>dictScan</span>
          </div>

          <div
            style={{
              background: '#0d0d0d',
              borderRadius: 8,
              padding: 16,
            }}
          >
            <div style={{ color: '#888', fontSize: 11, marginBottom: 8 }}>遍历进度:</div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: i < cursorPosition ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    border: `2px solid ${i < cursorPosition ? '#4caf50' : '#333'}`,
                    borderRadius: 4,
                    color: i < cursorPosition ? '#4caf50' : '#555',
                    fontSize: 10,
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  {i}
                </div>
              ))}
            </div>

            <div
              style={{
                padding: 12,
                background: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid #f44336',
                borderRadius: 6,
                marginBottom: 12,
              }}
            >
              <div style={{ color: '#f44336', fontSize: 12, fontWeight: 'bold' }}>
                Rehash 可能发生!
              </div>
              <div style={{ color: '#888', fontSize: 11, marginTop: 4 }}>
                元素可能遗漏或重复
              </div>
            </div>
          </div>
        </div>

        {/* dictScanSafe 示意 */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              padding: 12,
              background: 'rgba(76, 175, 80, 0.1)',
              border: '2px solid #4caf50',
              borderRadius: 8,
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            <span style={{ color: '#4caf50', fontWeight: 'bold' }}>dictScanSafe</span>
          </div>

          <div
            style={{
              background: '#0d0d0d',
              borderRadius: 8,
              padding: 16,
            }}
          >
            <div style={{ color: '#888', fontSize: 11, marginBottom: 8 }}>遍历进度:</div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: i < cursorPosition ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    border: `2px solid ${i < cursorPosition ? '#4caf50' : '#333'}`,
                    borderRadius: 4,
                    color: i < cursorPosition ? '#4caf50' : '#555',
                    fontSize: 10,
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  {i}
                </div>
              ))}
            </div>

            <div
              style={{
                padding: 12,
                background: 'rgba(76, 175, 80, 0.1)',
                border: '1px solid #4caf50',
                borderRadius: 6,
                marginBottom: 12,
              }}
            >
              <div style={{ color: '#4caf50', fontSize: 12, fontWeight: 'bold' }}>
                Rehash 被暂停
              </div>
              <div style={{ color: '#888', fontSize: 11, marginTop: 4 }}>
                iterators 计数 &gt; 0
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 保护机制说明 */}
      <div
        style={{
          marginTop: 20,
          padding: 16,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 8,
        }}
      >
        <div style={{ color: '#a0a0a0', fontSize: 14, textAlign: 'center' }}>
          <strong style={{ color: '#4caf50' }}>dictScanSafe</strong> 通过安全迭代器保护，
          确保遍历过程中 <strong style={{ color: '#ff9800' }}>ht[1] 不会被修改</strong>，
          保证数据完整性。
        </div>
      </div>
    </div>
  );
}

export const DictScanComparisonTable: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="dictScan vs dictScanSafe"
          subtitle="两种遍历方式的对别"
        />
      </Sequence>

      {/* 逐行对比表 */}
      <Sequence from={90} durationInFrames={200}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <ComparisonTableScene />
        </AbsoluteFill>
      </Sequence>

      {/* 代码层面区别 */}
      <Sequence from={290} durationInFrames={180}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #1f2e1f 100%)',
            padding: 48,
          }}
        >
          <CodeComparisonScene />
        </AbsoluteFill>
      </Sequence>

      {/* 遍历过程对比 */}
      <Sequence from={470} durationInFrames={130}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #2e2520 100%)',
            padding: 48,
          }}
        >
          <VisualComparisonScene />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default DictScanComparisonTable;

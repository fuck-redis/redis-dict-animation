/**
 * IteratorApplicationScenarios - 迭代器应用场景
 * 视频时长: 20秒 (600帧 @ 30fps)
 * 内容: KEYS命令(阻塞), SCAN命令(非阻塞), 过期键清理, 持久化保存
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';

const FPS = 30;
const TOTAL_FRAMES = 600; // 20秒

// 场景卡片组件
function ScenarioCard({
  title,
  subtitle,
  icon,
  color,
  isActive,
  children,
}: {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: 24,
        background: isActive ? `${color}15` : 'rgba(255,255,255,0.02)',
        border: `2px solid ${isActive ? color : '#333'}`,
        borderRadius: 12,
        transition: 'all 0.3s ease',
        opacity: isActive ? 1 : 0.5,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 28 }}>{icon}</span>
        <div>
          <div style={{ color, fontSize: 18, fontWeight: 'bold' }}>{title}</div>
          <div style={{ color: '#888', fontSize: 13 }}>{subtitle}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

// KEYS 命令场景
function KeysCommandScene() {
  const frame = useCurrentFrame();
  const phase = Math.floor(frame / 60) % 3;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: '#f44336', marginBottom: 16 }}>
        <span style={{ marginRight: 12 }}>KEYS 命令</span>
        <span style={{ fontSize: 14, color: '#888', fontWeight: 'normal' }}>
          阻塞式遍历
        </span>
      </h2>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* 左侧说明 */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              padding: 16,
              background: 'rgba(244, 67, 54, 0.1)',
              border: '2px solid #f44336',
              borderRadius: 8,
              marginBottom: 24,
            }}
          >
            <p style={{ color: 'white', margin: 0, fontSize: 14 }}>
              <strong style={{ color: '#f44336' }}>KEYS</strong> 命令使用
              <strong style={{ color: '#ff9800' }}>非安全迭代器</strong>，
              遍历整个字典返回所有键。
            </p>
          </div>

          <div
            style={{
              background: '#1e1e1e',
              borderRadius: 8,
              padding: 16,
              fontFamily: "'Courier New', monospace",
              fontSize: 13,
            }}
          >
            <div style={{ color: '#6a9955' }}>// Redis KEYS 命令</div>
            <div style={{ color: '#d4d4d4', marginTop: 8 }}>
              <span style={{ color: '#c586c0' }}>void</span> keysCommand(client *c) {'{'}
            </div>
            <div style={{ color: '#dcdcaa', paddingLeft: 16, marginTop: 8 }}>
              dictIterator di;
            </div>
            <div style={{ color: '#dcdcaa', paddingLeft: 16, marginTop: 8 }}>
              dictEntry *de;
            </div>
            <div style={{ color: '#d4d4d4', paddingLeft: 16, marginTop: 8 }}>
              di = dictGetUnsafeIterator(d);
            </div>
            <div style={{ color: '#d4d4d4', paddingLeft: 16, marginTop: 8 }}>
              <span style={{ color: '#c586c0' }}>while</span> ((de = dictNext(di)) != NULL)
            </div>
            <div style={{ color: '#dcdcaa', paddingLeft: 32, marginTop: 8 }}>
              addReplyBulkCString(c, key);
            </div>
            <div style={{ color: '#d4d4d4', marginTop: 8 }}>{'}'}</div>
          </div>
        </div>

        {/* 右侧动画 */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              background: '#0d0d0d',
              borderRadius: 8,
              padding: 20,
              height: 200,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ color: '#888', fontSize: 12, marginBottom: 12 }}>执行过程:</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {phase === 0 && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#f44336', fontSize: 18 }}>🔍 扫描中...</div>
                  <div style={{ color: '#666', marginTop: 8, fontSize: 12 }}>
                    遍历所有桶
                  </div>
                </div>
              )}
              {phase === 1 && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#ffc107', fontSize: 18 }}>⚠️ 警告</div>
                  <div style={{ color: '#666', marginTop: 8, fontSize: 12 }}>
                    大数据量时会阻塞
                  </div>
                </div>
              )}
              {phase === 2 && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#f44336', fontSize: 18 }}>⛔ 不推荐</div>
                  <div style={{ color: '#666', marginTop: 8, fontSize: 12 }}>
                    生产环境使用 SCAN
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// SCAN 命令场景
function ScanCommandScene() {
  const frame = useCurrentFrame();
  const cursor = Math.floor((frame * 8) / 60) % 8;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: '#4caf50', marginBottom: 16 }}>
        <span style={{ marginRight: 12 }}>SCAN 命令</span>
        <span style={{ fontSize: 14, color: '#888', fontWeight: 'normal' }}>
          非阻塞式遍历
        </span>
      </h2>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* 左侧说明 */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              padding: 16,
              background: 'rgba(76, 175, 80, 0.1)',
              border: '2px solid #4caf50',
              borderRadius: 8,
              marginBottom: 24,
            }}
          >
            <p style={{ color: 'white', margin: 0, fontSize: 14 }}>
              <strong style={{ color: '#4caf50' }}>SCAN</strong> 命令使用
              <strong style={{ color: '#2196f3' }}>安全迭代器</strong>，
              支持增量遍历，每次返回部分结果。
            </p>
          </div>

          <div
            style={{
              background: '#1e1e1e',
              borderRadius: 8,
              padding: 16,
              fontFamily: "'Courier New', monospace",
              fontSize: 13,
            }}
          >
            <div style={{ color: '#6a9955' }}>// SCAN 命令示例</div>
            <div style={{ color: '#d4d4d4', marginTop: 8 }}>SCAN 0 MATCH user:* COUNT 100</div>
            <div style={{ color: '#6a9955', marginTop: 12 }}>// 返回:</div>
            <div style={{ color: '#ce9178', marginTop: 4 }}>1) "128"  <span style={{ color: '#888' }}>// 下次游标</span></div>
            <div style={{ color: '#ce9178', marginTop: 4 }}>2) 1) "user:1001"</div>
            <div style={{ color: '#ce9178', marginTop: 4 }}>   2) "user:1002"</div>
            <div style={{ color: '#ce9178', marginTop: 4 }}>   ...</div>
          </div>
        </div>

        {/* 右侧游标动画 */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              background: '#0d0d0d',
              borderRadius: 8,
              padding: 20,
              height: 200,
            }}
          >
            <div style={{ color: '#888', fontSize: 12, marginBottom: 12 }}>游标进度:</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: i < cursor ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${i < cursor ? '#4caf50' : '#333'}`,
                    borderRadius: 6,
                    color: i < cursor ? '#4caf50' : '#555',
                    fontFamily: "'Courier New', monospace",
                    fontSize: 12,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {i}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, color: '#888', fontSize: 12 }}>
              当前游标: <span style={{ color: '#4caf50' }}>{cursor * 128}</span>
            </div>
            <div style={{ color: '#666', fontSize: 11, marginTop: 4 }}>
              每次调用返回部分键，不会阻塞
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 过期键清理场景
function ExpiredKeysScene() {
  const frame = useCurrentFrame();
  const activeCount = 5 - Math.floor(frame / 40) % 6;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: '#ff9800', marginBottom: 16 }}>
        <span style={{ marginRight: 12 }}>过期键清理</span>
        <span style={{ fontSize: 14, color: '#888', fontWeight: 'normal' }}>
          主动过期检查
        </span>
      </h2>

      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              padding: 16,
              background: 'rgba(255, 152, 0, 0.1)',
              border: '2px solid #ff9800',
              borderRadius: 8,
              marginBottom: 24,
            }}
          >
            <p style={{ color: 'white', margin: 0, fontSize: 14 }}>
              Redis 定期使用<strong style={{ color: '#ff9800' }}>安全迭代器</strong>
              扫描过期键，清理不再使用的条目。
            </p>
          </div>

          <div
            style={{
              background: '#1e1e1e',
              borderRadius: 8,
              padding: 16,
              fontFamily: "'Courier New', monospace",
              fontSize: 13,
            }}
          >
            <div style={{ color: '#6a9955' }}>// 主动过期检查</div>
            <div style={{ color: '#d4d4d4', marginTop: 8 }}>
              <span style={{ color: '#c586c0' }}>void</span> activeExpireCycle() {'{'}
            </div>
            <div style={{ color: '#dcdcaa', paddingLeft: 16, marginTop: 8 }}>
              dictIterator *iter;
            </div>
            <div style={{ color: '#dcdcaa', paddingLeft: 16, marginTop: 8 }}>
              iter = dictGetSafeIterator(db-&gt;dict);
            </div>
            <div style={{ color: '#d4d4d4', paddingLeft: 16, marginTop: 8 }}>
              <span style={{ color: '#c586c0' }}>while</span> ((de = dictNext(iter)) != NULL)
            </div>
            <div style={{ color: '#dcdcaa', paddingLeft: 32, marginTop: 8 }}>
              <span style={{ color: '#c586c0' }}>if</span> (isExpired(key)) {'{'}
            </div>
            <div style={{ color: '#d4d4d4', paddingLeft: 48, marginTop: 8 }}>
              dictDelete(db-&gt;dict, key);
            </div>
            <div style={{ color: '#d4d4d4', paddingLeft: 32, marginTop: 4 }}>{'}'}</div>
            <div style={{ color: '#d4d4d4', marginTop: 8 }}>{'}'}</div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              background: '#0d0d0d',
              borderRadius: 8,
              padding: 20,
              height: 200,
            }}
          >
            <div style={{ color: '#888', fontSize: 12, marginBottom: 12 }}>键状态:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background:
                      i < activeCount
                        ? 'rgba(76, 175, 80, 0.2)'
                        : 'rgba(244, 67, 54, 0.2)',
                    border: `1px solid ${i < activeCount ? '#4caf50' : '#f44336'}`,
                    borderRadius: 6,
                    fontFamily: "'Courier New', monospace",
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: i < activeCount ? '#4caf50' : '#f44336' }}>
                    key:{i + 1}
                  </span>
                  <span style={{ color: '#888' }}>
                    {i < activeCount ? '有效' : '已过期'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 持久化保存场景
function PersistenceSaveScene() {
  const frame = useCurrentFrame();
  const progress = (frame * 100) / 360;
  const phase = frame < 120 ? 0 : frame < 240 ? 1 : 2;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: '#2196f3', marginBottom: 16 }}>
        <span style={{ marginRight: 12 }}>持久化保存 (BGSAVE)</span>
        <span style={{ fontSize: 14, color: '#888', fontWeight: 'normal' }}>
          Fork 子进程遍历
        </span>
      </h2>

      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              padding: 16,
              background: 'rgba(33, 150, 243, 0.1)',
              border: '2px solid #2196f3',
              borderRadius: 8,
              marginBottom: 24,
            }}
          >
            <p style={{ color: 'white', margin: 0, fontSize: 14 }}>
              BGSAVE 使用<strong style={{ color: '#2196f3' }}>安全迭代器</strong>
              在子进程中遍历字典，父进程可以继续处理请求。
            </p>
          </div>

          <div
            style={{
              background: '#1e1e1e',
              borderRadius: 8,
              padding: 16,
              fontFamily: "'Courier New', monospace",
              fontSize: 13,
            }}
          >
            <div style={{ color: '#6a9955' }}>// BGSAVE 流程</div>
            <div style={{ color: '#d4d4d4', marginTop: 8 }}>
              <span style={{ color: '#c586c0' }}>if</span> (fork() == 0) {'{'}
            </div>
            <div style={{ color: '#dcdcaa', paddingLeft: 16, marginTop: 8 }}>
              <span style={{ color: '#6a9955' }}>// 子进程</span>
            </div>
            <div style={{ color: '#dcdcaa', paddingLeft: 16, marginTop: 8 }}>
              iter = dictGetSafeIterator(d);
            </div>
            <div style={{ color: '#dcdcaa', paddingLeft: 16, marginTop: 8 }}>
              rdbSaveIter(iter);
            </div>
            <div style={{ color: '#d4d4d4', marginTop: 8 }}>{'}'} <span style={{ color: '#6a9955' }}>else {'{'}</span>
            </div>
            <div style={{ color: '#dcdcaa', paddingLeft: 16, marginTop: 8 }}>
              <span style={{ color: '#6a9955' }}>// 父进程 - 继续服务</span>
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              background: '#0d0d0d',
              borderRadius: 8,
              padding: 20,
              height: 200,
            }}
          >
            <div style={{ color: '#888', fontSize: 12, marginBottom: 12 }}>保存进度:</div>
            <div
              style={{
                height: 24,
                background: '#222',
                borderRadius: 6,
                overflow: 'hidden',
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(progress, 100)}%`,
                  background:
                    phase === 0
                      ? 'linear-gradient(90deg, #2196f3, #64b5f6)'
                      : phase === 1
                      ? 'linear-gradient(90deg, #64b5f6, #4caf50)'
                      : 'linear-gradient(90deg, #4caf50, #81c784)',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
            <div style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>
              {phase === 0 && '正在遍历字典...'}
              {phase === 1 && '写入 RDB 文件...'}
              {phase === 2 && '保存完成'}
            </div>
            <div
              style={{
                display: 'flex',
                gap: 16,
                marginTop: 12,
                fontSize: 11,
                fontFamily: "'Courier New', monospace",
              }}
            >
              <div style={{ color: '#2196f3' }}>
                父进程: <span style={{ color: '#4caf50' }}>活跃</span>
              </div>
              <div style={{ color: '#ff9800' }}>
                子进程: <span style={{ color: '#4caf50' }}>遍历中</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const IteratorApplicationScenarios: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = Math.floor(frame / 150) % 4;

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="迭代器应用场景"
          subtitle="实际命令与用例"
        />
      </Sequence>

      {/* KEYS 命令 */}
      <Sequence from={90} durationInFrames={150}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1f3d 100%)',
            padding: 48,
          }}
        >
          <KeysCommandScene />
        </AbsoluteFill>
      </Sequence>

      {/* SCAN 命令 */}
      <Sequence from={240} durationInFrames={150}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #1f2e1f 100%)',
            padding: 48,
          }}
        >
          <ScanCommandScene />
        </AbsoluteFill>
      </Sequence>

      {/* 过期键清理 */}
      <Sequence from={390} durationInFrames={150}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #2e2d1f 100%)',
            padding: 48,
          }}
        >
          <ExpiredKeysScene />
        </AbsoluteFill>
      </Sequence>

      {/* 持久化保存 */}
      <Sequence from={540} durationInFrames={60}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #1f1f2e 100%)',
            padding: 48,
          }}
        >
          <PersistenceSaveScene />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default IteratorApplicationScenarios;

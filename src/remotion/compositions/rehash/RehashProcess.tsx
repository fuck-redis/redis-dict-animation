/**
 * Rehash 完整过程
 * 视频时长: 70秒 (2100帧 @ 30fps)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { SceneNarrator } from '@/remotion/components/SceneNarrator';
import { colors } from '@/remotion/styles/hashtableStyles';

const FPS = 30;
const TOTAL_FRAMES = 2100; // 70秒

function RehashStep({ step, title, description, isActive }: {
  step: number;
  title: string;
  description: string;
  isActive: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 20,
        padding: 20,
        background: isActive ? 'rgba(33, 150, 243, 0.2)' : 'rgba(255, 255, 255, 0.05)',
        border: `2px solid ${isActive ? '#2196f3' : '#333'}`,
        borderRadius: 12,
        marginBottom: 16,
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          background: isActive ? '#2196f3' : '#666',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {step}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: 20, color: 'white' }}>{title}</h3>
        <p style={{ margin: '8px 0 0 0', fontSize: 15, color: '#a0a0a0' }}>{description}</p>
      </div>
    </div>
  );
}

function RehashAnimation() {
  const frame = useCurrentFrame();

  // 阶段: 0=初始, 1=创建ht1, 2=迁移中, 3=完成
  const phase = Math.floor(frame / 90) % 4;
  const progress = (frame % 90) / 90;

  // 模拟迁移进度
  const rehashProgress = phase >= 2 ? Math.min(1, progress + (phase - 2) * 0.25) : 0;
  const migratedBuckets = Math.floor(rehashProgress * 4);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <h2 style={{ color: 'white', marginBottom: 32 }}>渐进式迁移过程</h2>

      <div style={{ display: 'flex', gap: 40 }}>
        {/* ht[0] */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#2196f3',
              marginBottom: 12,
            }}
          >
            ht[0] (源表)
          </div>
          <div
            style={{
              padding: 20,
              background: 'rgba(33, 150, 243, 0.1)',
              border: '2px solid #2196f3',
              borderRadius: 12,
              minHeight: 200,
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  marginBottom: 8,
                  background: i < migratedBuckets ? '#333' : 'rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  opacity: i < migratedBuckets ? 0.3 : 1,
                  transition: 'all 0.3s ease',
                }}
              >
                <span style={{ color: '#2196f3', fontWeight: 600 }}>桶 {i}</span>
                <span style={{ color: '#a0a0a0' }}>
                  {i < migratedBuckets ? '已迁移' : i === migratedBuckets ? '迁移中...' : '待迁移'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 箭头 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <div style={{ fontSize: 32, color: '#4caf50' }}>→</div>
          <div
            style={{
              padding: '4px 12px',
              background: 'rgba(76, 175, 80, 0.2)',
              borderRadius: 4,
              fontSize: 12,
              color: '#4caf50',
            }}
          >
            每次1个桶
          </div>
        </div>

        {/* ht[1] */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#ff9800',
              marginBottom: 12,
            }}
          >
            ht[1] (目标表)
          </div>
          <div
            style={{
              padding: 20,
              background: 'rgba(255, 152, 0, 0.1)',
              border: `2px solid ${phase >= 1 ? '#ff9800' : '#666'}`,
              borderRadius: 12,
              minHeight: 200,
              opacity: phase >= 1 ? 1 : 0.5,
              transition: 'opacity 0.3s ease',
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  marginBottom: 8,
                  background:
                    i < migratedBuckets
                      ? 'rgba(76, 175, 80, 0.3)'
                      : 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 4,
                  transition: 'all 0.3s ease',
                }}
              >
                <span style={{ color: '#ff9800', fontWeight: 600 }}>桶 {i}</span>
                <span style={{ color: '#a0a0a0' }}>
                  {i < migratedBuckets ? `${i * 2 + 1}个节点` : '空'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 进度条 */}
      <div style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: '#a0a0a0' }}>迁移进度</span>
          <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
            {(rehashProgress * 100).toFixed(0)}%
          </span>
        </div>
        <div
          style={{
            height: 12,
            background: '#333',
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${rehashProgress * 100}%`,
              background: 'linear-gradient(90deg, #4caf50, #8bc34a)',
              borderRadius: 6,
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export const RehashProcess: React.FC = () => {
  const frame = useCurrentFrame();
  const phase = Math.floor(frame / 120);

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      {/* 第一段: 标题 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneNarrator
          title="渐进式 Rehash"
          subtitle="分而治之的策略"
        />
      </Sequence>

      {/* 第二段: 四步流程 */}
      <Sequence from={90} durationInFrames={600}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: 'white', marginBottom: 32 }}>Rehash 工作流程</h2>

          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <RehashStep
                step={1}
                title="触发条件判断"
                description="负载因子超过阈值(通常1.0)时触发"
                isActive={phase === 0}
              />
              <RehashStep
                step={2}
                title="创建新哈希表"
                description="分配ht[1]，大小为ht[0]的2倍"
                isActive={phase === 1}
              />
            </div>
            <div style={{ flex: 1 }}>
              <RehashStep
                step={3}
                title="渐进式迁移"
                description="每次操作迁移1个桶，分散到多次请求"
                isActive={phase === 2}
              />
              <RehashStep
                step={4}
                title="完成并切换"
                description="释放ht[0]，ht[1]变为新的ht[0]"
                isActive={phase === 3}
              />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 第三段: 动画演示 */}
      <Sequence from={690} durationInFrames={780}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: 48,
          }}
        >
          <RehashAnimation />
        </AbsoluteFill>
      </Sequence>

      {/* 第四段: 关键点 */}
      <Sequence from={1470} durationInFrames={630}>
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: 48,
          }}
        >
          <h2 style={{ color: '#4caf50', marginBottom: 32 }}>渐进式 Rehash 的关键</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900 }}>
            {[
              { icon: '⚡', title: '每次 O(1) 开销', desc: '每次操作只迁移少量数据，分摊到多次请求' },
              { icon: '🔄', title: '双表同时工作', desc: 'Rehash 期间新增操作在 ht[1]，查询检查两个表' },
              { icon: '✅', title: '无阻塞', desc: '用户完全感知不到 Rehash，服务持续可用' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  padding: 24,
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 12,
                }}
              >
                <span style={{ fontSize: 40 }}>{item.icon}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 22, color: '#ffffff' }}>{item.title}</h3>
                  <p style={{ margin: '8px 0 0 0', fontSize: 16, color: '#a0a0a0' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default RehashProcess;

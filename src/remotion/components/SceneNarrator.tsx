/**
 * 旁白/文字说明组件
 * 用于在 Remotion 视频中显示教学文字
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '@/remotion/styles/hashtableStyles';

interface SceneNarratorProps {
  title?: string;
  subtitle?: string;
  text?: string;
  showProgress?: boolean;
  totalFrames?: number;
}

export const SceneNarrator: React.FC<SceneNarratorProps> = ({
  title,
  subtitle,
  text,
  showProgress = false,
  totalFrames = 150,
}) => {
  const frame = useCurrentFrame();
  const progress = frame / totalFrames;

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: 48,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* 顶部标题区 */}
      {title && (
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: '#e94560',
              margin: 0,
              lineHeight: 1.2,
              textShadow: '0 2px 10px rgba(233, 69, 96, 0.3)',
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontSize: 28,
                color: '#a0a0a0',
                margin: '16px 0 0 0',
                fontWeight: 400,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* 主要内容区 */}
      {text && (
        <div
          style={{
            fontSize: 24,
            color: '#ffffff',
            lineHeight: 1.6,
            maxWidth: 900,
          }}
        >
          {text}
        </div>
      )}

      {/* 底部进度条 */}
      {showProgress && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: '#2a2a4a',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress * 100}%`,
              background: 'linear-gradient(90deg, #e94560, #ff6b6b)',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      )}

      {/* 帧数指示器 */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 24,
          fontSize: 14,
          color: '#666',
          fontFamily: "'Courier New', monospace",
        }}
      >
        {frame} / {totalFrames}
      </div>
    </AbsoluteFill>
  );
};

export default SceneNarrator;

/**
 * Remotion 视频播放器组件
 * 用于在 React 页面中嵌入 Remotion 视频
 */

import React, { useRef, useState } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import styles from './RemotionPlayer.module.css';

export interface RemotionPlayerProps {
  /** 视频组件 */
  component: React.FC<any>;
  /** 视频时长（帧数） */
  durationInFrames: number;
  /** 视频宽度 */
  width?: number;
  /** 视频高度 */
  height?: number;
  /** 视频标题 */
  title?: string;
  /** 视频描述 */
  description?: string;
  /** 是否自动播放 */
  autoPlay?: boolean;
  /** 是否循环播放 */
  loop?: boolean;
  /** 是否显示控制栏 */
  showControls?: boolean;
  /** 自定义样式类 */
  className?: string;
  /** 传递给视频组件的 props */
  inputProps?: Record<string, unknown>;
}

export const RemotionPlayer: React.FC<RemotionPlayerProps> = ({
  component,
  durationInFrames,
  width = 1920,
  height = 1080,
  title,
  description,
  autoPlay = false,
  loop = true,
  showControls = true,
  className,
  inputProps = {},
}) => {
  const playerRef = useRef<PlayerRef>(null);
  const [progress, setProgress] = useState(0);

  // 计算播放百分比
  const progressPercent = durationInFrames > 0 ? (progress / durationInFrames) * 100 : 0;

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {/* 标题栏 */}
      {(title || description) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {description && <p className={styles.description}>{description}</p>}
        </div>
      )}

      {/* 播放器区域 */}
      <div className={styles.playerWrapper}>
        <Player
          ref={playerRef}
          component={component}
          durationInFrames={durationInFrames}
          fps={30}
          compositionWidth={width}
          compositionHeight={height}
          inputProps={inputProps}
          autoPlay={autoPlay}
          loop={loop}
          controls={showControls}
          style={{
            width: '100%',
            aspectRatio: `${width} / ${height}`,
          }}
        />
      </div>

      {/* 自定义进度条 */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 帧数指示器 */}
      <div className={styles.frameIndicator}>
        {Math.floor(progress / 30)}s / {Math.floor(durationInFrames / 30)}s
      </div>
    </div>
  );
};

export default RemotionPlayer;

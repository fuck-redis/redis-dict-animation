/**
 * 内联视频组件
 * 用于在文章中嵌入小型视频演示，看起来像"动态图示"
 */

import React, { useState } from 'react';
import { Player } from '@remotion/player';
import styles from './InlineVideo.module.css';

export interface InlineVideoProps {
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
  /** 是否自动循环播放 */
  loop?: boolean;
  /** 自定义样式类 */
  className?: string;
  /** 是否全宽显示 - 占满页面宽度 */
  fullWidth?: boolean;
}

export const InlineVideo: React.FC<InlineVideoProps> = ({
  component,
  durationInFrames,
  width = 640,
  height = 360,
  title,
  loop = true,
  className,
  fullWidth = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // 全宽模式下使用更大的尺寸
  const videoWidth = fullWidth ? 1200 : width;
  const videoHeight = fullWidth ? Math.round(1200 * 9 / 16) : height; // 16:9比例

  return (
    <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ''} ${className || ''}`}>
      {/* 视频播放器 */}
      <div className={styles.playerWrapper}>
        <Player
          component={component}
          durationInFrames={durationInFrames}
          fps={30}
          compositionWidth={videoWidth}
          compositionHeight={videoHeight}
          controls={false}
          loop={loop}
          autoPlay={true}
          style={{
            width: '100%',
            aspectRatio: `${videoWidth} / ${videoHeight}`,
          }}
        />
      </div>

      {/* 底部标题 */}
      {title && (
        <div className={styles.footer}>
          <span className={styles.playIcon}>▶</span>
          <span className={styles.title}>{title}</span>
          <span className={styles.duration}>
            {Math.floor(durationInFrames / 30)}s
          </span>
        </div>
      )}
    </div>
  );
};

export default InlineVideo;

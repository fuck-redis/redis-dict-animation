/**
 * 视频展示组件
 * 用于在页面中展示多个视频
 */

import React, { useState } from 'react';
import { Player } from '@remotion/player';
import type { ReactNode } from 'react';
import styles from './VideoGallery.module.css';

export interface VideoItem {
  id: string;
  component: React.FC<any>;
  title: string;
  description?: string;
  durationInFrames: number;
}

export interface VideoGalleryProps {
  videos: VideoItem[];
  title?: string;
  columns?: 1 | 2 | 3;
  className?: string;
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({
  videos,
  title,
  columns = 2,
  className,
}) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(
    videos.length > 0 ? videos[0].id : null
  );

  const currentVideo = videos.find((v) => v.id === activeVideo);

  return (
    <div className={`${styles.gallery} ${className || ''}`}>
      {/* 标题 */}
      {title && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>
      )}

      {/* 视频选择器 + 播放器 */}
      <div className={styles.content}>
        {/* 视频列表 */}
        <div className={styles.videoList}>
          {videos.map((video) => (
            <button
              key={video.id}
              className={`${styles.videoItem} ${
                activeVideo === video.id ? styles.active : ''
              }`}
              onClick={() => setActiveVideo(video.id)}
            >
              <div className={styles.videoThumbnail}>
                <span className={styles.playIcon}>▶</span>
              </div>
              <div className={styles.videoInfo}>
                <span className={styles.videoTitle}>{video.title}</span>
                <span className={styles.videoDuration}>
                  {Math.floor(video.durationInFrames / 30)}s
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* 主播放器 */}
        <div className={styles.mainPlayer}>
          {currentVideo && (
            <>
              <div className={styles.playerHeader}>
                <h3 className={styles.playerTitle}>{currentVideo.title}</h3>
                {currentVideo.description && (
                  <p className={styles.playerDescription}>
                    {currentVideo.description}
                  </p>
                )}
              </div>
              <div className={styles.playerWrapper}>
                <Player
                  component={currentVideo.component}
                  durationInFrames={currentVideo.durationInFrames}
                  fps={30}
                  compositionWidth={1920}
                  compositionHeight={1080}
                  controls={true}
                  style={{
                    width: '100%',
                    aspectRatio: '16 / 9',
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoGallery;

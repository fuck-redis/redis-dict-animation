/**
 * Performance 页内联视频组
 * 在文章中内嵌的小型视频演示
 */

import React from 'react';
import { Player } from '@remotion/player';
import { LoadFactorImpact, OptimizationTips } from '@/remotion/compositions/performance';
import styles from './ConceptVideos.module.css';

const PERFORMANCE_VIDEOS = [
  {
    id: 'load-factor',
    component: LoadFactorImpact,
    title: '负载因子对性能的影响',
    durationInFrames: 1500,
    width: 320,
    height: 180,
  },
  {
    id: 'optimization',
    component: OptimizationTips,
    title: '性能优化建议',
    durationInFrames: 1650,
    width: 320,
    height: 180,
  },
];

/**
 * 单个内联视频组件
 */
export const PerformanceInlineVideo: React.FC<{
  video: typeof PERFORMANCE_VIDEOS[0];
}> = ({ video }) => {
  return (
    <div className={styles.inlineVideo}>
      <div className={styles.videoWrapper}>
        <Player
          component={video.component}
          durationInFrames={video.durationInFrames}
          fps={30}
          compositionWidth={video.width}
          compositionHeight={video.height}
          controls={false}
          autoPlay={true}
          loop={true}
          style={{
            width: '100%',
            aspectRatio: `${video.width} / ${video.height}`,
          }}
        />
      </div>
      <div className={styles.caption}>
        <span className={styles.captionIcon}>▶</span>
        <span className={styles.captionText}>{video.title}</span>
      </div>
    </div>
  );
};

/**
 * Performance 页视频组 - 用于在文章中嵌入
 */
export const PerformanceVideos: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <div className={`${styles.videoGroup} ${className || ''}`}>
      <div className={styles.videoGrid}>
        {PERFORMANCE_VIDEOS.map((video) => (
          <PerformanceInlineVideo key={video.id} video={video} />
        ))}
      </div>
      <p className={styles.hint}>视频自动循环播放</p>
    </div>
  );
};

export default PerformanceVideos;

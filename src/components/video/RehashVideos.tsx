/**
 * Rehash 页内联视频组
 * 在文章中内嵌的小型视频演示
 */

import React from 'react';
import { Player } from '@remotion/player';
import { WhyRehash, RehashProcess, DualTableMechanism } from '@/remotion/compositions/rehash';
import styles from './ConceptVideos.module.css';

const REHASH_VIDEOS = [
  {
    id: 'why-rehash',
    component: WhyRehash,
    title: '为什么需要 Rehash',
    durationInFrames: 1350,
    width: 320,
    height: 180,
  },
  {
    id: 'rehash-process',
    component: RehashProcess,
    title: '渐进式 Rehash 过程',
    durationInFrames: 2100,
    width: 320,
    height: 180,
  },
  {
    id: 'dual-table',
    component: DualTableMechanism,
    title: '双表协同机制',
    durationInFrames: 1650,
    width: 320,
    height: 180,
  },
];

/**
 * 单个内联视频组件
 */
export const RehashInlineVideo: React.FC<{
  video: typeof REHASH_VIDEOS[0];
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
 * Rehash 页视频组 - 用于在文章中嵌入
 */
export const RehashVideos: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <div className={`${styles.videoGroup} ${className || ''}`}>
      <div className={styles.videoGrid}>
        {REHASH_VIDEOS.map((video) => (
          <RehashInlineVideo key={video.id} video={video} />
        ))}
      </div>
      <p className={styles.hint}>视频自动循环播放</p>
    </div>
  );
};

export default RehashVideos;

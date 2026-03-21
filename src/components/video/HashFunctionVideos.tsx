/**
 * Hash Functions 页内联视频组
 * 在文章中内嵌的小型视频演示
 */

import React from 'react';
import { Player } from '@remotion/player';
import { HashFunctionOverview, CollisionDemo, HashFloodingAttack } from '@/remotion/compositions/hash-functions';
import styles from './ConceptVideos.module.css';

const HASH_VIDEOS = [
  {
    id: 'hash-overview',
    component: HashFunctionOverview,
    title: '哈希函数概述',
    durationInFrames: 1200,
    width: 320,
    height: 180,
  },
  {
    id: 'collision-demo',
    component: CollisionDemo,
    title: '哈希冲突演示',
    durationInFrames: 1650,
    width: 320,
    height: 180,
  },
  {
    id: 'flooding-attack',
    component: HashFloodingAttack,
    title: '哈希洪水攻击',
    durationInFrames: 1500,
    width: 320,
    height: 180,
  },
];

/**
 * 单个内联视频组件
 */
export const HashFunctionInlineVideo: React.FC<{
  video: typeof HASH_VIDEOS[0];
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
 * Hash Functions 页视频组 - 用于在文章中嵌入
 */
export const HashFunctionVideos: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <div className={`${styles.videoGroup} ${className || ''}`}>
      <div className={styles.videoGrid}>
        {HASH_VIDEOS.map((video) => (
          <HashFunctionInlineVideo key={video.id} video={video} />
        ))}
      </div>
      <p className={styles.hint}>视频自动循环播放</p>
    </div>
  );
};

export default HashFunctionVideos;

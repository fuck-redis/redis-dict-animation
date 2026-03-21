/**
 * Iterator 页内联视频组
 * 在文章中内嵌的小型视频演示
 */

import React from 'react';
import { InlineVideo } from './InlineVideo';
import { SafeVsUnsafe, IteratorMechanism } from '@/remotion/compositions/iterator';
import styles from './ConceptVideos.module.css';

const ITERATOR_VIDEOS = [
  {
    id: 'safe-vs-unsafe',
    component: SafeVsUnsafe,
    title: '安全 vs 非安全迭代器',
    durationInFrames: 1800,
    width: 320,
    height: 180,
  },
  {
    id: 'iterator-mechanism',
    component: IteratorMechanism,
    title: '迭代器机制详解',
    durationInFrames: 1650,
    width: 320,
    height: 180,
  },
];

/**
 * Iterator 页视频组 - 用于在文章中嵌入
 */
export const IteratorVideos: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <div className={`${styles.videoGroup} ${className || ''}`}>
      <div className={styles.videoGrid}>
        {ITERATOR_VIDEOS.map((video) => (
          <InlineVideo
            key={video.id}
            component={video.component}
            durationInFrames={video.durationInFrames}
            width={video.width}
            height={video.height}
            title={video.title}
            loop={true}
          />
        ))}
      </div>
      <p className={styles.hint}>视频自动循环播放</p>
    </div>
  );
};

export default IteratorVideos;

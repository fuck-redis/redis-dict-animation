/**
 * 概念页视频配置数据
 * 用于在文章中内嵌小型视频演示
 */

import { WhatIsDict, SeparateChaining, DictStructure } from '@/remotion/compositions/concept';

/**
 * 视频配置项
 */
export interface ConceptVideoConfig {
  id: string;
  component: React.FC<any>;
  title: string;
  durationInFrames: number;
  width: number;
  height: number;
}

/**
 * 概念页视频配置列表
 */
export const CONCEPT_VIDEOS: ConceptVideoConfig[] = [
  {
    id: 'what-is-dict',
    component: WhatIsDict,
    title: '什么是 Redis Dict',
    durationInFrames: 1350,
    width: 320,
    height: 180,
  },
  {
    id: 'separate-chaining',
    component: SeparateChaining,
    title: '链地址法解决冲突',
    durationInFrames: 1800,
    width: 320,
    height: 180,
  },
  {
    id: 'dict-structure',
    component: DictStructure,
    title: '双哈希表结构',
    durationInFrames: 1500,
    width: 320,
    height: 180,
  },
];

export default CONCEPT_VIDEOS;

/**
 * 生成状态快照序列
 * 用于 Remotion 视频动画
 */

import { createDict, dictSet, dictStartRehash, dictRehashStep, cloneDictState } from '@/core/dict';
import type { DictState } from '@/remotion/types';

export interface Snapshot {
  state: DictState;
  description: string;
  frame: number;
}

export interface AnimationSequence {
  snapshots: Snapshot[];
  totalFrames: number;
  fps: number;
}

/**
 * 生成插入操作的快照序列
 */
export function generateInsertSequence(
  keys: string[],
  values: string[],
  fps: number = 30,
  framesPerSnapshot: number = 30
): AnimationSequence {
  const snapshots: Snapshot[] = [];
  const dict = createDict(4);

  // 初始状态
  snapshots.push({
    state: cloneDictState(dict),
    description: '初始状态 - 空哈希表',
    frame: 0,
  });

  // 每个插入操作
  keys.forEach((key, index) => {
    dictSet(dict, { key, value: values[index] || `value_${key}` });
    snapshots.push({
      state: cloneDictState(dict),
      description: `插入 ${key}:${values[index] || `value_${key}`}`,
      frame: (index + 1) * framesPerSnapshot,
    });
  });

  const totalFrames = snapshots.length * framesPerSnapshot;

  return { snapshots, totalFrames, fps };
}

/**
 * 生成 Rehash 操作的快照序列
 */
export function generateRehashSequence(
  initialKeys: string[],
  initialValues: string[],
  targetSize: number,
  fps: number = 30,
  framesPerSnapshot: number = 30
): AnimationSequence {
  const snapshots: Snapshot[] = [];
  const dict = createDict(4);

  // 插入初始数据
  initialKeys.forEach((key, index) => {
    dictSet(dict, { key, value: initialValues[index] || `value_${key}` });
  });

  snapshots.push({
    state: cloneDictState(dict),
    description: '准备开始 Rehash',
    frame: 0,
  });

  // 开始 Rehash
  dictStartRehash(dict, { targetSize });

  snapshots.push({
    state: cloneDictState(dict),
    description: `开始 Rehash 到 ${targetSize}`,
    frame: framesPerSnapshot,
  });

  // 执行 Rehash 步骤
  let frameIndex = framesPerSnapshot * 2;
  while (dict.rehashidx !== -1) {
    dictRehashStep(dict, { rehashSteps: 1 });
    snapshots.push({
      state: cloneDictState(dict),
      description: `Rehash 进度: 桶 ${dict.rehashidx}`,
      frame: frameIndex,
    });
    frameIndex += framesPerSnapshot;
  }

  snapshots.push({
    state: cloneDictState(dict),
    description: 'Rehash 完成',
    frame: frameIndex,
  });

  const totalFrames = frameIndex + framesPerSnapshot;

  return { snapshots, totalFrames, fps };
}

/**
 * 生成哈希冲突演示序列
 */
export function generateCollisionDemoSequence(
  keys: string[],
  hashFunctionId: string,
  fps: number = 30,
  framesPerSnapshot: number = 30
): AnimationSequence {
  const snapshots: Snapshot[] = [];
  const dict = createDict(4, hashFunctionId);

  snapshots.push({
    state: cloneDictState(dict),
    description: '使用简单哈希函数',
    frame: 0,
  });

  keys.forEach((key, index) => {
    dictSet(dict, { key, value: `value_${key}` });
    snapshots.push({
      state: cloneDictState(dict),
      description: `插入 ${key}`,
      frame: (index + 1) * framesPerSnapshot,
    });
  });

  const totalFrames = snapshots.length * framesPerSnapshot;

  return { snapshots, totalFrames, fps };
}

/**
 * 计算链长度
 */
export function getChainLength(entry: any): number {
  if (!entry) return 0;
  let count = 0;
  let current = entry;
  while (current) {
    count++;
    current = current.next;
  }
  return count;
}

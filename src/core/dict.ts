/**
 * Redis Dict 核心实现
 */

import {
  DictState,
  DictHashTable,
  DictEntry,
  DictType,
  DictStats,
  OperationParams,
  OperationResult,
  AnimationStep,
} from '@/types/dict';
import { getHashFunction } from './hashFunctions';

/**
 * 创建新的哈希表
 */
function createHashTable(size: number): DictHashTable {
  return {
    table: new Array(size).fill(null),
    size,
    sizemask: size - 1,
    used: 0,
    loadFactor: 0,
  };
}

/**
 * 创建新的字典节点
 */
function createEntry(
  key: string,
  value: string,
  hash: number
): DictEntry {
  return {
    key,
    value,
    hash,
    next: null,
    isNew: true,
  };
}

/**
 * 计算负载因子
 */
function calculateLoadFactor(ht: DictHashTable): number {
  return ht.size > 0 ? ht.used / ht.size : 0;
}

/**
 * 计算下一个2的幂次
 */
function nextPower(size: number): number {
  let i = 4; // 最小大小为4
  while (i < size) {
    i *= 2;
  }
  return i;
}

/**
 * 创建新字典
 */
export function createDict(
  initialSize: number = 4,
  hashFunctionId: string = 'siphash'
): DictState {
  const hashFunction = getHashFunction(hashFunctionId);
  
  const dictType: DictType = {
    hashFunction,
    keyCompare: (k1, k2) => k1 === k2,
  };
  
  const stats: DictStats = {
    totalOperations: 0,
    hashCollisions: 0,
    rehashOperations: 0,
    averageProbeLength: 0,
    memoryUsage: 0,
    maxChainLength: 0,
  };
  
  return {
    type: dictType,
    ht: [createHashTable(initialSize), createHashTable(0)],
    rehashidx: -1,
    iterators: 0,
    pauseRehash: false,
    stats,
  };
}

/**
 * 判断是否正在进行Rehash
 */
export function isRehashing(dict: DictState): boolean {
  return dict.rehashidx !== -1;
}

/**
 * 在哈希表中查找键
 */
function findEntry(
  ht: DictHashTable,
  key: string,
  hash: number
): DictEntry | null {
  const index = hash & ht.sizemask;
  let entry = ht.table[index];
  
  while (entry !== null) {
    if (entry.key === key) {
      return entry;
    }
    entry = entry.next;
  }
  
  return null;
}

/**
 * 设置键值对
 */
export function dictSet(
  dict: DictState,
  params: OperationParams
): OperationResult {
  const { key, value } = params;
  if (!key || !value) {
    return { success: false, message: '键和值不能为空' };
  }
  
  const hash = dict.type.hashFunction(key);
  
  // 如果正在Rehash，使用ht[1]
  const htIndex = isRehashing(dict) ? 1 : 0;
  const ht = dict.ht[htIndex];
  const index = hash & ht.sizemask;
  
  // 检查键是否已存在
  let entry = ht.table[index];
  let chainLength = 0;
  
  while (entry !== null) {
    chainLength++;
    if (entry.key === key) {
      // 更新现有键
      entry.value = value;
      entry.isHighlighted = true;
      dict.stats.totalOperations++;
      return {
        success: true,
        message: `键 "${key}" 已更新`,
        stats: { totalOperations: dict.stats.totalOperations },
      };
    }
    entry = entry.next;
  }
  
  // 插入新键
  const newEntry = createEntry(key, value, hash);
  
  // 头插法
  newEntry.next = ht.table[index];
  ht.table[index] = newEntry;
  ht.used++;
  
  // 更新统计
  if (chainLength > 0) {
    dict.stats.hashCollisions++;
  }
  
  dict.stats.totalOperations++;
  dict.stats.maxChainLength = Math.max(
    dict.stats.maxChainLength,
    chainLength + 1
  );
  
  // 更新负载因子
  ht.loadFactor = calculateLoadFactor(ht);
  
  return {
    success: true,
    message: `键 "${key}" 已插入${chainLength > 0 ? '（发生冲突）' : ''}`,
    stats: {
      totalOperations: dict.stats.totalOperations,
      hashCollisions: dict.stats.hashCollisions,
      maxChainLength: dict.stats.maxChainLength,
    },
  };
}

/**
 * 获取键对应的值
 */
export function dictGet(
  dict: DictState,
  params: OperationParams
): OperationResult {
  const { key } = params;
  if (!key) {
    return { success: false, message: '键不能为空' };
  }
  
  const hash = dict.type.hashFunction(key);
  
  // 在两个哈希表中查找
  for (let i = 0; i <= 1; i++) {
    if (dict.ht[i].size === 0) continue;
    
    const entry = findEntry(dict.ht[i], key, hash);
    if (entry) {
      entry.isHighlighted = true;
      dict.stats.totalOperations++;
      return {
        success: true,
        message: `找到键 "${key}"`,
        value: entry.value,
        stats: { totalOperations: dict.stats.totalOperations },
      };
    }
  }
  
  dict.stats.totalOperations++;
  return {
    success: false,
    message: `键 "${key}" 不存在`,
    stats: { totalOperations: dict.stats.totalOperations },
  };
}

/**
 * 删除键值对
 */
export function dictDelete(
  dict: DictState,
  params: OperationParams
): OperationResult {
  const { key } = params;
  if (!key) {
    return { success: false, message: '键不能为空' };
  }
  
  const hash = dict.type.hashFunction(key);
  
  // 在两个哈希表中查找并删除
  for (let i = 0; i <= 1; i++) {
    const ht = dict.ht[i];
    if (ht.size === 0) continue;
    
    const index = hash & ht.sizemask;
    let entry = ht.table[index];
    let prevEntry: DictEntry | null = null;
    
    while (entry !== null) {
      if (entry.key === key) {
        // 找到了，删除节点
        if (prevEntry) {
          prevEntry.next = entry.next;
        } else {
          ht.table[index] = entry.next;
        }
        
        ht.used--;
        ht.loadFactor = calculateLoadFactor(ht);
        dict.stats.totalOperations++;
        
        return {
          success: true,
          message: `键 "${key}" 已删除`,
          stats: { totalOperations: dict.stats.totalOperations },
        };
      }
      
      prevEntry = entry;
      entry = entry.next;
    }
  }
  
  dict.stats.totalOperations++;
  return {
    success: false,
    message: `键 "${key}" 不存在`,
    stats: { totalOperations: dict.stats.totalOperations },
  };
}

/**
 * 开始Rehash
 */
export function dictStartRehash(
  dict: DictState,
  params: OperationParams
): OperationResult {
  if (isRehashing(dict)) {
    return { success: false, message: 'Rehash已在进行中' };
  }
  
  const targetSize = params.targetSize || dict.ht[0].used * 2;
  const newSize = nextPower(targetSize);
  
  // 创建新的哈希表
  dict.ht[1] = createHashTable(newSize);
  dict.rehashidx = 0;
  dict.stats.rehashOperations++;
  
  return {
    success: true,
    message: `开始Rehash: ${dict.ht[0].size} → ${newSize}`,
    stats: { rehashOperations: dict.stats.rehashOperations },
  };
}

/**
 * 执行一步Rehash
 */
export function dictRehashStep(
  dict: DictState,
  params: OperationParams
): OperationResult {
  if (!isRehashing(dict)) {
    return { success: false, message: '当前未在进行Rehash' };
  }
  
  const steps = params.rehashSteps || 1;
  let movedEntries = 0;
  
  for (let i = 0; i < steps; i++) {
    // 跳过空桶
    while (
      dict.rehashidx < dict.ht[0].size &&
      dict.ht[0].table[dict.rehashidx] === null
    ) {
      dict.rehashidx++;
    }
    
    // Rehash完成
    if (dict.rehashidx >= dict.ht[0].size) {
      // 交换哈希表
      dict.ht[0] = dict.ht[1];
      dict.ht[1] = createHashTable(0);
      dict.rehashidx = -1;
      
      return {
        success: true,
        message: 'Rehash完成',
        stats: { rehashOperations: dict.stats.rehashOperations },
      };
    }
    
    // 迁移当前桶的所有节点
    let entry = dict.ht[0].table[dict.rehashidx];
    while (entry !== null) {
      const nextEntry = entry.next;
      const index = entry.hash & dict.ht[1].sizemask;
      
      // 头插法插入到新表
      entry.next = dict.ht[1].table[index];
      dict.ht[1].table[index] = entry;
      entry.isRehashing = true;
      
      dict.ht[0].used--;
      dict.ht[1].used++;
      movedEntries++;
      
      entry = nextEntry;
    }
    
    dict.ht[0].table[dict.rehashidx] = null;
    dict.rehashidx++;
  }
  
  // 更新负载因子
  dict.ht[0].loadFactor = calculateLoadFactor(dict.ht[0]);
  dict.ht[1].loadFactor = calculateLoadFactor(dict.ht[1]);
  
  const progress = (dict.rehashidx / dict.ht[0].size) * 100;
  
  return {
    success: true,
    message: `已迁移 ${movedEntries} 个节点，进度: ${progress.toFixed(1)}%`,
    stats: { rehashOperations: dict.stats.rehashOperations },
  };
}

/**
 * 计算平均查找长度
 */
export function calculateAverageProbeLength(dict: DictState): number {
  let totalProbes = 0;
  let totalEntries = 0;
  
  for (let htIndex = 0; htIndex <= 1; htIndex++) {
    const ht = dict.ht[htIndex];
    if (ht.size === 0) continue;
    
    for (let i = 0; i < ht.size; i++) {
      let entry = ht.table[i];
      let chainLength = 0;
      
      while (entry !== null) {
        chainLength++;
        totalProbes += chainLength;
        totalEntries++;
        entry = entry.next;
      }
    }
  }
  
  return totalEntries > 0 ? totalProbes / totalEntries : 0;
}

/**
 * 更新字典统计信息
 */
export function updateDictStats(dict: DictState): void {
  dict.stats.averageProbeLength = calculateAverageProbeLength(dict);
  
  // 计算内存使用（简化估算）
  const entrySize = 64; // 每个节点大约64字节
  const tableSize = (dict.ht[0].size + dict.ht[1].size) * 8; // 指针数组
  dict.stats.memoryUsage = 
    (dict.ht[0].used + dict.ht[1].used) * entrySize + tableSize;
}

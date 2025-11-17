/**
 * 哈希函数实现集合
 */

import { HashFunctionConfig } from '@/types/dict';

/**
 * SipHash - Redis默认哈希函数的简化版本
 * 注：真实Redis使用完整的SipHash-2-4，这里使用简化版本用于演示
 */
function sipHash(key: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
    // 额外的混淆步骤
    hash ^= (hash >>> 13);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/**
 * DJB2 哈希函数
 * 简单快速，但分布一般
 */
function djb2Hash(key: string): number {
  let hash = 5381;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) + hash) + key.charCodeAt(i);
    hash = hash >>> 0;
  }
  return hash;
}

/**
 * FNV-1a 哈希函数
 * 分布良好，速度较快
 */
function fnv1aHash(key: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash;
}

/**
 * MurmurHash3 简化版本
 * 分布优秀，抗碰撞强
 */
function murmur3Hash(key: string): number {
  let hash = 0;
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;
  
  for (let i = 0; i < key.length; i++) {
    let k = key.charCodeAt(i);
    k = (k * c1) >>> 0;
    k = ((k << 15) | (k >>> 17)) >>> 0;
    k = (k * c2) >>> 0;
    
    hash ^= k;
    hash = ((hash << 13) | (hash >>> 19)) >>> 0;
    hash = ((hash * 5) + 0xe6546b64) >>> 0;
  }
  
  hash ^= key.length;
  hash ^= (hash >>> 16);
  hash = (hash * 0x85ebca6b) >>> 0;
  hash ^= (hash >>> 13);
  hash = (hash * 0xc2b2ae35) >>> 0;
  hash ^= (hash >>> 16);
  
  return hash >>> 0;
}

/**
 * 简单取模哈希（用于演示冲突）
 */
function simpleHash(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash += key.charCodeAt(i);
  }
  return hash;
}

// 导出所有哈希函数配置
export const HASH_FUNCTIONS: HashFunctionConfig[] = [
  {
    id: 'siphash',
    name: 'SipHash (Redis默认)',
    description: '抗哈希洪水攻击，性能良好，Redis实际使用的哈希函数',
    complexity: 'medium',
    implementation: sipHash,
  },
  {
    id: 'djb2',
    name: 'DJB2',
    description: '简单快速，但分布一般，适合非安全场景',
    complexity: 'simple',
    implementation: djb2Hash,
  },
  {
    id: 'fnv1a',
    name: 'FNV-1a',
    description: '分布良好，速度较快，广泛使用的非加密哈希函数',
    complexity: 'simple',
    implementation: fnv1aHash,
  },
  {
    id: 'murmur3',
    name: 'MurmurHash3',
    description: '分布优秀，抗碰撞强，常用于布隆过滤器等场景',
    complexity: 'medium',
    implementation: murmur3Hash,
  },
  {
    id: 'simple',
    name: '简单求和哈希',
    description: '仅用于演示冲突，实际不推荐使用',
    complexity: 'simple',
    implementation: simpleHash,
  },
];

/**
 * 根据ID获取哈希函数
 */
export function getHashFunction(id: string): (key: string) => number {
  const config = HASH_FUNCTIONS.find(f => f.id === id);
  return config ? config.implementation : sipHash;
}

/**
 * 计算哈希值并展示计算过程
 */
export function calculateHashWithSteps(key: string, hashFunctionId: string) {
  const hashFn = getHashFunction(hashFunctionId);
  const hash = hashFn(key);
  
  return {
    key,
    hashFunctionId,
    hash,
    hexHash: '0x' + hash.toString(16).toUpperCase(),
    steps: [
      `输入键: "${key}"`,
      `计算哈希值: ${hashFunctionId}("${key}")`,
      `哈希值(十进制): ${hash}`,
      `哈希值(十六进制): 0x${hash.toString(16).toUpperCase()}`,
    ],
  };
}

/**
 * 计算索引（哈希值与掩码）
 */
export function calculateIndex(hash: number, sizemask: number): number {
  return hash & sizemask;
}

/**
 * 展示索引计算过程
 */
export function calculateIndexWithSteps(
  key: string,
  hashFunctionId: string,
  tableSize: number
) {
  const hashResult = calculateHashWithSteps(key, hashFunctionId);
  const sizemask = tableSize - 1;
  const index = calculateIndex(hashResult.hash, sizemask);
  
  return {
    ...hashResult,
    tableSize,
    sizemask,
    sizemaskBinary: sizemask.toString(2).padStart(8, '0'),
    index,
    steps: [
      ...hashResult.steps,
      `哈希表大小: ${tableSize}`,
      `大小掩码: ${sizemask} (0b${sizemask.toString(2)})`,
      `计算索引: ${hashResult.hash} & ${sizemask} = ${index}`,
      `桶索引: ${index}`,
    ],
  };
}

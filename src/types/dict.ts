/**
 * Redis Dict 核心数据结构类型定义
 */

// 哈希表节点
export interface DictEntry {
  key: string;                    // 键
  value: string;                  // 值
  next: DictEntry | null;         // 下一个节点（解决哈希冲突）
  hash: number;                   // 键的哈希值
  isNew?: boolean;                // 是否为新插入
  isRehashing?: boolean;          // 是否正在Rehash
  isHighlighted?: boolean;        // 是否高亮显示
}

// 哈希表
export interface DictHashTable {
  table: (DictEntry | null)[];    // 哈希桶数组
  size: number;                   // 哈希表大小
  sizemask: number;               // 大小掩码 (size - 1)
  used: number;                   // 已使用节点数量
  loadFactor: number;             // 负载因子 (used / size)
}

// 字典类型
export interface DictType {
  hashFunction: (key: string) => number;  // 哈希函数
  keyDup?: (key: string) => string;       // 键复制函数
  valDup?: (val: string) => string;       // 值复制函数
  keyCompare?: (k1: string, k2: string) => boolean;  // 键比较函数
}

// 字典统计信息
export interface DictStats {
  totalOperations: number;       // 总操作次数
  hashCollisions: number;        // 哈希冲突次数
  rehashOperations: number;      // Rehash操作次数
  averageProbeLength: number;    // 平均查找长度
  memoryUsage: number;           // 内存使用量（字节）
  maxChainLength: number;        // 最长冲突链长度
}

// Redis字典状态
export interface DictState {
  type: DictType;                // 字典类型
  ht: [DictHashTable, DictHashTable]; // 两个哈希表
  rehashidx: number;             // Rehash索引，-1表示不在Rehash
  iterators: number;             // 当前迭代器数量
  pauseRehash: boolean;          // 是否暂停Rehash
  stats: DictStats;              // 统计信息
}

// 操作类型
export type DictOperation = 
  | 'create'              // 创建字典
  | 'set'                 // 设置键值对
  | 'get'                 // 获取值
  | 'delete'              // 删除键值对
  | 'exists'              // 检查键是否存在
  | 'resize'              // 调整大小
  | 'startRehash'         // 开始Rehash
  | 'rehashStep'          // 执行Rehash步骤
  | 'pauseRehash'         // 暂停Rehash
  | 'resumeRehash'        // 恢复Rehash
  | 'batchOperation';     // 批量操作

// 操作参数
export interface OperationParams {
  key?: string;                   // 键
  value?: string;                 // 值
  keys?: string[];                // 批量键
  values?: string[];              // 批量值
  targetSize?: number;            // 目标大小
  rehashSteps?: number;           // Rehash步骤数
  hashFunction?: string;          // 哈希函数选择
}

// 操作结果
export interface OperationResult {
  success: boolean;               // 操作是否成功
  message: string;                // 结果消息
  value?: string;                 // 返回值（get操作）
  stats?: Partial<DictStats>;     // 统计更新
}

// 动画步骤
export interface AnimationStep {
  type: 'highlight' | 'move' | 'insert' | 'delete' | 'update' | 'rehash';
  target: 'entry' | 'bucket' | 'table';
  tableIndex: 0 | 1;              // 哈希表索引
  bucketIndex?: number;           // 桶索引
  entry?: DictEntry;              // 涉及的节点
  duration: number;               // 动画持续时间（ms）
  description: string;            // 步骤描述
}

// 哈希函数配置
export interface HashFunctionConfig {
  id: string;
  name: string;
  description: string;
  complexity: 'simple' | 'medium' | 'complex';
  implementation: (key: string) => number;
}

// Rehash配置
export interface RehashConfig {
  autoRehash: boolean;           // 自动触发Rehash
  rehashBatchSize: number;       // 每步迁移桶数 (1-10)
  loadFactorThreshold: number;   // 负载因子阈值 (0.1-2.0)
  showStepByStep: boolean;       // 逐步显示过程
  pauseOnConflict: boolean;      // 冲突时暂停
}

// 字典配置
export interface DictConfig {
  initialSize: number;           // 初始大小 (2的幂次)
  loadFactorThreshold: number;   // 负载因子阈值
  rehashBatchSize: number;       // Rehash批处理大小
  hashFunction: string;          // 哈希函数选择
  autoRehash: boolean;           // 自动Rehash
}

// 配置预设
export interface ConfigPreset {
  name: string;
  config: DictConfig;
  useCase: string;
  description: string;
}

// 工作负载模式
export interface WorkloadPattern {
  name: string;
  pattern: string;
  effect: string;
  operations: Array<{
    operation: DictOperation;
    params: OperationParams;
  }>;
}

// 哈希函数性能指标
export interface HashFunctionMetrics {
  distribution: number;      // 分布均匀性 (0-100)
  collisionRate: number;     // 碰撞率 (0-1)
  speed: number;            // 计算速度 (ops/sec)
  memoryUsage: number;      // 内存使用 (bytes)
  resistance: number;       // 抗攻击能力 (0-100)
}

// 冲突分析报告
export interface CollisionReport {
  totalEntries: number;          // 总键值对
  conflictedEntries: number;     // 冲突键值对
  maxChainLength: number;        // 最长冲突链
  worstBucket: number;           // 冲突最严重的桶
  averageChainLength: number;    // 平均冲突链长度
  recommendation: string;        // 建议
}

/**
 * 字典操作的自定义Hook
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  DictState,
  DictOperation,
  OperationParams,
  OperationResult,
  RehashConfig,
} from '@/types/dict';
import {
  createDict,
  cloneDictState,
  dictSet,
  dictGet,
  dictExists,
  dictDelete,
  dictStartRehash,
  dictRehashStep,
  updateDictStats,
  isRehashing,
} from '@/core/dict';

interface OperationExecution {
  result: OperationResult;
  snapshot: DictState;
}

interface UseDictReturn {
  dict: DictState;
  executeOperation: (
    operation: DictOperation,
    params: OperationParams
  ) => OperationResult;
  executeOperationWithSnapshot: (
    operation: DictOperation,
    params: OperationParams
  ) => OperationExecution;
  reset: (initialSize?: number, hashFunction?: string) => void;
  resetWithSnapshot: (initialSize?: number, hashFunction?: string) => DictState;
  rehashConfig: RehashConfig;
  updateRehashConfig: (config: Partial<RehashConfig>) => void;
}

function applyOperation(
  dict: DictState,
  operation: DictOperation,
  params: OperationParams
): OperationResult {
  switch (operation) {
    case 'set':
      return dictSet(dict, params);
    case 'get':
      return dictGet(dict, params);
    case 'exists':
      return dictExists(dict, params);
    case 'delete':
      return dictDelete(dict, params);
    case 'startRehash':
      return dictStartRehash(dict, params);
    case 'rehashStep':
      return dictRehashStep(dict, params);
    default:
      return {
        success: false,
        message: `未知操作: ${operation}`,
      };
  }
}

export function useDict(
  initialSize: number = 8,
  hashFunctionId: string = 'siphash'
): UseDictReturn {
  const [dict, setDict] = useState<DictState>(() =>
    createDict(initialSize, hashFunctionId)
  );
  const dictRef = useRef(dict);

  useEffect(() => {
    dictRef.current = dict;
  }, [dict]);

  const [rehashConfig, setRehashConfig] = useState<RehashConfig>({
    autoRehash: true,
    rehashBatchSize: 1,
    loadFactorThreshold: 1.0,
    showStepByStep: true,
    pauseOnConflict: false,
  });

  const executeOperationWithSnapshot = useCallback(
    (operation: DictOperation, params: OperationParams): OperationExecution => {
      const nextDict = cloneDictState(dictRef.current);
      const result = applyOperation(nextDict, operation, params);

      updateDictStats(nextDict);
      dictRef.current = nextDict;
      setDict(nextDict);

      return {
        result,
        snapshot: cloneDictState(nextDict),
      };
    },
    []
  );

  const executeOperation = useCallback(
    (operation: DictOperation, params: OperationParams): OperationResult =>
      executeOperationWithSnapshot(operation, params).result,
    [executeOperationWithSnapshot]
  );

  const resetWithSnapshot = useCallback(
    (newSize?: number, newHashFunction?: string): DictState => {
      const nextDict = createDict(
        newSize || initialSize,
        newHashFunction || hashFunctionId
      );
      updateDictStats(nextDict);
      dictRef.current = nextDict;
      setDict(nextDict);
      return cloneDictState(nextDict);
    },
    [initialSize, hashFunctionId]
  );

  const reset = useCallback(
    (newSize?: number, newHashFunction?: string) => {
      resetWithSnapshot(newSize, newHashFunction);
    },
    [resetWithSnapshot]
  );

  // 自动Rehash检查
  useEffect(() => {
    if (!rehashConfig.autoRehash) return;
    if (isRehashing(dictRef.current)) return;

    const ht = dictRef.current.ht[0];
    if (ht.loadFactor < rehashConfig.loadFactorThreshold) return;

    const nextDict = cloneDictState(dictRef.current);
    dictStartRehash(nextDict, {});
    updateDictStats(nextDict);
    dictRef.current = nextDict;
    setDict(nextDict);
  }, [dict, rehashConfig.autoRehash, rehashConfig.loadFactorThreshold]);

  const updateRehashConfig = useCallback((config: Partial<RehashConfig>) => {
    setRehashConfig((prev) => ({ ...prev, ...config }));
  }, []);

  return {
    dict,
    executeOperation,
    executeOperationWithSnapshot,
    reset,
    resetWithSnapshot,
    rehashConfig,
    updateRehashConfig,
  };
}


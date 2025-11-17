/**
 * 字典操作的自定义Hook
 */

import { useState, useCallback, useEffect } from 'react';
import {
  DictState,
  DictOperation,
  OperationParams,
  OperationResult,
  RehashConfig,
} from '@/types/dict';
import {
  createDict,
  dictSet,
  dictGet,
  dictDelete,
  dictStartRehash,
  dictRehashStep,
  updateDictStats,
  isRehashing,
} from '@/core/dict';

interface UseDictReturn {
  dict: DictState;
  executeOperation: (
    operation: DictOperation,
    params: OperationParams
  ) => OperationResult;
  reset: (initialSize?: number, hashFunction?: string) => void;
  rehashConfig: RehashConfig;
  updateRehashConfig: (config: Partial<RehashConfig>) => void;
}

export function useDict(
  initialSize: number = 8,
  hashFunctionId: string = 'siphash'
): UseDictReturn {
  const [dict, setDict] = useState<DictState>(() =>
    createDict(initialSize, hashFunctionId)
  );
  
  const [rehashConfig, setRehashConfig] = useState<RehashConfig>({
    autoRehash: true,
    rehashBatchSize: 1,
    loadFactorThreshold: 1.0,
    showStepByStep: true,
    pauseOnConflict: false,
  });
  
  // 自动Rehash检查
  useEffect(() => {
    if (!rehashConfig.autoRehash) return;
    if (isRehashing(dict)) return;
    
    const ht = dict.ht[0];
    if (ht.loadFactor >= rehashConfig.loadFactorThreshold) {
      setDict(prevDict => {
        const newDict = { ...prevDict };
        dictStartRehash(newDict, {});
        return newDict;
      });
    }
  }, [dict, rehashConfig]);
  
  const executeOperation = useCallback(
    (operation: DictOperation, params: OperationParams): OperationResult => {
      let result: OperationResult;
      
      setDict(prevDict => {
        const newDict = { ...prevDict };
        
        switch (operation) {
          case 'set':
            result = dictSet(newDict, params);
            break;
          case 'get':
            result = dictGet(newDict, params);
            break;
          case 'delete':
            result = dictDelete(newDict, params);
            break;
          case 'startRehash':
            result = dictStartRehash(newDict, params);
            break;
          case 'rehashStep':
            result = dictRehashStep(newDict, params);
            break;
          default:
            result = {
              success: false,
              message: `未知操作: ${operation}`,
            };
        }
        
        // 更新统计信息
        updateDictStats(newDict);
        
        return newDict;
      });
      
      return result!;
    },
    []
  );
  
  const reset = useCallback(
    (newSize?: number, newHashFunction?: string) => {
      setDict(createDict(newSize || initialSize, newHashFunction || hashFunctionId));
    },
    [initialSize, hashFunctionId]
  );
  
  const updateRehashConfig = useCallback(
    (config: Partial<RehashConfig>) => {
      setRehashConfig(prev => ({ ...prev, ...config }));
    },
    []
  );
  
  return {
    dict,
    executeOperation,
    reset,
    rehashConfig,
    updateRehashConfig,
  };
}

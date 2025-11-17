/**
 * 操作控制面板
 */

import React, { useState } from 'react';
import { DictOperation, OperationParams } from '@/types/dict';
import styles from './OperationPanel.module.css';

interface OperationGroup {
  name: string;
  operations: Array<{
    id: DictOperation;
    label: string;
    icon: string;
  }>;
}

const OPERATION_GROUPS: OperationGroup[] = [
  {
    name: '键值操作',
    operations: [
      { id: 'set', label: '设置键值', icon: '➕' },
      { id: 'get', label: '获取值', icon: '🔍' },
      { id: 'delete', label: '删除键', icon: '❌' },
      { id: 'exists', label: '检查存在', icon: '❓' },
    ],
  },
  {
    name: 'Rehash控制',
    operations: [
      { id: 'startRehash', label: '开始Rehash', icon: '🔄' },
      { id: 'rehashStep', label: 'Rehash步骤', icon: '⏭️' },
    ],
  },
];

interface OperationPanelProps {
  onExecute: (operation: DictOperation, params: OperationParams) => void;
  disabled?: boolean;
}

export const OperationPanel: React.FC<OperationPanelProps> = ({
  onExecute,
  disabled = false,
}) => {
  const [selectedOperation, setSelectedOperation] = useState<DictOperation>('set');
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [rehashSteps, setRehashSteps] = useState(1);
  const [targetSize, setTargetSize] = useState(16);
  
  const handleExecute = () => {
    const params: OperationParams = {};
    
    switch (selectedOperation) {
      case 'set':
        if (!key || !value) {
          alert('请输入键和值');
          return;
        }
        params.key = key;
        params.value = value;
        break;
      case 'get':
      case 'delete':
      case 'exists':
        if (!key) {
          alert('请输入键');
          return;
        }
        params.key = key;
        break;
      case 'rehashStep':
        params.rehashSteps = rehashSteps;
        break;
      case 'startRehash':
        params.targetSize = targetSize;
        break;
    }
    
    onExecute(selectedOperation, params);
    
    // 清空输入（可选）
    if (selectedOperation === 'set') {
      setKey('');
      setValue('');
    }
  };
  
  const renderInputFields = () => {
    switch (selectedOperation) {
      case 'set':
        return (
          <>
            <div className={styles.inputGroup}>
              <label>键 (Key):</label>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="例如: key1"
                disabled={disabled}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>值 (Value):</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="例如: value1"
                disabled={disabled}
              />
            </div>
          </>
        );
      case 'get':
      case 'delete':
      case 'exists':
        return (
          <div className={styles.inputGroup}>
            <label>键 (Key):</label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="例如: key1"
              disabled={disabled}
            />
          </div>
        );
      case 'rehashStep':
        return (
          <div className={styles.inputGroup}>
            <label>迁移步数:</label>
            <input
              type="number"
              min="1"
              max="10"
              value={rehashSteps}
              onChange={(e) => setRehashSteps(parseInt(e.target.value) || 1)}
              disabled={disabled}
            />
          </div>
        );
      case 'startRehash':
        return (
          <div className={styles.inputGroup}>
            <label>目标大小:</label>
            <input
              type="number"
              min="4"
              step="4"
              value={targetSize}
              onChange={(e) => setTargetSize(parseInt(e.target.value) || 16)}
              disabled={disabled}
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>操作控制</h3>
      
      <div className={styles.operationGroups}>
        {OPERATION_GROUPS.map((group) => (
          <div key={group.name} className={styles.group}>
            <div className={styles.groupName}>{group.name}</div>
            <div className={styles.operations}>
              {group.operations.map((op) => (
                <button
                  key={op.id}
                  className={`${styles.operationBtn} ${
                    selectedOperation === op.id ? styles.selected : ''
                  }`}
                  onClick={() => setSelectedOperation(op.id)}
                  disabled={disabled}
                >
                  <span className={styles.icon}>{op.icon}</span>
                  <span>{op.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.inputSection}>
        {renderInputFields()}
      </div>
      
      <button
        className={styles.executeBtn}
        onClick={handleExecute}
        disabled={disabled}
      >
        执行操作
      </button>
    </div>
  );
};

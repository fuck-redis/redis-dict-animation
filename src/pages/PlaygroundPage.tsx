/**
 * 交互实践页面 - 带完整动画控制
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useDict } from '../hooks/useDict';
import { useAnimationControl } from '../hooks/useAnimationControl';
import { HashTableView } from '../components/visualization/HashTableView';
import { OperationPanel } from '../components/controls/OperationPanel';
import { AnimationControls } from '../components/controls/AnimationControls';
import { StatsPanel } from '../components/statistics/StatsPanel';
import { isRehashing } from '../core/dict';
import styles from './PlaygroundPage.module.css';

export const PlaygroundPage: React.FC = () => {
  const { dict: liveDict, executeOperation: executeLiveOperation, reset, rehashConfig, updateRehashConfig } = useDict(8, 'siphash');
  const animationControl = useAnimationControl(liveDict);
  
  // 当前显示的dict状态（可能是历史状态）
  const [displayDict, setDisplayDict] = useState(liveDict);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  
  // 当播放位置改变时，更新显示的状态
  useEffect(() => {
    const currentState = animationControl.history[animationControl.currentStep]?.state;
    if (currentState) {
      setDisplayDict(currentState);
    }
  }, [animationControl.currentStep, animationControl.history]);
  
  // 监听键盘快捷键
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // 在输入框中不响应快捷键
      }
      
      switch (e.key) {
        case ' ': // 空格键：播放/暂停
          e.preventDefault();
          if (animationControl.isPlaying) {
            animationControl.pause();
          } else {
            animationControl.play();
          }
          break;
        case 'ArrowLeft': // 左箭头：上一步
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight': // 右箭头：下一步
          e.preventDefault();
          handleNext();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [animationControl]);
  
  const handleOperation = (operation: string, params: any) => {
    // 如果不在最新状态，先跳到最新
    if (animationControl.currentStep < animationControl.totalSteps - 1) {
      animationControl.goToStep(animationControl.totalSteps - 1);
    }
    
    const result = executeLiveOperation(operation as any, params);
    
    // 构建操作描述
    let description = '';
    switch (operation) {
      case 'set':
        description = `插入键值对: ${params.key} = ${params.value}`;
        break;
      case 'get':
        description = `查询键: ${params.key}`;
        break;
      case 'delete':
        description = `删除键: ${params.key}`;
        break;
      case 'startRehash':
        description = `开始Rehash，目标大小: ${params.targetSize || '自动'}`;
        break;
      case 'rehashStep':
        description = `Rehash步骤: 迁移 ${params.rehashSteps || 1} 个桶`;
        break;
      default:
        description = operation;
    }
    
    // 添加到历史记录
    animationControl.addStep(operation, params, liveDict, description);
    
    setMessage(result.message);
    setMessageType(result.success ? 'success' : 'error');
    
    setTimeout(() => setMessage(''), 3000);
  };
  
  const handleReset = () => {
    if (confirm('确定要重置字典吗？这将清空所有历史记录。')) {
      reset();
      animationControl.clearHistory();
      animationControl.addStep('init', {}, liveDict, '重置字典');
      setMessage('字典已重置');
      setMessageType('info');
      setTimeout(() => setMessage(''), 3000);
    }
  };
  
  const handleQuickTest = () => {
    const testKeys = ['user:1', 'user:2', 'session:abc', 'cache:data', 'key:test'];
    const testValues = ['Alice', 'Bob', 'token123', 'value', 'demo'];
    
    testKeys.forEach((key, index) => {
      setTimeout(() => {
        handleOperation('set', { key, value: testValues[index] });
      }, index * 100);
    });
    
    setMessage('正在插入测试数据...');
    setMessageType('info');
  };
  
  const handlePrevious = useCallback(() => {
    const prevState = animationControl.previousStep();
    if (prevState) {
      setDisplayDict(prevState);
    }
  }, [animationControl]);
  
  const handleNext = useCallback(() => {
    const nextState = animationControl.nextStep();
    if (nextState) {
      setDisplayDict(nextState);
    }
  }, [animationControl]);
  
  const handleGoToStep = useCallback((step: number) => {
    const state = animationControl.goToStep(step);
    if (state) {
      setDisplayDict(state);
    }
  }, [animationControl]);
  
  // 显示当前步骤的描述
  const currentStepDescription = animationControl.history[animationControl.currentStep]?.description || '';
  const isHistoryMode = animationControl.currentStep < animationControl.totalSteps - 1;
  
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>交互实践区</h1>
          {isHistoryMode && (
            <div className={styles.historyBadge}>
              🕒 历史模式: {currentStepDescription}
            </div>
          )}
        </div>
        <div className={styles.actions}>
          <button className={styles.btn} onClick={handleQuickTest}>
            快速测试
          </button>
          <button className={styles.btn} onClick={handleReset}>
            重置
          </button>
        </div>
      </div>
      
      {message && (
        <div className={`${styles.message} ${styles[messageType]}`}>
          {message}
        </div>
      )}
      
      {/* 动画控制面板 */}
      <div className={styles.animationControlSection}>
        <AnimationControls
          isPlaying={animationControl.isPlaying}
          currentStep={animationControl.currentStep}
          totalSteps={animationControl.totalSteps}
          canGoBack={animationControl.canGoBack}
          canGoForward={animationControl.canGoForward}
          playSpeed={animationControl.playSpeed}
          onPlay={animationControl.play}
          onPause={animationControl.pause}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onGoToStep={handleGoToStep}
          onClearHistory={animationControl.clearHistory}
          onSetSpeed={animationControl.setPlaySpeed}
        />
      </div>
      
      <div className={styles.mainContent}>
        <div className={styles.visualizationArea}>
          <div className={styles.tablesContainer}>
            <div className={styles.tableWrapper}>
              <HashTableView
                hashTable={displayDict.ht[0]}
                tableIndex={0}
                title={`哈希表 0 ${!isRehashing(displayDict) ? '(主表)' : '(正在迁移)'}`}
              />
            </div>
            
            {isRehashing(displayDict) && displayDict.ht[1].size > 0 && (
              <div className={styles.tableWrapper}>
                <HashTableView
                  hashTable={displayDict.ht[1]}
                  tableIndex={1}
                  title="哈希表 1 (目标表)"
                />
                <div className={styles.rehashProgress}>
                  <div className={styles.progressLabel}>
                    Rehash进度: {displayDict.rehashidx} / {displayDict.ht[0].size}
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${(displayDict.rehashidx / displayDict.ht[0].size) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className={styles.statsContainer}>
            <StatsPanel stats={displayDict.stats} />
          </div>
        </div>
        
        <div className={styles.controlArea}>
          <OperationPanel onExecute={handleOperation} />
          
          <div className={styles.configSection}>
            <h3 className={styles.configTitle}>Rehash配置</h3>
            <div className={styles.configItem}>
              <label>
                <input
                  type="checkbox"
                  checked={rehashConfig.autoRehash}
                  onChange={(e) =>
                    updateRehashConfig({ autoRehash: e.target.checked })
                  }
                />
                <span>自动Rehash</span>
              </label>
            </div>
            <div className={styles.configItem}>
              <label>
                负载因子阈值:
                <input
                  type="number"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={rehashConfig.loadFactorThreshold}
                  onChange={(e) =>
                    updateRehashConfig({
                      loadFactorThreshold: parseFloat(e.target.value),
                    })
                  }
                />
              </label>
            </div>
            <div className={styles.configItem}>
              <label>
                Rehash批量大小:
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={rehashConfig.rehashBatchSize}
                  onChange={(e) =>
                    updateRehashConfig({
                      rehashBatchSize: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </label>
            </div>
          </div>
          
          {/* 操作历史列表 */}
          {animationControl.totalSteps > 1 && (
            <div className={styles.historySection}>
              <h3 className={styles.historyTitle}>操作历史</h3>
              <div className={styles.historyList}>
                {animationControl.history.map((step, index) => (
                  <div
                    key={step.id}
                    className={`${styles.historyItem} ${
                      index === animationControl.currentStep ? styles.currentHistoryItem : ''
                    }`}
                    onClick={() => handleGoToStep(index)}
                  >
                    <span className={styles.historyIndex}>{index}</span>
                    <span className={styles.historyDescription}>{step.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

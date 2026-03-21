/**
 * 交互实践页面 - 教学化单屏演示
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDict } from '../hooks/useDict';
import { useAnimationControl } from '../hooks/useAnimationControl';
import { useGithubStars } from '../hooks/useGithubStars';
import { useIndexedPreference } from '../hooks/useIndexedPreference';
import { HashTableView } from '../components/visualization/HashTableView';
import { OperationPanel } from '../components/controls/OperationPanel';
import { AnimationControls } from '../components/controls/AnimationControls';
import { StatsPanel } from '../components/statistics/StatsPanel';
import { TeachingTopBar } from '../components/teaching/TeachingTopBar';
import { DictInputBar, DictEntryInput } from '../components/teaching/DictInputBar';
import { CodeDebuggerPanel } from '../components/code/CodeDebuggerPanel';
import { isRehashing } from '../core/dict';
import { GITHUB_REPO_URL } from '../config/repository';
import {
  CodeLanguage,
  DICT_CODE_SNIPPETS,
  buildDictCodeOverlay,
} from '../data/dictCodeSnippets';
import { DictOperation, OperationParams, OperationResult } from '../types/dict';
import styles from './PlaygroundPage.module.css';

type MessageType = 'success' | 'error' | 'info';

const INITIAL_RESULT: OperationResult = {
  success: true,
  message: '初始状态',
};

function buildOperationDescription(
  operation: string,
  params: OperationParams
): string {
  switch (operation) {
    case 'set':
      return '插入键值对: ' + params.key + ' = ' + params.value;
    case 'get':
      return '查询键: ' + params.key;
    case 'exists':
      return '检查键存在: ' + params.key;
    case 'delete':
      return '删除键: ' + params.key;
    case 'startRehash':
      return '开始Rehash，目标大小: ' + (params.targetSize || '自动');
    case 'rehashStep':
      return 'Rehash步骤: 迁移 ' + (params.rehashSteps || 1) + ' 个桶';
    default:
      return operation;
  }
}

export const PlaygroundPage: React.FC = () => {
  const {
    dict: liveDict,
    executeOperationWithSnapshot,
    resetWithSnapshot,
    rehashConfig,
    updateRehashConfig,
  } = useDict(8, 'siphash');

  const animationControl = useAnimationControl(liveDict);
  const { stars, loading: starsLoading } = useGithubStars();
  const [codeLanguage, setCodeLanguage] = useIndexedPreference<CodeLanguage>(
    'preference:code-language',
    'java'
  );
  const [savedPlaySpeed, setSavedPlaySpeed, speedLoaded] = useIndexedPreference<number>(
    'preference:play-speed',
    1000
  );

  const [displayDict, setDisplayDict] = useState(liveDict);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('info');
  const [showIdea, setShowIdea] = useState(false);

  const [codeOverlay, setCodeOverlay] = useState(() =>
    buildDictCodeOverlay({
      operation: 'init',
      params: {},
      snapshot: liveDict,
      result: INITIAL_RESULT,
    })
  );

  const messageTimerRef = useRef<number | null>(null);

  const showMessage = useCallback((text: string, type: MessageType) => {
    setMessage(text);
    setMessageType(type);

    if (messageTimerRef.current) {
      window.clearTimeout(messageTimerRef.current);
    }

    messageTimerRef.current = window.setTimeout(() => {
      setMessage('');
      messageTimerRef.current = null;
    }, 3000);
  }, []);

  useEffect(() => {
    if (!speedLoaded) return;
    animationControl.setPlaySpeed(savedPlaySpeed);
  }, [speedLoaded, savedPlaySpeed, animationControl]);

  // 当播放位置改变时，更新显示状态和代码高亮
  useEffect(() => {
    const step = animationControl.history[animationControl.currentStep];
    if (!step) return;

    setDisplayDict(step.state);
    setCodeOverlay(
      buildDictCodeOverlay({
        operation: step.operation,
        params: step.params,
        snapshot: step.state,
        result: { success: true, message: step.description },
      })
    );
  }, [animationControl.currentStep, animationControl.history]);

  const handlePrevious = useCallback(() => {
    animationControl.previousStep();
  }, [animationControl]);

  const handleNext = useCallback(() => {
    animationControl.nextStep();
  }, [animationControl]);

  const handleGoToStep = useCallback(
    (step: number) => {
      animationControl.goToStep(step);
    },
    [animationControl]
  );

  const handleReset = useCallback(() => {
    if (!window.confirm('确定要重置字典吗？这将清空历史步骤。')) return;

    const snapshot = resetWithSnapshot();
    animationControl.resetHistory(snapshot, '重置字典');
    setDisplayDict(snapshot);
    setCodeOverlay(
      buildDictCodeOverlay({
        operation: 'init',
        params: {},
        snapshot,
        result: { success: true, message: '字典已重置' },
      })
    );
    showMessage('字典已重置', 'info');
  }, [animationControl, resetWithSnapshot, showMessage]);

  // 快捷键
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key) {
        case ' ':
          event.preventDefault();
          if (animationControl.isPlaying) {
            animationControl.pause();
          } else {
            animationControl.play();
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleNext();
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          handleReset();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [animationControl, handleNext, handlePrevious, handleReset]);

  useEffect(() => {
    return () => {
      if (messageTimerRef.current) {
        window.clearTimeout(messageTimerRef.current);
      }
    };
  }, []);

  const handleOperation = useCallback(
    (operation: string, params: OperationParams) => {
      if (animationControl.currentStep < animationControl.totalSteps - 1) {
        animationControl.goToStep(animationControl.totalSteps - 1);
      }

      const op = operation as DictOperation;
      const { result, snapshot } = executeOperationWithSnapshot(op, params);
      const description = buildOperationDescription(op, params);

      animationControl.addStep(op, params, snapshot, description);
      setDisplayDict(snapshot);
      setCodeOverlay(
        buildDictCodeOverlay({
          operation: op,
          params,
          snapshot,
          result,
        })
      );

      showMessage(result.message, result.success ? 'success' : 'error');
    },
    [animationControl, executeOperationWithSnapshot, showMessage]
  );

  const applyDataset = useCallback(
    (entries: DictEntryInput[]) => {
      if (entries.length === 0) {
        showMessage('输入数据为空', 'error');
        return;
      }

      let snapshot = resetWithSnapshot();
      animationControl.resetHistory(snapshot, '加载数据集');
      let lastResult: OperationResult = {
        success: true,
        message: '数据集加载完成',
      };

      for (const entry of entries) {
        const execution = executeOperationWithSnapshot('set', entry);
        snapshot = execution.snapshot;
        lastResult = execution.result;
        animationControl.addStep(
          'set',
          entry,
          snapshot,
          buildOperationDescription('set', entry)
        );
      }

      setDisplayDict(snapshot);
      setCodeOverlay(
        buildDictCodeOverlay({
          operation: 'set',
          params: entries[entries.length - 1],
          snapshot,
          result: lastResult,
        })
      );

      showMessage('已应用 ' + entries.length + ' 组数据', 'info');
    },
    [animationControl, executeOperationWithSnapshot, resetWithSnapshot, showMessage]
  );

  const handleQuickTest = useCallback(() => {
    applyDataset([
      { key: 'user:1', value: 'Alice' },
      { key: 'user:2', value: 'Bob' },
      { key: 'session:abc', value: 'token123' },
      { key: 'cache:data', value: 'value' },
      { key: 'key:test', value: 'demo' },
    ]);
  }, [applyDataset]);

  const handleSetPlaySpeed = useCallback(
    (speed: number) => {
      animationControl.setPlaySpeed(speed);
      setSavedPlaySpeed(speed);
    },
    [animationControl, setSavedPlaySpeed]
  );

  const currentStepDescription =
    animationControl.history[animationControl.currentStep]?.description || '';
  const isHistoryMode =
    animationControl.currentStep < animationControl.totalSteps - 1;

  const ideaPoints = useMemo(
    () => [
      'Dict 使用链地址法解决冲突，重点观察同一桶冲突链如何增长。',
      'Rehash 采用双表渐进迁移，避免一次性迁移造成阻塞。',
      'SET 在 Rehash 期间写入新表，GET/DEL 需要兼顾双表查询。',
      '教学重点是“负载因子变化 -> 冲突增多 -> 触发 Rehash -> 迁移完成”。',
    ],
    []
  );

  return (
    <div className={styles.page}>
      <TeachingTopBar
        backLabel="返回 Redis Dict 概念页"
        backUrl="/"
        title="Redis Dict 交互式分步演示"
        repoUrl={GITHUB_REPO_URL}
        stars={stars}
        starsLoading={starsLoading}
        onOpenIdea={() => setShowIdea(true)}
      />

      <div className={styles.inputSection}>
        <DictInputBar onApply={applyDataset} />
      </div>

      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>交互实践区</h2>
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
          onReset={handleReset}
          onSetSpeed={handleSetPlaySpeed}
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
                  onChange={(event) =>
                    updateRehashConfig({ autoRehash: event.target.checked })
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
                  onChange={(event) =>
                    updateRehashConfig({
                      loadFactorThreshold: parseFloat(event.target.value),
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
                  onChange={(event) =>
                    updateRehashConfig({
                      rehashBatchSize: parseInt(event.target.value, 10) || 1,
                    })
                  }
                />
              </label>
            </div>
          </div>

          <CodeDebuggerPanel
            title="代码联动调试面板"
            language={codeLanguage}
            snippets={DICT_CODE_SNIPPETS}
            activeLines={codeOverlay.activeLines[codeLanguage]}
            lineValues={codeOverlay.lineValues[codeLanguage]}
            onLanguageChange={setCodeLanguage}
          />

          {animationControl.totalSteps > 1 && (
            <div className={styles.historySection}>
              <h3 className={styles.historyTitle}>操作历史</h3>
              <div className={styles.historyList}>
                {animationControl.history.map((step, index) => (
                  <div
                    key={step.id}
                    className={`${styles.historyItem} ${index === animationControl.currentStep ? styles.currentHistoryItem : ''}`}
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

      {showIdea && (
        <div className={styles.ideaMask} onClick={() => setShowIdea(false)}>
          <div
            className={styles.ideaDialog}
            onClick={(event) => event.stopPropagation()}
          >
            <h3>Redis Dict 演示思路</h3>
            <ul>
              {ideaPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <button
              className={styles.ideaCloseBtn}
              onClick={() => setShowIdea(false)}
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

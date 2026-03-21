/**
 * 动画控制面板组件
 */

import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  RotateCcw,
  Clock,
} from 'lucide-react';
import styles from './AnimationControls.module.css';

interface AnimationControlsProps {
  // 状态
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  canGoBack: boolean;
  canGoForward: boolean;
  playSpeed: number;
  
  // 控制方法
  onPlay: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onGoToStep: (step: number) => void;
  onReset: () => void;
  onSetSpeed: (speed: number) => void;
}

const SPEED_OPTIONS = [
  { value: 2000, label: '0.5x', icon: '🐌' },
  { value: 1000, label: '1x', icon: '🚶' },
  { value: 500, label: '2x', icon: '🏃' },
  { value: 250, label: '4x', icon: '🚀' },
];

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  isPlaying,
  currentStep,
  totalSteps,
  canGoBack,
  canGoForward,
  playSpeed,
  onPlay,
  onPause,
  onPrevious,
  onNext,
  onGoToStep,
  onReset,
  onSetSpeed,
}) => {
  const progress = totalSteps > 0 ? (currentStep / (totalSteps - 1)) * 100 : 0;
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Clock size={20} />
          <h3>动画控制器</h3>
        </div>
        <button
          className={styles.resetBtn}
          onClick={onReset}
          title="重置字典 (R)"
        >
          <RotateCcw size={16} />
          重置 (R)
        </button>
      </div>
      
      {/* 进度条 */}
      <div className={styles.progressSection}>
        <div className={styles.progressInfo}>
          <span className={styles.stepCount}>
            步骤: <strong>{currentStep + 1}</strong> / {totalSteps}
          </span>
          <span className={styles.percentage}>
            {progress.toFixed(0)}%
          </span>
        </div>
        
        <div className={styles.progressBarContainer}>
          <input
            type="range"
            min="0"
            max={Math.max(0, totalSteps - 1)}
            value={currentStep}
            onChange={(e) => onGoToStep(parseInt(e.target.value, 10))}
            className={styles.progressBar}
            disabled={totalSteps <= 1}
          />
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* 播放控制按钮 */}
      <div className={styles.controls}>
        <div className={styles.mainControls}>
          <button
            className={`${styles.controlBtn} ${styles.secondaryBtn}`}
            onClick={onPrevious}
            disabled={!canGoBack}
            title="上一步 (←)"
          >
            <SkipBack size={20} />
            <span className={styles.keyHint}>←</span>
          </button>
          
          {isPlaying ? (
            <button
              className={`${styles.controlBtn} ${styles.primaryBtn}`}
              onClick={onPause}
              title="暂停 (Space)"
            >
              <Pause size={24} />
              <span className={styles.keyHint}>Space</span>
            </button>
          ) : (
            <button
              className={`${styles.controlBtn} ${styles.primaryBtn}`}
              onClick={onPlay}
              disabled={!canGoForward && currentStep === totalSteps - 1}
              title="播放 (Space)"
            >
              <Play size={24} />
              <span className={styles.keyHint}>Space</span>
            </button>
          )}
          
          <button
            className={`${styles.controlBtn} ${styles.secondaryBtn}`}
            onClick={onNext}
            disabled={!canGoForward}
            title="下一步 (→)"
          >
            <SkipForward size={20} />
            <span className={styles.keyHint}>→</span>
          </button>
        </div>
        
        {/* 速度控制 */}
        <div className={styles.speedControls}>
          <span className={styles.speedLabel}>
            <FastForward size={16} />
            速度:
          </span>
          <div className={styles.speedButtons}>
            {SPEED_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`${styles.speedBtn} ${
                  playSpeed === option.value ? styles.active : ''
                }`}
                onClick={() => onSetSpeed(option.value)}
                title={`${option.label} - ${option.value}ms间隔`}
              >
                <span className={styles.speedIcon}>{option.icon}</span>
                <span className={styles.speedText}>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* 状态提示 */}
      {totalSteps <= 1 && (
        <div className={styles.emptyHint}>
          <Rewind size={16} />
          执行操作后，可以使用时间旅行功能回放过程
        </div>
      )}
    </div>
  );
};

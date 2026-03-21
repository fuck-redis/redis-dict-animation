/**
 * 动画控制Hook - 提供时间旅行和播放控制功能
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { DictState, OperationParams } from '@/types/dict';
import { cloneDictState } from '@/core/dict';

interface AnimationStep {
  id: number;
  timestamp: number;
  operation: string;
  params: OperationParams;
  state: DictState;
  description: string;
}

interface AnimationControlReturn {
  // 历史记录
  history: AnimationStep[];
  currentStep: number;
  
  // 控制方法
  addStep: (
    operation: string,
    params: OperationParams,
    state: DictState,
    description: string
  ) => void;
  goToStep: (step: number) => DictState | null;
  previousStep: () => DictState | null;
  nextStep: () => DictState | null;
  clearHistory: () => void;
  resetHistory: (state: DictState, description?: string) => void;
  
  // 播放控制
  isPlaying: boolean;
  playSpeed: number;
  play: () => void;
  pause: () => void;
  setPlaySpeed: (speed: number) => void;
  
  // 状态查询
  canGoBack: boolean;
  canGoForward: boolean;
  totalSteps: number;
}

export function useAnimationControl(initialState: DictState): AnimationControlReturn {
  const [history, setHistory] = useState<AnimationStep[]>([
    {
      id: 0,
      timestamp: Date.now(),
      operation: 'init',
      params: {},
      state: cloneDictState(initialState),
      description: '初始状态',
    },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1000); // 毫秒
  
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentStepRef = useRef(0);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);
  
  // 添加新步骤
  const addStep = useCallback(
    (
      operation: string,
      params: OperationParams,
      state: DictState,
      description: string
    ) => {
      const baseStep = currentStepRef.current;
      const nextStep = baseStep + 1;

      setHistory((prev) => {
        const cutoff = Math.min(baseStep, prev.length - 1);
        const newHistory = prev.slice(0, cutoff + 1);

        const newRecord: AnimationStep = {
          id: newHistory.length,
          timestamp: Date.now(),
          operation,
          params,
          state: cloneDictState(state),
          description,
        };

        return [...newHistory, newRecord];
      });

      currentStepRef.current = nextStep;
      setCurrentStep(nextStep);
    },
    []
  );
  
  // 跳转到指定步骤
  const goToStep = useCallback(
    (step: number): DictState | null => {
      if (step < 0 || step >= history.length) return null;
      
      currentStepRef.current = step;
      setCurrentStep(step);
      return history[step].state;
    },
    [history]
  );
  
  // 上一步
  const previousStep = useCallback((): DictState | null => {
    if (currentStep <= 0) return null;
    
    const newStep = currentStep - 1;
    currentStepRef.current = newStep;
    setCurrentStep(newStep);
    return history[newStep].state;
  }, [currentStep, history]);
  
  // 下一步
  const nextStep = useCallback((): DictState | null => {
    if (currentStep >= history.length - 1) return null;
    
    const newStep = currentStep + 1;
    currentStepRef.current = newStep;
    setCurrentStep(newStep);
    return history[newStep].state;
  }, [currentStep, history]);
  
  // 清空历史
  const clearHistory = useCallback(() => {
    const baseStep = history[0];
    setHistory([
      {
        ...baseStep,
        state: cloneDictState(baseStep.state),
        timestamp: Date.now(),
      },
    ]);
    currentStepRef.current = 0;
    setCurrentStep(0);
    setIsPlaying(false);
  }, [history]);

  const resetHistory = useCallback(
    (state: DictState, description: string = '重置字典') => {
      setHistory([
        {
          id: 0,
          timestamp: Date.now(),
          operation: 'init',
          params: {},
          state: cloneDictState(state),
          description,
        },
      ]);
      currentStepRef.current = 0;
      setCurrentStep(0);
      setIsPlaying(false);
    },
    []
  );
  
  // 播放
  const play = useCallback(() => {
    if (currentStep >= history.length - 1) {
      // 如果已经在最后，从头播放
      currentStepRef.current = 0;
      setCurrentStep(0);
    }
    setIsPlaying(true);
  }, [currentStep, history.length]);
  
  // 暂停
  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  // 自动播放逻辑
  useEffect(() => {
    if (!isPlaying) {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
      return;
    }
    
    playIntervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= history.length) {
          setIsPlaying(false);
          return prev;
        }
        currentStepRef.current = next;
        return next;
      });
    }, playSpeed);
    
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, playSpeed, history.length]);
  
  const canGoBack = currentStep > 0;
  const canGoForward = currentStep < history.length - 1;
  const totalSteps = history.length;
  
  return {
    history,
    currentStep,
    addStep,
    goToStep,
    previousStep,
    nextStep,
    clearHistory,
    resetHistory,
    isPlaying,
    playSpeed,
    play,
    pause,
    setPlaySpeed,
    canGoBack,
    canGoForward,
    totalSteps,
  };
}

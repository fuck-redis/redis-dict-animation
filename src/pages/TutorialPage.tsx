/**
 * 互动教程页面
 */

import React, { useState } from 'react';
import { GraduationCap, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { useDict } from '@/hooks/useDict';
import { HashTableView } from '@/components/visualization/HashTableView';
import styles from './TutorialPage.module.css';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
}

interface TutorialStep {
  id: number;
  title: string;
  instruction: string;
  task: string;
  solution: () => void;
  check: () => boolean;
}

export const TutorialPage: React.FC = () => {
  const { dict, executeOperation, reset } = useDict(4, 'siphash');
  const [currentTutorial, setCurrentTutorial] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  const tutorials: Tutorial[] = [
    {
      id: 'basic',
      title: '基础操作入门',
      description: '学习Redis Dict的基本操作',
      steps: [
        {
          id: 1,
          title: '插入第一个键值对',
          instruction: '使用SET命令插入键值对 key1:value1',
          task: '在操作面板中插入 key1=value1',
          solution: () => executeOperation('set', { key: 'key1', value: 'value1' }),
          check: () => dict.ht[0].used >= 1,
        },
        {
          id: 2,
          title: '插入更多数据',
          instruction: '继续插入3个键值对，观察哈希表的填充',
          task: '插入 key2, key3, key4',
          solution: () => {
            executeOperation('set', { key: 'key2', value: 'value2' });
            executeOperation('set', { key: 'key3', value: 'value3' });
            executeOperation('set', { key: 'key4', value: 'value4' });
          },
          check: () => dict.ht[0].used >= 4,
        },
        {
          id: 3,
          title: '观察负载因子',
          instruction: '当前负载因子 = 已使用/大小 = ' + dict.ht[0].used + '/' + dict.ht[0].size,
          task: '理解负载因子的含义',
          solution: () => {},
          check: () => true,
        },
      ],
    },
    {
      id: 'rehash',
      title: 'Rehash机制实战',
      description: '体验渐进式Rehash的工作过程',
      steps: [
        {
          id: 1,
          title: '准备数据',
          instruction: '插入足够多的数据以触发rehash',
          task: '插入6个键值对',
          solution: () => {
            reset(4);
            for (let i = 1; i <= 6; i++) {
              executeOperation('set', { key: `k${i}`, value: `v${i}` });
            }
          },
          check: () => dict.ht[0].used >= 5,
        },
        {
          id: 2,
          title: '触发Rehash',
          instruction: '手动触发Rehash过程',
          task: '执行 startRehash 操作',
          solution: () => executeOperation('startRehash', { targetSize: 16 }),
          check: () => dict.rehashidx !== -1,
        },
        {
          id: 3,
          title: '观察迁移过程',
          instruction: '单步执行Rehash，观察数据迁移',
          task: '执行3次 rehashStep',
          solution: () => {
            executeOperation('rehashStep', { rehashSteps: 1 });
            setTimeout(() => executeOperation('rehashStep', { rehashSteps: 1 }), 500);
            setTimeout(() => executeOperation('rehashStep', { rehashSteps: 1 }), 1000);
          },
          check: () => dict.rehashidx >= 2,
        },
      ],
    },
  ];
  
  const currentTutorialData = tutorials[currentTutorial];
  const currentStepData = currentTutorialData.steps[currentStep];
  
  const handleExecuteSolution = () => {
    currentStepData.solution();
    setTimeout(() => {
      if (currentStepData.check()) {
        setCompletedSteps(new Set([...completedSteps, currentStepData.id]));
      }
    }, 500);
  };
  
  const handleNextStep = () => {
    if (currentStep < currentTutorialData.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (currentTutorial < tutorials.length - 1) {
      setCurrentTutorial(currentTutorial + 1);
      setCurrentStep(0);
      reset();
    }
  };
  
  const isStepCompleted = completedSteps.has(currentStepData.id);
  
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <GraduationCap className={styles.heroIcon} size={48} />
        <h1 className={styles.title}>互动教程</h1>
        <p className={styles.subtitle}>
          通过实践任务，逐步掌握Redis Dict的使用
        </p>
      </div>

      <div className={styles.content}>
        {/* 教程选择 */}
        <section className={styles.tutorialSelector}>
          {tutorials.map((tutorial, index) => (
            <button
              key={tutorial.id}
              className={`${styles.tutorialBtn} ${currentTutorial === index ? styles.active : ''}`}
              onClick={() => {
                setCurrentTutorial(index);
                setCurrentStep(0);
                reset();
              }}
            >
              <h3>{tutorial.title}</h3>
              <p>{tutorial.description}</p>
            </button>
          ))}
        </section>

        {/* 步骤进度 */}
        <section className={styles.progressSection}>
          <div className={styles.progressSteps}>
            {currentTutorialData.steps.map((step, index) => (
              <div
                key={step.id}
                className={`${styles.progressStep} ${
                  index === currentStep ? styles.current : ''
                } ${completedSteps.has(step.id) ? styles.completed : ''}`}
              >
                {completedSteps.has(step.id) ? (
                  <CheckCircle2 size={24} />
                ) : (
                  <Circle size={24} />
                )}
                <span>{step.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 当前步骤 */}
        <section className={styles.currentStep}>
          <div className={styles.stepHeader}>
            <h2>步骤 {currentStep + 1}: {currentStepData.title}</h2>
            {isStepCompleted && (
              <span className={styles.completedBadge}>
                <CheckCircle2 size={20} />
                已完成
              </span>
            )}
          </div>
          
          <div className={styles.stepContent}>
            <div className={styles.instruction}>
              <h3>📖 说明</h3>
              <p>{currentStepData.instruction}</p>
            </div>
            
            <div className={styles.task}>
              <h3>🎯 任务</h3>
              <p>{currentStepData.task}</p>
            </div>
            
            <div className={styles.actions}>
              <button onClick={handleExecuteSolution} className={styles.btnPrimary}>
                查看并执行解决方案
              </button>
              {isStepCompleted && (
                <button onClick={handleNextStep} className={styles.btnSuccess}>
                  下一步 <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 可视化区域 */}
        <section className={styles.visualizationSection}>
          <h3>实时状态</h3>
          <div className={styles.visualization}>
            <HashTableView
              hashTable={dict.ht[0]}
              tableIndex={0}
              title="哈希表状态"
            />
          </div>
          
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span>已使用:</span>
              <strong>{dict.ht[0].used}</strong>
            </div>
            <div className={styles.statItem}>
              <span>大小:</span>
              <strong>{dict.ht[0].size}</strong>
            </div>
            <div className={styles.statItem}>
              <span>负载因子:</span>
              <strong>{(dict.ht[0].loadFactor * 100).toFixed(1)}%</strong>
            </div>
            <div className={styles.statItem}>
              <span>总操作:</span>
              <strong>{dict.stats.totalOperations}</strong>
            </div>
          </div>
        </section>

        {/* 学习提示 */}
        <section className={styles.tipsSection}>
          <h3>💡 学习提示</h3>
          <div className={styles.tips}>
            <div className={styles.tip}>
              <strong>实践为王:</strong> 不要只看不做，亲手操作才能真正理解Dict的工作原理
            </div>
            <div className={styles.tip}>
              <strong>观察细节:</strong> 注意观察每次操作后负载因子、冲突链等指标的变化
            </div>
            <div className={styles.tip}>
              <strong>对比实验:</strong> 尝试不同的操作顺序，对比不同哈希函数的表现
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

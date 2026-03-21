/**
 * 互动教程页面
 */

import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap, CheckCircle2, Circle, ArrowRight, BookOpen, Play, Pause, RotateCcw, ChevronRight, Hash, Database, Layers, RefreshCw } from 'lucide-react';
import { useDict } from '@/hooks/useDict';
import { HashTableView } from '@/components/visualization/HashTableView';
import { InlineVideo } from '@/components/video';
import { TutorialOverview, StepByStepLearning } from '@/remotion/compositions/tutorial';
import * as d3 from 'd3';
import styles from './TutorialPage.module.css';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
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

// D3.js Hash Function Visualizer Component
const D3HashVisualizer: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [inputKey, setInputKey] = useState('name');
  const [animatedHash, setAnimatedHash] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 400;
    const centerX = width / 2;

    // Background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#1a1a2e')
      .attr('rx', 12);

    // Title
    svg.append('text')
      .attr('x', centerX)
      .attr('y', 35)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '20px')
      .attr('font-weight', 'bold')
      .text('D3.js 哈希函数可视化演示');

    // Input box
    svg.append('rect')
      .attr('x', 50)
      .attr('y', 70)
      .attr('width', 200)
      .attr('height', 50)
      .attr('fill', '#2a2a4a')
      .attr('rx', 8)
      .attr('stroke', '#2196f3')
      .attr('stroke-width', 2);

    svg.append('text')
      .attr('x', 150)
      .attr('y', 100)
      .attr('text-anchor', 'middle')
      .attr('fill', '#a0a0a0')
      .attr('font-size', '14px')
      .text('输入键');

    svg.append('text')
      .attr('x', 150)
      .attr('y', 100)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text(inputKey);

    // Arrow 1
    svg.append('path')
      .attr('d', 'M 270 95 L 330 95')
      .attr('stroke', '#4caf50')
      .attr('stroke-width', 3)
      .attr('marker-end', 'url(#arrowhead)');

    // Hash function box
    svg.append('rect')
      .attr('x', 350)
      .attr('y', 60)
      .attr('width', 120)
      .attr('height', 70)
      .attr('fill', '#4caf50')
      .attr('rx', 8);

    svg.append('text')
      .attr('x', 410)
      .attr('y', 100)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('哈希函数');

    // Arrow 2
    svg.append('path')
      .attr('d', 'M 490 95 L 550 95')
      .attr('stroke', '#ff9800')
      .attr('stroke-width', 3);

    // Hash value box
    svg.append('rect')
      .attr('x', 570)
      .attr('y', 60)
      .attr('width', 180)
      .attr('height', 70)
      .attr('fill', '#ff9800')
      .attr('rx', 8);

    const hashText = animatedHash || '0x7b3c...';
    svg.append('text')
      .attr('x', 660)
      .attr('y', 100)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '14px')
      .attr('font-family', 'monospace')
      .text(hashText.substring(0, 12) + '...');

    // Bucket visualization
    const bucketY = 200;
    const bucketWidth = 70;
    const bucketGap = 15;
    const startX = (width - (8 * bucketWidth + 7 * bucketGap)) / 2;

    for (let i = 0; i < 8; i++) {
      const x = startX + i * (bucketWidth + bucketGap);

      // Bucket
      svg.append('rect')
        .attr('x', x)
        .attr('y', bucketY)
        .attr('width', bucketWidth)
        .attr('height', 50)
        .attr('fill', i === 3 ? '#2196f3' : '#333')
        .attr('stroke', i === 3 ? '#64b5f6' : '#555')
        .attr('stroke-width', 2)
        .attr('rx', 6);

      svg.append('text')
        .attr('x', x + bucketWidth / 2)
        .attr('y', bucketY + 30)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ffffff')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .text(i);

      // Chain line
      if (i === 3) {
        svg.append('line')
          .attr('x1', x + bucketWidth / 2)
          .attr('y1', bucketY + 50)
          .attr('x2', x + bucketWidth / 2)
          .attr('y2', bucketY + 80)
          .attr('stroke', '#2196f3')
          .attr('stroke-width', 2);

        svg.append('circle')
          .attr('cx', x + bucketWidth / 2)
          .attr('cy', bucketY + 95)
          .attr('r', 15)
          .attr('fill', '#2196f3');

        svg.append('text')
          .attr('x', x + bucketWidth / 2)
          .attr('y', bucketY + 100)
          .attr('text-anchor', 'middle')
          .attr('fill', '#ffffff')
          .attr('font-size', '12px')
          .text('Alice');
      }
    }

    // Legend
    svg.append('text')
      .attr('x', 50)
      .attr('y', 350)
      .attr('fill', '#a0a0a0')
      .attr('font-size', '14px')
      .text('负载因子: 0.5 | 最大链长: 1 | 桶数量: 8');

    // Arrow marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('markerWidth', 10)
      .attr('markerHeight', 7)
      .attr('refX', 9)
      .attr('refY', 3.5)
      .attr('orient', 'auto')
      .append('polygon')
      .attr('points', '0 0, 10 3.5, 0 7')
      .attr('fill', '#4caf50');

  }, [inputKey, animatedHash]);

  const simulateHash = () => {
    const hash = Math.floor(Math.random() * 0xffffffff).toString(16);
    setAnimatedHash('0x' + hash.padStart(8, '0'));
  };

  return (
    <div className={styles.d3Visualizer}>
      <div className={styles.d3Controls}>
        <input
          type="text"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          placeholder="输入键名"
          className={styles.d3Input}
        />
        <button onClick={simulateHash} className={styles.d3Button}>
          <Play size={16} /> 计算哈希
        </button>
      </div>
      <svg ref={svgRef} width="100%" height="400" viewBox="0 0 800 400" />
    </div>
  );
};

// D3.js Collision Animation Component
const D3CollisionAnimation: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 700;
    const height = 300;

    // Background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#1a1a2e')
      .attr('rx', 12);

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text('哈希冲突产生过程');

    // Bucket 2 (collision bucket)
    const bucketX = 300;
    const bucketY = 80;

    svg.append('rect')
      .attr('x', bucketX)
      .attr('y', bucketY)
      .attr('width', 100)
      .attr('height', 40)
      .attr('fill', '#f44336')
      .attr('rx', 6)
      .attr('stroke', '#ff6659')
      .attr('stroke-width', 2);

    svg.append('text')
      .attr('x', bucketX + 50)
      .attr('y', bucketY + 25)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('Bucket 2');

    // Chain entries
    const entries = [
      { name: 'name', value: 'Alice', y: 140, color: '#2196f3' },
      { name: 'user', value: 'Bob', y: 200, color: '#ff9800' },
    ];

    entries.forEach((entry, i) => {
      // Entry box
      svg.append('rect')
        .attr('x', bucketX + 20)
        .attr('y', entry.y)
        .attr('width', 140)
        .attr('height', 45)
        .attr('fill', entry.color)
        .attr('rx', 6)
        .attr('opacity', 0.9);

      svg.append('text')
        .attr('x', bucketX + 90)
        .attr('y', entry.y + 20)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ffffff')
        .attr('font-size', '13px')
        .text(`"${entry.name}": "${entry.value}"`);

      // Arrow to next
      if (i < entries.length - 1) {
        svg.append('path')
          .attr('d', `M ${bucketX + 90} ${entry.y + 45} L ${bucketX + 90} ${entries[i + 1].y}`)
          .attr('stroke', '#666')
          .attr('stroke-width', 2)
          .attr('marker-end', 'url(#arrow2)');
      }
    });

    // NULL at end
    svg.append('text')
      .attr('x', bucketX + 90)
      .attr('y', 265)
      .attr('text-anchor', 'middle')
      .attr('fill', '#666')
      .attr('font-size', '14px')
      .attr('font-family', 'monospace')
      .text('NULL');

    // Explanation
    svg.append('text')
      .attr('x', 50)
      .attr('y', 100)
      .attr('fill', '#4caf50')
      .attr('font-size', '14px')
      .text('h("name") = 4 % 8 = 4 → Bucket 4');

    svg.append('text')
      .attr('x', 50)
      .attr('y', 180)
      .attr('fill', '#ff9800')
      .attr('font-size', '14px')
      .text('h("user") = 4 % 8 = 4 → Bucket 4');

    svg.append('text')
      .attr('x', 50)
      .attr('y', 260)
      .attr('fill', '#f44336')
      .attr('font-size', '14px')
      .text('冲突! 两个键落在同一桶');

    // Arrow marker
    svg.append('defs').append('marker')
      .attr('id', 'arrow2')
      .attr('markerWidth', 8)
      .attr('markerHeight', 6)
      .attr('refX', 8)
      .attr('refY', 3)
      .attr('orient', 'auto')
      .append('polygon')
      .attr('points', '0 0, 8 3, 0 6')
      .attr('fill', '#666');

  }, []);

  return (
    <div className={styles.d3Visualizer}>
      <svg ref={svgRef} width="100%" height="300" viewBox="0 0 700 300" />
    </div>
  );
};

// D3.js Rehash Animation Component
const D3RehashAnimation: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 700;
    const height = 350;

    // Background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#1a1a2e')
      .attr('rx', 12);

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text('渐进式 Rehash 过程');

    // ht[0] table
    svg.append('text')
      .attr('x', 120)
      .attr('y', 70)
      .attr('text-anchor', 'middle')
      .attr('fill', '#2196f3')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('ht[0] (4 buckets)');

    for (let i = 0; i < 4; i++) {
      const x = 50 + i * 70;
      const y = 90;
      const filled = (phase >= 1 && i < 2) || (phase < 1);

      svg.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', 60)
        .attr('height', 40)
        .attr('fill', filled ? '#333' : '#1a1a2e')
        .attr('stroke', '#555')
        .attr('rx', 4);

      svg.append('text')
        .attr('x', x + 30)
        .attr('y', y + 25)
        .attr('text-anchor', 'middle')
        .attr('fill', filled ? '#2196f3' : '#444')
        .attr('font-size', '14px')
        .text(filled ? `entry${i + 1}` : '空');

      // Migration arrow
      if (phase >= 1 && i < 2) {
        svg.append('path')
          .attr('d', `M ${x + 30} ${y + 40} Q ${x + 80} ${y + 80} ${x + 130} ${y + 10}`)
          .attr('stroke', '#4caf50')
          .attr('stroke-width', 2)
          .attr('fill', 'none')
          .attr('stroke-dasharray', '4,4');
      }
    }

    // ht[1] table
    svg.append('text')
      .attr('x', 420)
      .attr('y', 70)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ff9800')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('ht[1] (8 buckets)');

    for (let i = 0; i < 8; i++) {
      const x = 300 + i * 50;
      const y = 90;
      const filled = phase >= 1 && i < 4;

      svg.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', 40)
        .attr('height', 40)
        .attr('fill', filled ? '#ff9800' : '#1a1a2e')
        .attr('stroke', '#555')
        .attr('rx', 4);

      svg.append('text')
        .attr('x', x + 20)
        .attr('y', y + 25)
        .attr('text-anchor', 'middle')
        .attr('fill', filled ? '#fff' : '#444')
        .attr('font-size', '12px')
        .text(filled ? `e${i + 1}` : '空');
    }

    // Progress bar
    const progress = phase >= 1 ? 50 : 0;
    svg.append('rect')
      .attr('x', 100)
      .attr('y', 180)
      .attr('width', 500)
      .attr('height', 20)
      .attr('fill', '#333')
      .attr('rx', 10);

    svg.append('rect')
      .attr('x', 100)
      .attr('y', 180)
      .attr('width', 500 * (progress / 100))
      .attr('height', 20)
      .attr('fill', '#4caf50')
      .attr('rx', 10);

    svg.append('text')
      .attr('x', 350)
      .attr('y', 220)
      .attr('text-anchor', 'middle')
      .attr('fill', '#a0a0a0')
      .attr('font-size', '14px')
      .text(`Rehash 进度: ${progress}%`);

    // Status
    const statusText = phase === 0 ? '等待中...' : phase === 1 ? '迁移中: 2/4 buckets' : '完成!';
    const statusColor = phase === 0 ? '#ffc107' : phase === 1 ? '#4caf50' : '#2196f3';

    svg.append('text')
      .attr('x', 350)
      .attr('y', 280)
      .attr('text-anchor', 'middle')
      .attr('fill', statusColor)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text(statusText);

    // Instructions
    svg.append('text')
      .attr('x', 350)
      .attr('y', 320)
      .attr('text-anchor', 'middle')
      .attr('fill', '#666')
      .attr('font-size', '12px')
      .text('点击"下一步"观察数据如何从 ht[0] 迁移到 ht[1]');

  }, [phase]);

  return (
    <div className={styles.d3Visualizer}>
      <div className={styles.d3Controls}>
        <button onClick={() => setPhase(0)} className={`${styles.d3Button} ${phase === 0 ? styles.active : ''}`}>
          初始状态
        </button>
        <button onClick={() => setPhase(1)} className={`${styles.d3Button} ${phase === 1 ? styles.active : ''}`}>
          <RefreshCw size={14} /> 迁移中
        </button>
        <button onClick={() => setPhase(2)} className={`${styles.d3Button} ${phase === 2 ? styles.active : ''}`}>
          完成
        </button>
      </div>
      <svg ref={svgRef} width="100%" height="350" viewBox="0 0 700 350" />
    </div>
  );
};

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
      icon: <BookOpen size={24} />,
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
      id: 'collision',
      title: '哈希冲突处理',
      description: '理解链地址法如何处理哈希冲突',
      icon: <Hash size={24} />,
      steps: [
        {
          id: 1,
          title: '观察冲突产生',
          instruction: '当不同键哈希到同一桶时产生冲突',
          task: '插入会产生冲突的键',
          solution: () => {
            reset(4);
            executeOperation('set', { key: 'name', value: 'Alice' });
            executeOperation('set', { key: 'user', value: 'Bob' });
          },
          check: () => dict.ht[0].used >= 2,
        },
        {
          id: 2,
          title: '查看冲突链',
          instruction: '观察桶中的冲突链表结构',
          task: '理解链表的形成',
          solution: () => {},
          check: () => true,
        },
      ],
    },
    {
      id: 'rehash',
      title: 'Rehash机制实战',
      description: '体验渐进式Rehash的工作过程',
      icon: <RefreshCw size={24} />,
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
      {/* Hero Section with Remotion Animation */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <GraduationCap className={styles.heroIcon} size={56} />
          <h1 className={styles.title}>互动教程</h1>
          <p className={styles.subtitle}>
            通过实践任务和动画演示，逐步掌握Redis Dict的核心概念
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <strong>38+</strong>
              <span>动画演示</span>
            </div>
            <div className={styles.heroStat}>
              <strong>5</strong>
              <span>核心模块</span>
            </div>
            <div className={styles.heroStat}>
              <strong>Interactive</strong>
              <span>动手实践</span>
            </div>
          </div>
        </div>
      </div>

      {/* D3.js Animated Sections */}
      <section className={styles.d3Section}>
        <h2 className={styles.sectionTitle}>
          <Hash size={28} />
          哈希函数工作原理
        </h2>
        <p className={styles.sectionDesc}>
          了解Redis如何将键名转换为哈希值，并映射到具体的桶索引
        </p>
        <D3HashVisualizer />
      </section>

      <section className={styles.d3Section}>
        <h2 className={styles.sectionTitle}>
          <Layers size={28} />
          哈希冲突与链地址法
        </h2>
        <p className={styles.sectionDesc}>
          当多个键哈希到同一桶时，Redis使用链表连接所有冲突的键值对
        </p>
        <D3CollisionAnimation />
      </section>

      <section className={styles.d3Section}>
        <h2 className={styles.sectionTitle}>
          <RefreshCw size={28} />
          渐进式Rehash
        </h2>
        <p className={styles.sectionDesc}>
          Redis通过双哈希表和渐进式迁移，避免一次性rehash导致的长时间阻塞
        </p>
        <D3RehashAnimation />
      </section>

      <div className={styles.content}>
        {/* 教程选择 */}
        <section className={styles.tutorialSelector}>
          <h2 className={styles.sectionTitle}>选择学习路径</h2>
          <div className={styles.tutorialGrid}>
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
                <div className={styles.tutorialIcon}>{tutorial.icon}</div>
                <div className={styles.tutorialInfo}>
                  <h3>{tutorial.title}</h3>
                  <p>{tutorial.description}</p>
                </div>
                <ChevronRight size={20} className={styles.tutorialArrow} />
              </button>
            ))}
          </div>
        </section>

        {/* 步骤进度 */}
        <section className={styles.progressSection}>
          <h3 className={styles.progressTitle}>
            <BookOpen size={20} />
            {currentTutorialData.title} - 步骤列表
          </h3>
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
                <div className={styles.stepInfo}>
                  <span className={styles.stepNumber}>步骤 {step.id}</span>
                  <span className={styles.stepName}>{step.title}</span>
                </div>
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
                <Play size={16} /> 查看并执行解决方案
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
          <h3>
            <Database size={20} />
            实时状态
          </h3>
          <div className={styles.visualization}>
            <HashTableView
              hashTable={dict.ht[0]}
              tableIndex={0}
              title="哈希表 ht[0]"
            />
            {dict.rehashidx !== -1 && (
              <HashTableView
                hashTable={dict.ht[1]}
                tableIndex={1}
                title="哈希表 ht[1] (Rehash中)"
              />
            )}
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
              <span>Rehash状态:</span>
              <strong className={dict.rehashidx !== -1 ? styles.rehashing : ''}>
                {dict.rehashidx === -1 ? '否' : `进行中 (${dict.rehashidx})`}
              </strong>
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

        {/* Remotion动画推荐 */}
        <section className={styles.videoSection}>
          <h3>📺 相关视频演示</h3>
          <div className={styles.videoGrid}>
            <InlineVideo
              component={TutorialOverview}
              durationInFrames={450}
              width={640}
              height={360}
              title="教程概览"
              fullWidth={true}
            />
            <InlineVideo
              component={StepByStepLearning}
              durationInFrames={360}
              width={640}
              height={360}
              title="分步学习过程"
              fullWidth={true}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default TutorialPage;

/**
 * Remotion Root Component
 * 定义所有视频 Compositions
 */

import React from 'react';
import { Composition, AbsoluteFill } from 'remotion';

// Concept Page Compositions
import { WhatIsDict, SeparateChaining, DictStructure } from './compositions/concept';

// Hash Functions Page Compositions
import { HashFunctionOverview, CollisionDemo, HashFloodingAttack } from './compositions/hash-functions';

// Rehash Page Compositions
import { WhyRehash, RehashProcess, DualTableMechanism } from './compositions/rehash';

// Performance Page Compositions
import { LoadFactorImpact, OptimizationTips } from './compositions/performance';

// Iterator Page Compositions
import { SafeVsUnsafe, IteratorMechanism } from './compositions/iterator';

export const Root: React.FC = () => {
  return (
    <>
      {/* Concept Page Videos */}
      <Composition
        id="concept/what-is-dict"
        component={WhatIsDict}
        durationInFrames={1350}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="concept/separate-chaining"
        component={SeparateChaining}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="concept/dict-structure"
        component={DictStructure}
        durationInFrames={1500}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Hash Functions Page Videos */}
      <Composition
        id="hash-functions/overview"
        component={HashFunctionOverview}
        durationInFrames={1200}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="hash-functions/collision-demo"
        component={CollisionDemo}
        durationInFrames={1650}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="hash-functions/flooding-attack"
        component={HashFloodingAttack}
        durationInFrames={1500}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Rehash Page Videos */}
      <Composition
        id="rehash/why-rehash"
        component={WhyRehash}
        durationInFrames={1350}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="rehash/process"
        component={RehashProcess}
        durationInFrames={2100}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="rehash/dual-table"
        component={DualTableMechanism}
        durationInFrames={1650}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Performance Page Videos */}
      <Composition
        id="performance/load-factor"
        component={LoadFactorImpact}
        durationInFrames={1500}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="performance/optimization"
        component={OptimizationTips}
        durationInFrames={1650}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Iterator Page Videos */}
      <Composition
        id="iterator/safe-vs-unsafe"
        component={SafeVsUnsafe}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="iterator/mechanism"
        component={IteratorMechanism}
        durationInFrames={1650}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

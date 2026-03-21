/**
 * Remotion 哈希表场景组件
 * 在 Remotion 视频中渲染哈希表
 */

import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import type { DictState, DictHashTable, DictEntry } from '@/remotion/types';
import { colors, layout, getBucketStyle } from '@/remotion/styles/hashtableStyles';

interface HashTableSceneProps {
  dictState: DictState;
  tableIndex?: 0 | 1;
  title?: string;
  highlightBucket?: number;
  highlightEntry?: string;
  showStats?: boolean;
}

function countChain(entry: DictEntry | null): number {
  let count = 0;
  let current = entry;
  while (current) {
    count++;
    current = current.next;
  }
  return count;
}

function ChainEntries({ entry }: { entry: DictEntry | null }): React.ReactElement {
  if (!entry) {
    return (
      <span style={{ color: colors.textMuted, fontStyle: 'italic', fontSize: 13 }}>
        null
      </span>
    );
  }

  const elements: React.ReactElement[] = [];
  let current: DictEntry | null = entry;
  let index = 0;

  while (current) {
    elements.push(
      <React.Fragment key={`${current.key}-${index}`}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 12px',
            background: colors.entryBg,
            border: `2px solid ${colors.entryBorder}`,
            borderRadius: 6,
            fontFamily: "'Courier New', monospace",
            fontSize: 13,
          }}
        >
          <span style={{ color: colors.keyColor, fontWeight: 600 }}>{current.key}</span>
          <span style={{ color: colors.textMuted, margin: '0 6px' }}>:</span>
          <span style={{ color: colors.valueColor }}>{current.value}</span>
        </span>
      </React.Fragment>
    );

    if (current.next) {
      elements.push(
        <span key={`arrow-${index}`} style={{ color: colors.arrowColor, fontWeight: 'bold', margin: '0 4px' }}>
          →
        </span>
      );
    }

    current = current.next;
    index++;
  }

  return <>{elements}</>;
}

function BucketRow({
  index,
  entry,
  isHighlighted,
}: {
  index: number;
  entry: DictEntry | null;
  isHighlighted: boolean;
}): React.ReactElement {
  const chainLength = countChain(entry);
  const bucketStyle = getBucketStyle(chainLength);

  return (
    <div
      style={{
        ...layout.bucket,
        ...bucketStyle,
        backgroundColor: isHighlighted ? '#fff9c4' : bucketStyle.backgroundColor,
        border: isHighlighted ? `2px solid ${colors.entryHighlightedBorder}` : undefined,
      }}
    >
      <div style={layout.bucketIndex}>{index}</div>
      <div style={layout.bucketContent}>
        <div style={layout.chain}>
          <ChainEntries entry={entry} />
        </div>
      </div>
      {chainLength > 1 && (
        <div style={layout.chainLengthBadge}>{chainLength}</div>
      )}
    </div>
  );
}

function HashTableView({
  hashTable,
  tableIndex,
  title,
  highlightBucket,
  showStats = true,
}: {
  hashTable: DictHashTable;
  tableIndex: 0 | 1;
  title: string;
  highlightBucket?: number;
  showStats?: boolean;
}): React.ReactElement {
  const loadFactorColor =
    hashTable.loadFactor < 0.5
      ? colors.loadFactorLow
      : hashTable.loadFactor < 0.75
      ? colors.loadFactorMedium
      : colors.loadFactorHigh;

  return (
    <div style={layout.container}>
      <div style={layout.header}>
        <h3 style={layout.title}>{title}</h3>
        {showStats && (
          <div style={layout.stats}>
            <span>Size: {hashTable.size}</span>
            <span>Used: {hashTable.used}</span>
            <span style={{ color: loadFactorColor, fontWeight: 600 }}>
              LF: {(hashTable.loadFactor * 100).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      <div style={layout.table}>
        {hashTable.table.map((entry, index) => (
          <BucketRow
            key={index}
            index={index}
            entry={entry}
            isHighlighted={highlightBucket === index}
          />
        ))}
      </div>
    </div>
  );
}

export const HashTableScene: React.FC<HashTableSceneProps> = ({
  dictState,
  tableIndex = 0,
  title,
  highlightBucket,
  showStats = true,
}) => {
  const ht = dictState.ht[tableIndex];
  const tableTitle = title || `哈希表 ${tableIndex}`;

  return (
    <AbsoluteFill style={{ background: '#f5f5f5' }}>
      <div style={{ padding: 24, height: '100%', boxSizing: 'border-box' }}>
        <HashTableView
          hashTable={ht}
          tableIndex={tableIndex}
          title={tableTitle}
          highlightBucket={highlightBucket}
          showStats={showStats}
        />
      </div>
    </AbsoluteFill>
  );
};

export default HashTableScene;

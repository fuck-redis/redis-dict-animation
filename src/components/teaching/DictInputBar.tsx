/**
 * Dict 数据输入条
 */

import React, { useMemo, useState } from 'react';
import styles from './DictInputBar.module.css';

export interface DictEntryInput {
  key: string;
  value: string;
}

interface DictInputBarProps {
  onApply: (entries: DictEntryInput[]) => void;
  disabled?: boolean;
}

const PRESETS: Array<{ label: string; value: string }> = [
  { label: '入门样例', value: 'user:1=Alice,user:2=Bob,user:3=Carol' },
  { label: 'Rehash样例', value: 'k1=v1,k2=v2,k3=v3,k4=v4,k5=v5,k6=v6,k7=v7,k8=v8' },
  { label: '会话缓存', value: 'session:a=tokenA,session:b=tokenB,cache:home=ok,cache:detail=ok' },
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomEntries(): DictEntryInput[] {
  const total = randomInt(5, 9);
  const entries: DictEntryInput[] = [];
  for (let i = 0; i < total; i++) {
    const key = 'demo:' + randomInt(100, 999);
    const value = 'val' + randomInt(10, 99);
    entries.push({ key, value });
  }
  return entries;
}

function serializeEntries(entries: DictEntryInput[]): string {
  return entries.map((entry) => entry.key + '=' + entry.value).join(',');
}

export function parseInput(text: string): { entries: DictEntryInput[]; error: string | null } {
  const rawParts = text
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (rawParts.length === 0) {
    return { entries: [], error: '请输入至少一组 key=value 数据' };
  }

  const entries: DictEntryInput[] = [];
  const keySet = new Set<string>();

  for (const part of rawParts) {
    const separatorIndex = part.indexOf('=');
    if (separatorIndex <= 0 || separatorIndex >= part.length - 1) {
      return { entries: [], error: '格式错误：请使用 key=value，并以逗号分隔' };
    }

    const key = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();

    if (!key || !value) {
      return { entries: [], error: 'key 和 value 不能为空' };
    }

    if (keySet.has(key)) {
      return { entries: [], error: '发现重复 key：' + key };
    }

    keySet.add(key);
    entries.push({ key, value });
  }

  return { entries, error: null };
}

export const DictInputBar: React.FC<DictInputBarProps> = ({
  onApply,
  disabled = false,
}) => {
  const [text, setText] = useState(PRESETS[0].value);
  const [error, setError] = useState<string | null>(null);

  const previewCount = useMemo(() => parseInput(text).entries.length, [text]);

  const handleApply = () => {
    const parsed = parseInput(text);
    if (parsed.error) {
      setError(parsed.error);
      return;
    }

    setError(null);
    onApply(parsed.entries);
  };

  const handleRandom = () => {
    const entries = generateRandomEntries();
    const payload = serializeEntries(entries);
    setText(payload);
    setError(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <span className={styles.label}>输入数据</span>

        <input
          className={styles.input}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="例如: user:1=Alice,user:2=Bob"
          disabled={disabled}
        />

        <button className={styles.actionBtn} onClick={handleRandom} disabled={disabled}>
          随机生成
        </button>

        <button className={styles.primaryBtn} onClick={handleApply} disabled={disabled}>
          校验并应用
        </button>

        <span className={styles.countTag}>共 {previewCount} 组</span>
      </div>

      <div className={styles.presetRow}>
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            className={styles.presetBtn}
            onClick={() => {
              setText(preset.value);
              setError(null);
            }}
            disabled={disabled}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

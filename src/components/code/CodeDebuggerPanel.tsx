/**
 * 多语言代码调试面板
 */

import React from 'react';
import { CodeLanguage } from '@/data/dictCodeSnippets';
import styles from './CodeDebuggerPanel.module.css';

interface CodeDebuggerPanelProps {
  title: string;
  language: CodeLanguage;
  snippets: Record<CodeLanguage, string>;
  activeLines: number[];
  lineValues: Record<number, string>;
  onLanguageChange: (language: CodeLanguage) => void;
}

const LANGUAGE_OPTIONS: Array<{ id: CodeLanguage; label: string }> = [
  { id: 'java', label: 'Java' },
  { id: 'python', label: 'Python' },
  { id: 'golang', label: 'Go' },
  { id: 'javascript', label: 'JavaScript' },
];

const KEYWORDS = new Set([
  'if',
  'else',
  'return',
  'const',
  'let',
  'var',
  'function',
  'public',
  'boolean',
  'int',
  'String',
  'def',
  'in',
  'None',
  'True',
  'False',
  'func',
  'package',
  'struct',
  'nil',
  'new',
  'class',
]);

function renderHighlightedLine(line: string): React.ReactNode[] {
  const parts = line.split(/(\s+|[(){}\[\].,;:+\-*/<>=!&|])/g).filter(Boolean);

  return parts.map((part, index) => {
    if (/^\s+$/.test(part)) {
      return <span key={index}>{part}</span>;
    }

    if (/^["'].*["']$/.test(part)) {
      return (
        <span key={index} className={styles.tokenString}>
          {part}
        </span>
      );
    }

    if (/^\d+$/.test(part)) {
      return (
        <span key={index} className={styles.tokenNumber}>
          {part}
        </span>
      );
    }

    if (KEYWORDS.has(part)) {
      return (
        <span key={index} className={styles.tokenKeyword}>
          {part}
        </span>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

export const CodeDebuggerPanel: React.FC<CodeDebuggerPanelProps> = ({
  title,
  language,
  snippets,
  activeLines,
  lineValues,
  onLanguageChange,
}) => {
  const lineSet = new Set(activeLines);
  const lines = snippets[language].split('\n');

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.langTabs}>
          {LANGUAGE_OPTIONS.map((option) => (
            <button
              key={option.id}
              className={option.id === language ? styles.langTabActive : styles.langTab}
              onClick={() => onLanguageChange(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.codeViewport}>
        {lines.map((line, index) => {
          const lineNo = index + 1;
          const isActive = lineSet.has(lineNo);
          const lineValue = lineValues[lineNo];

          return (
            <div
              key={lineNo}
              className={isActive ? styles.codeLineActive : styles.codeLine}
            >
              <span className={styles.lineNo}>{lineNo.toString().padStart(2, '0')}</span>
              <span className={styles.lineCode}>{renderHighlightedLine(line)}</span>
              {lineValue ? <span className={styles.lineValue}>// {lineValue}</span> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
};

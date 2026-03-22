/**
 * 代码块组件 - 支持语法高亮
 */

import React, { useEffect } from 'react';
import Prism from 'prismjs';
// Import Prism languages
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import styles from './CodeBlock.module.css';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'c',
  showLineNumbers = false,
  className = '',
}) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  const lines = code.split('\n');

  return (
    <div className={`${styles.codeBlock} ${className}`}>
      <pre className={`language-${language}`}>
        <code className={`language-${language}`}>
          {showLineNumbers ? (
            <table className={styles.lineNumbers}>
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i}>
                    <td className={styles.lineNumber}>{i + 1}</td>
                    <td className={styles.lineContent}>{line || ' '}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            code
          )}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;

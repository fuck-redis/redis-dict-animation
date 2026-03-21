/**
 * Remotion 样式对象 - 从 HashTableView.module.css 转换
 * 供 Remotion 组件内联使用
 */

export const colors = {
  // 背景色
  background: '#ffffff',
  containerBg: '#ffffff',

  // 文字颜色
  textPrimary: '#333333',
  textSecondary: '#666666',
  textMuted: '#999999',

  // 主题色
  primary: '#2196f3',
  primaryLight: '#64b5f6',
  success: '#4caf50',
  warning: '#ff9800',
  danger: '#f44336',

  // 负载因子状态
  loadFactorLow: '#4caf50',
  loadFactorMedium: '#ff9800',
  loadFactorHigh: '#f44336',

  // 边框颜色
  border: '#e0e0e0',
  borderLight: '#f0f0f0',

  // 桶背景色
  bucketEmpty: '#fafafa',
  bucketSingle: '#e8f5e9',
  bucketConflict2: '#fff3e0',
  bucketConflict3: '#ffe0b2',
  bucketConflictHigh: '#ffccbc',

  // Entry 颜色
  entryBg: '#ffffff',
  entryBorder: '#2196f3',
  entryNewBorder: '#4caf50',
  entryNewBg: '#e8f5e9',
  entryRehashingBorder: '#ff9800',
  entryRehashingBg: '#fff3e0',
  entryHighlightedBg: '#fff9c4',
  entryHighlightedBorder: '#ffc107',

  // 键值颜色
  keyColor: '#1976d2',
  valueColor: '#388e3c',
  arrowColor: '#666666',

  // 索引标签
  indexBg: '#f0f0f0',
};

export const bucketStyles = {
  empty: {
    backgroundColor: colors.bucketEmpty,
  },
  single: {
    backgroundColor: colors.bucketSingle,
  },
  conflict2: {
    backgroundColor: colors.bucketConflict2,
  },
  conflict3: {
    backgroundColor: colors.bucketConflict3,
  },
  conflictHigh: {
    backgroundColor: colors.bucketConflictHigh,
  },
};

export const entryStyles = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 12px',
    background: colors.entryBg,
    border: `2px solid ${colors.entryBorder}`,
    borderRadius: 6,
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
  },
  new: {
    borderColor: colors.entryNewBorder,
    background: colors.entryNewBg,
  },
  rehashing: {
    borderColor: colors.entryRehashingBorder,
    background: colors.entryRehashingBg,
  },
  highlighted: {
    borderColor: colors.entryHighlightedBorder,
    background: colors.entryHighlightedBg,
  },
};

export const layout = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    background: colors.containerBg,
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: 16,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between' as const,
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: `2px solid ${colors.border}`,
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
    color: colors.textPrimary,
  },
  stats: {
    display: 'flex',
    gap: 16,
    fontSize: 14,
    color: colors.textSecondary,
  },
  statItem: {
    padding: '4px 8px',
    background: '#f5f5f5',
    borderRadius: 4,
  },
  table: {
    flex: 1,
    overflowY: 'auto' as const,
    border: `1px solid ${colors.border}`,
    borderRadius: 4,
  },
  bucket: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 48,
    padding: 8,
    borderBottom: `1px solid ${colors.border}`,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    position: 'relative' as const,
  },
  bucketIndex: {
    width: 48,
    textAlign: 'center' as const,
    fontWeight: 600,
    color: colors.textSecondary,
    fontFamily: "'Courier New', monospace",
    flexShrink: 0,
    padding: '4px 8px',
    background: colors.indexBg,
    borderRadius: 4,
    marginRight: 12,
  },
  bucketContent: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    overflowX: 'auto' as const,
  },
  chain: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  chainArrow: {
    color: colors.arrowColor,
    fontWeight: 'bold',
    margin: '0 4px',
  },
  nullEntry: {
    color: colors.textMuted,
    fontStyle: 'italic' as const,
    fontSize: 13,
  },
  chainLengthBadge: {
    position: 'absolute' as const,
    top: 4,
    right: 4,
    background: '#ff5722',
    color: 'white',
    width: 20,
    height: 20,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 'bold',
  },
};

export const animations = {
  slideIn: `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,
  pulse: `
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }
  `,
  highlight: `
    @keyframes highlight {
      0%, 100% {
        background: #fff9c4;
      }
      50% {
        background: #ffeb3b;
      }
    }
  `,
};

export function getBucketStyle(chainLength: number): Record<string, string> {
  if (chainLength === 0) return bucketStyles.empty;
  if (chainLength === 1) return bucketStyles.single;
  if (chainLength === 2) return bucketStyles.conflict2;
  if (chainLength === 3) return bucketStyles.conflict3;
  return bucketStyles.conflictHigh;
}

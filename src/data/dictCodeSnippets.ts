/**
 * Dict 教学代码与步骤映射
 */

import { DictState, OperationParams, OperationResult } from '@/types/dict';

export type CodeLanguage = 'java' | 'python' | 'golang' | 'javascript';

export interface CodeOverlay {
  activeLines: Record<CodeLanguage, number[]>;
  lineValues: Record<CodeLanguage, Record<number, string>>;
}

const LANGUAGES: CodeLanguage[] = ['java', 'python', 'golang', 'javascript'];

function buildSnippet(lines: string[]): string {
  return lines.join('\n');
}

export const DICT_CODE_SNIPPETS: Record<CodeLanguage, string> = {
  java: buildSnippet([
    'public boolean dictOp(Dict dict, String op, Params p) {',
    '  if ("set".equals(op)) {',
    '    int hash = hashFn(p.key);',
    '    DictHt table = dict.rehashidx != -1 ? dict.ht1 : dict.ht0;',
    '    int index = hash & table.sizemask;',
    '    Entry exists = findEntry(table, p.key);',
    '    if (exists != null) { exists.value = p.value; return true; }',
    '    insertHead(table, p.key, p.value, hash);',
    '    return true;',
    '  }',
    '  if ("get".equals(op) || "exists".equals(op)) {',
    '    int hash = hashFn(p.key);',
    '    Entry found = findInTwoTables(dict, p.key, hash);',
    '    return found != null;',
    '  }',
    '  if ("delete".equals(op)) {',
    '    int hash = hashFn(p.key);',
    '    boolean deleted = deleteFromTwoTables(dict, p.key, hash);',
    '    return deleted;',
    '  }',
    '',
    '  if ("startRehash".equals(op)) {',
    '    int targetSize = nextPower(p.targetSize > 0 ? p.targetSize : dict.ht0.used * 2);',
    '    dict.ht1 = createHashTable(targetSize);',
    '    dict.rehashidx = 0;',
    '    return true;',
    '  }',
    '',
    '  if ("rehashStep".equals(op)) {',
    '    int steps = p.rehashSteps > 0 ? p.rehashSteps : 1;',
    '    moveBuckets(dict, steps);',
    '    if (dict.rehashidx >= dict.ht0.size) finishRehash(dict);',
    '    return true;',
    '  }',
    '  return false;',
    '}',
  ]),
  python: buildSnippet([
    'def dict_op(d, op, p):',
    '    if op == "set":',
    '        hash_value = hash_fn(p["key"])',
    '        table = d["ht1"] if d["rehashidx"] != -1 else d["ht0"]',
    '        index = hash_value & table["sizemask"]',
    '        exists = find_entry(table, p["key"])',
    '        if exists is not None: exists["value"] = p["value"]; return True',
    '        insert_head(table, p["key"], p["value"], hash_value)',
    '        return True',
    '    if op in ("get", "exists"):',
    '        hash_value = hash_fn(p["key"])',
    '        found = find_in_two_tables(d, p["key"], hash_value)',
    '        return found is not None',
    '    if op == "delete":',
    '        hash_value = hash_fn(p["key"])',
    '        deleted = delete_from_two_tables(d, p["key"], hash_value)',
    '        return deleted',
    '',
    '    if op == "startRehash":',
    '        target_size = next_power(p.get("targetSize", 0) or d["ht0"]["used"] * 2)',
    '        d["ht1"] = create_hash_table(target_size)',
    '        d["rehashidx"] = 0',
    '        return True',
    '',
    '    if op == "rehashStep":',
    '        steps = p.get("rehashSteps", 1) or 1',
    '        move_buckets(d, steps)',
    '        if d["rehashidx"] >= d["ht0"]["size"]: finish_rehash(d)',
    '        return True',
    '    return False',
  ]),
  golang: buildSnippet([
    'func dictOp(d *Dict, op string, p Params) bool {',
    '  if op == "set" {',
    '    hash := hashFn(p.Key)',
    '    table := d.Ht0',
    '    if d.RehashIdx != -1 { table = d.Ht1 }',
    '    index := hash & table.SizeMask',
    '    exists := findEntry(table, p.Key)',
    '    if exists != nil { exists.Value = p.Value; return true }',
    '    insertHead(table, p.Key, p.Value, hash)',
    '    return true',
    '  }',
    '  if op == "get" || op == "exists" {',
    '    hash := hashFn(p.Key)',
    '    found := findInTwoTables(d, p.Key, hash)',
    '    return found != nil',
    '  }',
    '  if op == "delete" {',
    '    hash := hashFn(p.Key)',
    '    deleted := deleteFromTwoTables(d, p.Key, hash)',
    '    return deleted',
    '  }',
    '',
    '  if op == "startRehash" {',
    '    targetSize := nextPower(maxInt(p.TargetSize, d.Ht0.Used*2))',
    '    d.Ht1 = createHashTable(targetSize)',
    '    d.RehashIdx = 0',
    '    return true',
    '  }',
    '',
    '  if op == "rehashStep" {',
    '    steps := maxInt(p.RehashSteps, 1)',
    '    moveBuckets(d, steps)',
    '    if d.RehashIdx >= d.Ht0.Size { finishRehash(d) }',
    '    return true',
    '  }',
    '  return false',
    '}',
  ]),
  javascript: buildSnippet([
    'function dictOp(dict, op, params) {',
    '  if (op === "set") {',
    '    const hash = hashFn(params.key);',
    '    const table = dict.rehashidx !== -1 ? dict.ht[1] : dict.ht[0];',
    '    const index = hash & table.sizemask;',
    '    const exists = findEntry(table, params.key);',
    '    if (exists) { exists.value = params.value; return true; }',
    '    insertHead(table, params.key, params.value, hash);',
    '    return true;',
    '  }',
    '  if (op === "get" || op === "exists") {',
    '    const hash = hashFn(params.key);',
    '    const found = findInTwoTables(dict, params.key, hash);',
    '    return !!found;',
    '  }',
    '  if (op === "delete") {',
    '    const hash = hashFn(params.key);',
    '    const deleted = deleteFromTwoTables(dict, params.key, hash);',
    '    return deleted;',
    '  }',
    '',
    '  if (op === "startRehash") {',
    '    const targetSize = nextPower(params.targetSize || dict.ht[0].used * 2);',
    '    dict.ht[1] = createHashTable(targetSize);',
    '    dict.rehashidx = 0;',
    '    return true;',
    '  }',
    '',
    '  if (op === "rehashStep") {',
    '    const steps = params.rehashSteps || 1;',
    '    moveBuckets(dict, steps);',
    '    if (dict.rehashidx >= dict.ht[0].size) finishRehash(dict);',
    '    return true;',
    '  }',
    '  return false;',
    '}',
  ]),
};

function buildLineMap(lines: number[]): Record<CodeLanguage, number[]> {
  const mapped: Record<CodeLanguage, number[]> = {
    java: [],
    python: [],
    golang: [],
    javascript: [],
  };
  for (const language of LANGUAGES) {
    mapped[language] = lines;
  }
  return mapped;
}

function buildValueMap(
  values: Record<number, string>
): Record<CodeLanguage, Record<number, string>> {
  const mapped: Record<CodeLanguage, Record<number, string>> = {
    java: {},
    python: {},
    golang: {},
    javascript: {},
  };
  for (const language of LANGUAGES) {
    mapped[language] = values;
  }
  return mapped;
}

function getHashAndIndex(
  snapshot: DictState,
  operation: string,
  key?: string
): { hash: number; index: number; table: 0 | 1 } | null {
  if (!key) return null;

  const hash = snapshot.type.hashFunction(key);
  const table: 0 | 1 =
    operation === 'set' && snapshot.rehashidx !== -1 ? 1 : 0;
  const target = snapshot.ht[table];
  if (target.size === 0) return null;

  const index = hash & target.sizemask;
  return { hash, index, table };
}

export function buildDictCodeOverlay(args: {
  operation: string;
  params: OperationParams;
  snapshot: DictState;
  result: OperationResult;
}): CodeOverlay {
  const { operation, params, snapshot, result } = args;
  const hashMeta = getHashAndIndex(snapshot, operation, params.key);

  switch (operation) {
    case 'set': {
      const values: Record<number, string> = {
        3: 'key=' + (params.key ?? '-') + ', value=' + (params.value ?? '-'),
      };
      if (hashMeta) {
        values[5] =
          'hash=' +
          hashMeta.hash +
          ', index=' +
          hashMeta.index +
          ', table=ht[' +
          hashMeta.table +
          ']';
      }
      values[8] = result.message;
      return {
        activeLines: buildLineMap([2, 3, 4, 5, 7, 8]),
        lineValues: buildValueMap(values),
      };
    }
    case 'get':
    case 'exists': {
      const values: Record<number, string> = {
        12: 'key=' + (params.key ?? '-'),
        14: result.message,
      };
      if (hashMeta) {
        values[13] = 'hash=' + hashMeta.hash + ', index=' + hashMeta.index;
      }
      return {
        activeLines: buildLineMap([11, 12, 13, 14]),
        lineValues: buildValueMap(values),
      };
    }
    case 'delete': {
      const values: Record<number, string> = {
        17: 'key=' + (params.key ?? '-'),
        19: result.message,
      };
      if (hashMeta) {
        values[18] = 'hash=' + hashMeta.hash + ', index=' + hashMeta.index;
      }
      return {
        activeLines: buildLineMap([16, 17, 18, 19]),
        lineValues: buildValueMap(values),
      };
    }
    case 'startRehash': {
      return {
        activeLines: buildLineMap([22, 23, 24]),
        lineValues: buildValueMap({
          22: 'targetSize=' + (params.targetSize ?? 'auto'),
          24: result.message,
        }),
      };
    }
    case 'rehashStep': {
      return {
        activeLines: buildLineMap([29, 30, 31, 32]),
        lineValues: buildValueMap({
          30: 'rehashSteps=' + (params.rehashSteps ?? 1),
          31: 'rehashidx=' + snapshot.rehashidx,
          32: result.message,
        }),
      };
    }
    default:
      return {
        activeLines: buildLineMap([1]),
        lineValues: buildValueMap({
          1: result.message || '初始状态',
        }),
      };
  }
}

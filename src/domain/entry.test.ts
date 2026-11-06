import { describe, expect, it } from 'vitest';
import {
  BASE_YEAR,
  cnDigits,
  cnNumber,
  countByCategory,
  filterEntries,
  gapFromBase,
  hydrateEntries,
  matchSnippet,
  splitHighlight,
} from './entry';
import type { EntrySeed } from './types';

const SEEDS: EntrySeed[] = [
  {
    juan: '卷之四百六',
    category: '天象',
    title: '地动绕日',
    year: 1543,
    who: '哥白尼',
    work: '《天球运行论》',
    text: '地与五星，皆循轨绕日。',
    note: '「地自转」三字旁加朱圈。',
    press: '临终始刊。',
  },
  {
    juan: '卷之九千七百',
    category: '电光',
    title: '琉璃长明',
    year: 1879,
    who: '爱迪生',
    work: '炭丝电灯',
    text: '以炭丝置于琉璃器中，通以电流。',
    press: '西史以为首创。',
  },
];

describe('hydrateEntries', () => {
  it('派生序号、年差、存佚与递藏', () => {
    const entries = hydrateEntries(SEEDS);
    expect(entries).toHaveLength(2);
    expect(entries[0]).toMatchObject({
      id: 0,
      gap: 1543 - BASE_YEAR,
      state: '佚',
    });
    expect(entries[1].id).toBe(1);
    expect(entries[1].state).toBe('存');
    expect(entries[0].provenance).toContain('第7311册');
    expect(entries[1].provenance).toContain('第7312册');
  });

  it('不修改传入的种子数据', () => {
    hydrateEntries(SEEDS);
    expect(SEEDS[0]).not.toHaveProperty('id');
    expect(SEEDS[0]).not.toHaveProperty('gap');
  });
});

describe('gapFromBase', () => {
  it('以永乐六年为断', () => {
    expect(gapFromBase(1408)).toBe(0);
    expect(gapFromBase(1543)).toBe(135);
    expect(gapFromBase(1953)).toBe(545);
  });
});

describe('filterEntries', () => {
  const entries = hydrateEntries(SEEDS);

  it('按类目筛选', () => {
    expect(filterEntries(entries, { category: '电光', keyword: '' })).toHaveLength(1);
    expect(filterEntries(entries, { category: '天象', keyword: '' })[0].title).toBe('地动绕日');
  });

  it('关键词覆盖篇名、正文与小注', () => {
    expect(filterEntries(entries, { category: 'all', keyword: '电灯' })).toHaveLength(1);
    expect(filterEntries(entries, { category: 'all', keyword: '朱圈' })).toHaveLength(1);
    expect(filterEntries(entries, { category: 'all', keyword: '不在此书' })).toHaveLength(0);
  });

  it('空白关键词不过滤', () => {
    expect(filterEntries(entries, { category: 'all', keyword: '   ' })).toHaveLength(2);
  });
});

describe('countByCategory', () => {
  it('统计九类，未出现者为零', () => {
    const counts = countByCategory(hydrateEntries(SEEDS));
    expect(counts['天象']).toBe(1);
    expect(counts['电光']).toBe(1);
    expect(counts['兵械']).toBe(0);
  });
});

describe('cnNumber', () => {
  it('中文数目', () => {
    expect(cnNumber(1)).toBe('一');
    expect(cnNumber(9)).toBe('九');
    expect(cnNumber(10)).toBe('十');
    expect(cnNumber(13)).toBe('十三');
    expect(cnNumber(20)).toBe('二十');
    expect(cnNumber(37)).toBe('三十七');
    expect(cnNumber(60)).toBe('六十');
    expect(cnNumber(575)).toBe('五百七十五');
  });

  it('按位读年份', () => {
    expect(cnDigits(1983)).toBe('一九八三');
  });
});

describe('matchSnippet', () => {
  const entries = hydrateEntries(SEEDS);

  it('命中小注时截出上下文', () => {
    const snippet = matchSnippet(entries[0], '朱圈');
    expect(snippet).toBe('「地自转」三字旁加朱圈。');
  });

  it('无命中时返回 null', () => {
    expect(matchSnippet(entries[0], '不在此书')).toBeNull();
  });
});

describe('splitHighlight', () => {
  it('切出命中片段，大小写不敏感', () => {
    const tokens = splitHighlight('电灯与电灯', '电灯');
    expect(tokens).toEqual([
      { text: '电灯', matched: true },
      { text: '与', matched: false },
      { text: '电灯', matched: true },
    ]);
  });

  it('英文检索词不因大小写漏配', () => {
    const tokens = splitHighlight('X 射线', 'x');
    expect(tokens[0]).toEqual({ text: 'X', matched: true });
  });

  it('无检索词时原样返回', () => {
    expect(splitHighlight('原文', ' ')).toEqual([{ text: '原文', matched: false }]);
  });
});

import type { Category, Entry, EntrySeed, EntryState } from './types';

export const BASE_YEAR = 1408;
export const BASE_LABEL = '永乐六年';

const REPOSITORIES = [
  '泰西某馆',
  '巴黎东方馆',
  '伦敦博物院',
  '圣彼得堡书院',
  '柏林民俗院',
] as const;

/** 距永乐六年的年数。页面所有「晚若干年」都从这里出。 */
export function gapFromBase(year: number): number {
  return year - BASE_YEAR;
}

function stateOf(index: number): EntryState {
  if (index % 5 === 0) return '佚';
  if (index % 3 === 0) return '残';
  return '存';
}

/** 把编纂数据补全为可渲染条目，派生字段与数据分离。 */
export function hydrateEntries(seeds: EntrySeed[]): Entry[] {
  return seeds.map((seed, index) => ({
    ...seed,
    id: index,
    gap: gapFromBase(seed.year),
    state: stateOf(index),
    provenance: `嘉靖副本第${7311 + index}册；庚子散出，今在${
      REPOSITORIES[index % REPOSITORIES.length]
    }。`,
  }));
}

export interface EntryQuery {
  category: Category | 'all';
  keyword: string;
}

/** 类目 + 关键词过滤。关键词覆盖篇名、卷次、类目、年份、作者、著作与正文。 */
export function filterEntries(entries: Entry[], query: EntryQuery): Entry[] {
  const keyword = query.keyword.trim().toLowerCase();
  return entries.filter((entry) => {
    if (query.category !== 'all' && entry.category !== query.category) return false;
    if (!keyword) return true;
    return [
      entry.juan,
      entry.title,
      entry.category,
      String(entry.year),
      entry.who,
      entry.work,
      entry.text,
      entry.note ?? '',
    ]
      .join(' ')
      .toLowerCase()
      .includes(keyword);
  });
}

/** 各类目条数，用于筛选器上的计数。 */
export function countByCategory(entries: Entry[]): Record<Category, number> {
  const counts = {
    天象: 0,
    器用: 0,
    电光: 0,
    医方: 0,
    算学: 0,
    地舆: 0,
    兵械: 0,
    生化: 0,
    物用: 0,
  } satisfies Record<Category, number>;

  for (const entry of entries) counts[entry.category] += 1;
  return counts;
}

/** 中文数目，用于「二十三事 / 六十条 / 五百七十五年」。 */
export function cnNumber(value: number): string {
  if (!Number.isInteger(value) || value < 0) return String(value);
  if (value === 0) return '〇';

  const digits = '〇一二三四五六七八九';
  const units = ['', '十', '百', '千'];
  const str = String(value);
  const parts: string[] = [];
  let pendingZero = false;

  for (let i = 0; i < str.length; i += 1) {
    const digit = Number(str.charAt(i));
    const unit = units[str.length - i - 1];
    if (digit === 0) {
      pendingZero = true;
      continue;
    }
    if (pendingZero && parts.length > 0) parts.push('〇');
    pendingZero = false;
    parts.push(`${digits.charAt(digit)}${unit}`);
  }

  return parts.join('').replace(/^一十/, '十');
}

/** 按位读年份：1983 → 一九八三，不作「一千九百八十三」。 */
export function cnDigits(value: number | string): string {
  const digits = '〇一二三四五六七八九';
  return String(value)
    .split('')
    .map((char) => (/[0-9]/.test(char) ? digits.charAt(Number(char)) : char))
    .join('');
}

/** 从正文、小注、今按里截一段命中上下文，供总目显示。 */
export function matchSnippet(entry: Entry, keyword: string, radius = 20): string | null {
  const needle = keyword.trim();
  if (!needle) return null;

  for (const field of [entry.text, entry.note ?? '', entry.press]) {
    const index = field.toLowerCase().indexOf(needle.toLowerCase());
    if (index === -1) continue;
    const start = Math.max(0, index - radius);
    const end = Math.min(field.length, index + needle.length + radius);
    return `${start > 0 ? '…' : ''}${field.slice(start, end)}${end < field.length ? '…' : ''}`;
  }
  return null;
}

export interface TextToken {
  text: string;
  matched: boolean;
}

/** 把检索词从正文里切出来，交给组件加底色；不做 innerHTML。 */
export function splitHighlight(text: string, keyword: string): TextToken[] {
  const needle = keyword.trim();
  if (!needle) return [{ text, matched: false }];

  const haystack = text.toLowerCase();
  const target = needle.toLowerCase();
  const tokens: TextToken[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const hit = haystack.indexOf(target, cursor);
    if (hit === -1) {
      tokens.push({ text: text.slice(cursor), matched: false });
      break;
    }
    if (hit > cursor) tokens.push({ text: text.slice(cursor, hit), matched: false });
    tokens.push({ text: text.slice(hit, hit + needle.length), matched: true });
    cursor = hit + needle.length;
  }

  return tokens;
}

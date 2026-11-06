import type { Category } from '@/domain/types';

/** 总目九类。顺序即卷目顺序，新增类目只改这一处。 */
export const CATEGORIES: Category[] = [
  '天象',
  '器用',
  '电光',
  '医方',
  '算学',
  '地舆',
  '兵械',
  '生化',
  '物用',
];

export type CategoryFilter = Category | 'all';

export const CATEGORY_FILTERS: Array<{ value: CategoryFilter; label: string }> = [
  { value: 'all', label: '全部' },
  ...CATEGORIES.map((category) => ({ value: category, label: category })),
];

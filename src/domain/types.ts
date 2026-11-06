export type Category =
  | '天象'
  | '器用'
  | '电光'
  | '医方'
  | '算学'
  | '地舆'
  | '兵械'
  | '生化'
  | '物用';

export type EntryState = '存' | '残' | '佚';

/** 编纂原始数据：只写作者需要维护的事实字段。 */
export interface EntrySeed {
  juan: string;
  category: Category;
  title: string;
  year: number;
  who: string;
  work: string;
  text: string;
  note?: string;
  press: string;
}

/** 视图条目：序号、年差、存佚、递藏均由规则派生。 */
export interface Entry extends EntrySeed {
  id: number;
  gap: number;
  state: EntryState;
  provenance: string;
}

export interface ChronologyItem {
  year: number;
  title: string;
  body: string;
  entryId?: number;
  isAnchor?: boolean;
}

export interface VoyageStop {
  port: string;
  year: number;
  description: string;
}

export type ReaderMode = 'vertical' | 'horizontal';

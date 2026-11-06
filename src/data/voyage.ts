import type { VoyageStop } from '@/domain/types';

/** 流布七站。站点与年份独立维护，渲染层只负责排列。 */
export const VOYAGE_STOPS: VoyageStop[] = [
  { port: '南京', year: 1408, description: '文渊阁正本，凡一万一千九十五册。' },
  { port: '北京', year: 1421, description: '迁都后录副，藏于文楼。' },
  { port: '泉州', year: 1430, description: '市舶司验关，抽抄三叶。' },
  { port: '满剌加', year: 1433, description: '旧港宣慰司，海舶易舟。' },
  { port: '古里', year: 1434, description: '柯枝国，西人始得抄本。' },
  { port: '忽鲁谟斯', year: 1436, description: '换舟西行，过阿丹。' },
  { port: '里斯本', year: 1543, description: '泰西首站，藏于某馆。' },
];

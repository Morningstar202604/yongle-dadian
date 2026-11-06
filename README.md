# 永乐大典 · 数字重刊

以《永乐大典》的编次体例重排的一部**文学性仿古网站**：竖排正文、双行小注、乌丝栏、朱文方印、影印叶与年表流布，全部由代码排布，不依赖任何图片素材。

站点收录六十条「西器东源」条目，按天象、器用、电光、医方、算学、地舆、兵械、生化、物用九类编次，每条可展开为一叶影印页，读原文、小注、今按与递藏。

## 技术栈

| 层 | 选型 |
| --- | --- |
| 视图 | React 19（函数组件、并发渲染） |
| 语言 | TypeScript 5.9，`strict`，路径别名 `@/*` |
| 构建 | Vite 7，`base: './'`，target `es2022`，输出 sourcemap |
| 样式 | CSS Modules + 一套设计令牌（`src/styles/tokens.css`） |
| 弹层 | Radix Dialog（焦点陷阱、Esc 关闭、滚动锁） |
| 测试 | Vitest，领域纯函数单测 |
| 规范 | ESLint 9 flat config + Prettier |

## 快速开始

```bash
npm install
npm run dev       # http://127.0.0.1:5173
npm run build     # tsc -b && vite build，产物在 dist/
npm run preview   # 预览构建产物
npm test          # 领域单元测试
npm run lint
npm run format
```

要求 Node ≥ 20。`dist/` 为纯静态产物，可直接放到任意静态站点或子目录（`base: './'` 使用相对路径）；不要用 `file://` 直接打开，ES Module 需要 HTTP 服务。

## 目录

```
src/
├─ domain/                 # 纯领域规则，不依赖 React 与界面
│  ├─ types.ts             # EntrySeed / Entry / Category / EntryState …
│  ├─ entry.ts             # 派生、筛选、计数、中文数字、检索高亮切分
│  └─ entry.test.ts        # 14 个领域用例
├─ data/                   # 可维护的事实数据（只写「有什么」，不写「怎么算」）
│  ├─ entries.ts           # 60 条 EntrySeed，末尾派生 ENTRIES
│  ├─ taxonomy.ts          # 九类目与卷次区间
│  ├─ chronology.ts        # 二十三事年表
│  ├─ voyage.ts            # 七站流布
│  ├─ preface.ts           # 卷首凡例、批注引语
│  └─ edition.ts           # 书名、刊记、首屏四项数字
├─ hooks/                  # 横切行为
│  ├─ useEntryFilter.ts    # 检索 + 类目筛选（useDeferredValue）
│  ├─ useScrollSpy.ts      # 当前章节判定（rAF 节流）
│  ├─ useScrollProgress.ts # 页头朱线进度
│  └─ useReveal.ts         # IntersectionObserver 入场
├─ features/reading/       # 阅读上下文
│  ├─ context.ts
│  ├─ ReadingProvider.tsx  # Provider + 内嵌影印页
│  ├─ useEntryDialog.ts    # hash 深链、开合、上一叶/下一叶
│  └─ useReadingMode.ts    # 竖排 / 横排，记忆到 localStorage
├─ components/
│  ├─ ui/                  # SectionHeading / Seal / Highlight
│  ├─ site-header/         # 书名牌、四节导航、朱线进度
│  ├─ hero/                # 封面（竖排书名、引语、朱印、四项数字）
│  ├─ preface/             # 卷首凡例
│  ├─ catalog/             # 总目：检索、类目、行列表
│  ├─ chronology/          # 年表二十三事
│  ├─ voyage/              # 流布七站
│  ├─ entry-dialog/        # 影印页（Radix Dialog）
│  └─ footer/              # 卷终刊记
├─ styles/                 # tokens / reset / global
├─ App.tsx
└─ main.tsx
```

分层原则：`domain` 只收规则，`data` 只收事实，`hooks` 收行为，`components` 只负责呈现；组件不直接计算卷次、年份差或存佚状态。

## 数据模型

`EntrySeed` 是人工维护的最小事实集：

```ts
{
  juan: '卷之四百六',
  title: '地动绕日',
  category: '天象',
  year: 1543,
  who: '哥白尼',
  work: '《天球运行论》',
  text: '……',
  note: '……',
  press: '……'
}
```

`hydrateEntries()` 统一派生：

- `id`：数组下标，稳定不变，用作深链与翻叶依据；
- `gap`：`year - 1408`，即「晚 N 年」；
- `state`：按序轮转的存佚状态（每五条一佚、每三条一残，其余存），只影响展示；
- `provenance`：若条目未写递藏，按固定模板生成。

新增一条，只需在 `src/data/entries.ts` 的 `ENTRY_SEEDS` 里补一个对象，并确认其 `category` 在 `taxonomy.ts` 中存在。卷次、年份差、存佚、递藏、计数、检索索引与深链会自动跟上。

## 交互与状态

- **检索**：标题、卷次、正文、小注、今按、西历年份统一匹配；篇名未命中时，在总目行下显示命中上下文。输入经 `useDeferredValue` 延后，避免长列表阻塞按键。`/` 聚焦检索框，`Esc` 清空。
- **类目**：九类 chips 带即时计数；「全部」显示 60，另有「任取一叶」随机入卷。
- **影印页**：整行可点，打开 `#/entry/<id>`；弹层内可切换竖排/横排、上一叶/下一叶，支持 `←` / `→` / `PageUp` / `PageDown` 与横向滑动翻叶；叶码、总叶数与顶部进度线随卷次推进，换叶时按方向作翻叶动效。`Esc` 或关闭按钮回到原路径。翻叶用 `replaceState`，不污染历史栈。
- **阅读方向**：`yongle.reader-mode` 记忆 `vertical` / `horizontal`。
- **动效**：封面墨迹下落、界行下落、引语侧入、朱印钤下；章节入场用 IntersectionObserver。`prefers-reduced-motion: reduce` 时全部改为即时呈现。

## 设计令牌

`src/styles/tokens.css` 是唯一的色彩与尺度来源：

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--c-ink` | `#15181A` | 正文墨色 |
| `--c-paper` | `#D9D2C0` | 纸底 |
| `--c-indigo` | `#17303D` | 函套、页头、流布 |
| `--c-vermilion` | `#9A2B22` | 朱印、纪年、强调 |
| `--c-gold` | `#A98A56` | 细线、辅助标记 |

字体走 `miaoda` 镜像的 Noto Serif SC（400/700/900），回退到 Songti SC / SimSun；批注另用 Kaiti 系统栈。版心最大 1180px。

## 可访问性

- 全部可点控件不小于 44×44；键盘焦点保留 `:focus-visible` 描边。
- 弹层由 Radix 管理焦点与 `aria-modal`；标题、描述、关闭按钮均有关联。
- 检索结果计数使用 `aria-live="polite"`；类目 chips 使用 `aria-pressed`。
- 装饰性字符、界行、水印均 `aria-hidden`，不进入朗读序列。

## 内容说明

书中条目、按语、递藏与年表均为仿古体例的文学创作，不是史料；引用请以正式出版物为准。

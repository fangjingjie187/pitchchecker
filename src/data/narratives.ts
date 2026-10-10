/**
 * 生涯叙事小结模板（报告区块 10 末尾）。
 *
 * 理论：Savickas 生涯建构主义——人不只是"被测量出来的分数"，
 * 更是自己生涯故事的叙述者。因此报告的结尾要回到第二人称的讲述，
 * 把兴趣、能力、价值观与当下的困境串成一段"你的故事"。
 *
 * 占位符说明（由 domain/report 层填充）：
 *   {primaryName} {secondaryName} {thirdName}  Holland 前三码的类型名
 *   {code}                                    三字母码，如 SAI
 *   {topAbility} {growAbility}                最有信心 / 最想发展的能力
 *   {valueList}                               Top3 价值观
 *   {strengthZone} {growthZone}               四象限中最突出 / 最值得投入的区域名
 *   {topCareer}                               匹配度最高的职业名
 *   {gradeFocus}                              该年级段的报告侧重点
 *   {subjectHint}                             学科—职业关联提示
 */
export const NARRATIVE_BLOCKS = {
  opening: [
    '如果把你现在的样子讲成一个故事开头，大概是这样：你的兴趣偏向是{primaryName}，{secondaryName}也在同时吸引你。',
    '你给出的答案里，最稳定的一条线索是：{primaryName}。它通常意味着{primaryHint}。',
  ],
  differentiation: {
    high: '你的兴趣相当聚焦——{code} 这三个字母几乎能概括你被什么吸引。聚焦是好事，但也记得给其他方向留一扇窗。',
    mid: '你的兴趣有一定倾向，但还没到非它不可的程度。现在正好是可以多试的阶段。',
    low: '你在很多事情上都有兴趣，还没有明显的高低之分。这不是"没想好"的缺点，而是你还在收集素材——很多人在广泛尝试之后才找到真正想深入的方向。',
  },
  abilityBridge: [
    '你最有信心的是{topAbility}，而{growAbility}是你最想再练一练的部分。有意思的是，这两件事并不一定重合——兴趣高但信心不足的地方，恰恰是最值得投入的地方。',
    '在能力上，你对{topAbility}很有把握；{growAbility}则还需要一些练习。信心是练出来的，不是等出来的。',
  ],
  valueBridge: [
    '在做决定时，你最看重的三件事是{valueList}。它们很可能就是你判断"这份工作值不值得"的底层标准。',
  ],
  quadrant: {
    strength: '你的优势区集中在{strengthZone}：既喜欢、也有信心，这是最容易做出成绩的地方。',
    growth: '{growthZone}是你最值得投入的区域：你有兴趣，但信心还不足——这恰恰是进步最快的地方。',
    balanced: '你的兴趣与信心分布比较均衡，说明你在多个方向上都还有发展的余地。',
  },
  pathway: [
    '你也许一直在想"学这些到底有什么用"。报告里的路径部分把这件事摊开了：{subjectHint}。',
  ],
  closing: {
    '12-14': '你现在不需要一个答案，需要的是几次真实的尝试。{gradeFocus}——先去做，再来判断。',
    '15-16': '选科不是选一生，但它确实会改变你能看到哪些路。{gradeFocus}——把不清楚的地方变成可以查清楚的问题。',
    '17-18': '你已经到了要把想法变成行动的时候。{gradeFocus}——做决定不必等到完全确定，做到八成就值得出发。',
  },
  disclaimer: [
    '这个故事不是结论，只是你此刻的样子。它会随着经历改变，而你始终是自己生涯的作者。',
  ],
} as const;

/**  Holland 三码对应的"一句话提示"（填充 {primaryHint}） */
export const HOLLAND_HINTS: Record<string, string> = {
  R: '你更愿意把手弄脏，把东西做出来',
  I: '你会忍不住追问"为什么"',
  A: '你需要一个能表达自己想法的出口',
  S: '你在意人，也在意自己的付出有没有用',
  E: '你喜欢把事情从零推动起来',
  C: '你把事情做规范会让自己安心',
};

/** 报告中的四象限区域名 */
export const QUADRANT_ZONE_LABELS = {
  strength: '优势区',
  growth: '成长区',
  potential: '潜力区',
  explore: '待探索区',
} as const;

export function getHollandHint(code: string): string {
  return HOLLAND_HINTS[code] ?? '你对这个方向有天然的好感';
}

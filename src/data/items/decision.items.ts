import type { AssessmentItem } from '@/types';

/**
 * 决策风格模块：GDMS 五风格 × 2 题 = 10 题，5 点量表（符合程度）。
 *
 * 理论：Dinklage (1968) 决策风格分类；Scott & Bruce (1995) 一般决策风格量表 GDMS；
 *      Harren 决策风格模型为辅助引用。
 * 条目标注：自编 / 改编的演示条目，未经标准化信效度检验（About 页已标注）。
 * 计分约定：全部正向计分，不使用反向题。
 *
 * 注意：avoidant（回避型）在维度定义中 polarity='negative'（得分越高越需要关注），
 *      这是构念方向标记，不是反向计分，条目本身仍为正向表述。
 */
export const DECISION_ITEMS: AssessmentItem[] = [
  {
    id: 'DS-rational-01',
    dimension: 'rational',
    type: 'likert5',
    text: '做重要决定前，我会把选项一条条列出来比较。',
  },
  {
    id: 'DS-rational-02',
    dimension: 'rational',
    type: 'likert5',
    text: '我会先花时间把信息弄清楚，再下判断。',
  },
  {
    id: 'DS-intuitive-01',
    dimension: 'intuitive',
    type: 'likert5',
    text: '很多时候，我凭第一感觉就能做出决定。',
  },
  {
    id: 'DS-intuitive-02',
    dimension: 'intuitive',
    type: 'likert5',
    text: '比起列一堆表，我更相信自己的直觉。',
  },
  {
    id: 'DS-dependent-01',
    dimension: 'dependent',
    type: 'likert5',
    text: '重要的事，我会先问爸妈或老师的意见再定。',
  },
  {
    id: 'DS-dependent-02',
    dimension: 'dependent',
    type: 'likert5',
    text: '如果身边的人不支持，我很难自己拿主意。',
  },
  {
    id: 'DS-avoidant-01',
    dimension: 'avoidant',
    type: 'likert5',
    text: '做选择的事，我倾向于能拖就拖，拖到不得不选的时候再说。',
  },
  {
    id: 'DS-avoidant-02',
    dimension: 'avoidant',
    type: 'likert5',
    text: '一想到要做选择我就有点烦，不如先不去想。',
  },
  {
    id: 'DS-spontaneous-01',
    dimension: 'spontaneous',
    type: 'likert5',
    text: '我常常临时起意就做了决定，不太纠结。',
  },
  {
    id: 'DS-spontaneous-02',
    dimension: 'spontaneous',
    type: 'likert5',
    text: '我觉得与其反复想，不如先做了再说。',
  },
];

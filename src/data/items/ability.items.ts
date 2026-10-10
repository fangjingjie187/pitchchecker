import type { AssessmentItem } from '@/types';

/**
 * 能力自信度模块：6 个能力维度 × 2 题 = 12 题。
 *
 * 作答方式：0–100 滑条、10 分一档（Bandura 自我效能量表规范），内部量化为 1–10 处理。
 * 理论：Bandura 自我效能理论；Lent, Brown & Hackett (1994) 社会认知生涯理论 SCCT。
 *
 * 关键措辞约定：题干统一问"我有多有信心"，不問"我有多擅长"。
 * 这是本模块的核心——自我效能是可塑的，报告中的所有低分都必须配提升路径。
 * 计分约定：全部正向计分，不使用反向题。
 */
export const ABILITY_ITEMS: AssessmentItem[] = [
  {
    id: 'AB-verbal-01',
    dimension: 'verbal',
    type: 'slider100',
    text: '在全班同学面前，把一件事清楚地讲三分钟。',
  },
  {
    id: 'AB-verbal-02',
    dimension: 'verbal',
    type: 'slider100',
    text: '写一篇别人能看明白、还想继续往下读的文章。',
  },
  {
    id: 'AB-logic-01',
    dimension: 'logic',
    type: 'slider100',
    text: '解出一道需要绕几个弯的数学题。',
  },
  {
    id: 'AB-logic-02',
    dimension: 'logic',
    type: 'slider100',
    text: '从一堆数字或信息里找出规律，或者发现哪里不对劲。',
  },
  {
    id: 'AB-spatial-01',
    dimension: 'spatial',
    type: 'slider100',
    text: '看着平面图，在脑子里想象出它搭好之后的立体样子。',
  },
  {
    id: 'AB-spatial-02',
    dimension: 'spatial',
    type: 'slider100',
    text: '在不熟悉的地方，看着地图自己找到路（不依赖导航）。',
  },
  {
    id: 'AB-handson-01',
    dimension: 'handson',
    type: 'slider100',
    text: '照着说明书，把一件东西完整组装好。',
  },
  {
    id: 'AB-handson-02',
    dimension: 'handson',
    type: 'slider100',
    text: '用简单的工具和材料，做出一个能用的东西。',
  },
  {
    id: 'AB-interpersonal-01',
    dimension: 'interpersonal',
    type: 'slider100',
    text: '和不太熟的同学合作，一起完成一件任务。',
  },
  {
    id: 'AB-interpersonal-02',
    dimension: 'interpersonal',
    type: 'slider100',
    text: '别人情绪不太好时，我能察觉到，并说上几句合适的话。',
  },
  {
    id: 'AB-creative-01',
    dimension: 'creative',
    type: 'slider100',
    text: '想出一个和别人都不一样、但又说得通的点子。',
  },
  {
    id: 'AB-creative-02',
    dimension: 'creative',
    type: 'slider100',
    text: '把一个想法变成看得见的作品，比如图文、视频、手工或小装置。',
  },
];

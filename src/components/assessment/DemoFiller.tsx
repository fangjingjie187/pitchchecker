import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { DEMO_PERSONAS } from '@/data/demoPersonas';
import { fillPersonaModule } from '@/domain/personaFiller';
import { useAssessment } from '@/hooks/useAssessment';
import { useToast } from '@/components/ui/Toast';
import { getActiveModules } from '@/config/modules';
import { selectBackRate } from '@/store/selectors';
import type { DemoPersona, ModuleKey } from '@/types';

/**
 * 演示一键填充：按人设生成全部模块的作答，用于现场演示与截图。
 * 填入的是完整的、可通过有效性检验的作答（配对题取自同一维度，天然一致）。
 */
export function DemoFiller({ onFilled }: { onFilled?: () => void }) {
  const { state, dispatch } = useAssessment();
  const { toast } = useToast();
  const backRate = selectBackRate(state);

  const fill = (persona: DemoPersona) => {
    const modules = getActiveModules({ quickMode: state.settings.quickMode });
    for (const meta of modules) {
      const generated = fillPersonaModule(persona, meta.key, 20261009);
      for (const [itemId, value] of Object.entries(generated)) {
        dispatch({ type: 'ANSWER', module: meta.key as ModuleKey, itemId, value });
      }
      dispatch({
        type: 'ADD_DURATION',
        module: meta.key,
        deltaMs: meta.itemCount * 4000,
      });
      dispatch({ type: 'COMPLETE_MODULE', module: meta.key });
    }
    dispatch({ type: 'SET_SETTINGS', patch: { lastPersonaId: persona.id } });
    toast(`已按「${persona.name}」填充全部作答`, 'success');
    onFilled?.();
  };

  return (
    <Card className="border-dashed border-brand-300 bg-brand-50/50">
      <div className="flex items-center gap-2">
        <Badge tone="warning">演示模式</Badge>
        <span className="text-xs text-muted">一键填充作答，用于现场演示与截图</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {DEMO_PERSONAS.map((persona) => (
          <div key={persona.id} className="rounded-xl bg-paper p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-ink-900">{persona.name}</p>
              {persona.isDefault ? <Badge tone="brand">默认</Badge> : null}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted">{persona.description}</p>
            <Button size="sm" variant="accent" className="mt-3" onClick={() => fill(persona)}>
              用这个人设填充
            </Button>
          </div>
        ))}
      </div>

      {/* 试测观察指标：误触回退率 = 回退点击次数 / 已作答条目数 */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-brand-200 pt-3 text-xs text-muted">
        <span>
          试测观察指标 · 误触回退率：{backRate.rate}%（回退 {backRate.backClicks} 次 / 已答{' '}
          {backRate.answered} 题）
        </span>
        <Button size="sm" variant="ghost" onClick={() => dispatch({ type: 'RESET_METRICS' })}>
          重置计数
        </Button>
      </div>
    </Card>
  );
}

import type { ReactNode } from 'react';
import { Card, SectionTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

/** 里程碑占位页：明确说明该页面将在哪个阶段实现，避免"空页面"造成困惑 */
export function PageStub({
  title,
  milestone,
  description,
  items,
  action,
}: {
  title: string;
  milestone: string;
  description: string;
  items: string[];
  action?: ReactNode;
}) {
  return (
    <div className="container-page max-w-3xl">
      <SectionTitle eyebrow={milestone} title={title} description={description} />
      <Card>
        <Badge tone="warning">该页面将在 {milestone} 实现</Badge>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-600">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        {action ? <div className="mt-6">{action}</div> : null}
      </Card>
    </div>
  );
}

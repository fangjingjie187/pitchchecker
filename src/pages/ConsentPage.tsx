import { useNavigate } from 'react-router-dom';
import { APP, PRIVACY_PROMISE } from '@/config/app.config';
import { Button } from '@/components/ui/Button';
import { Card, SectionTitle } from '@/components/ui/Card';
import { SquareCheckbox } from '@/components/ui/SquareCheckbox';
import { PageTransition } from '@/components/layout/PageTransition';
import { useAssessment } from '@/hooks/useAssessment';

/**
 * 知情同意页。面向未成年人，使用平实语言说明"是什么 / 不是什么 / 数据在哪 / 怎么删除"。
 */
export default function ConsentPage() {
  const { state, dispatch } = useAssessment();
  const navigate = useNavigate();
  const accepted = state.consent.accepted;

  const notices = [
    {
      title: '这不是考试，也没有标准答案',
      body: '题目没有对错，结果不会给你排名或打分。它只是帮你看清自己现在的想法。',
    },
    {
      title: '它也不能替你做决定',
      body: '报告给出的是"可能值得探索的方向"，不是"你应该做什么"的结论。真正的决定权一直在你手里。',
    },
    {
      title: '数据只在你自己的设备上',
      body: '所有作答保存在这台设备的浏览器里，不会上传，我们也不需要你填学校或姓名。',
    },
    {
      title: '随时可以退出或清除',
      body: '你可以中途停下，也可以随时清除全部数据，清除后无法恢复。',
    },
  ];

  return (
    <PageTransition>
      <div className="container-page max-w-3xl">
        <SectionTitle
          eyebrow="开始前"
          title="先花一分钟了解这件事"
          description="你未满 18 岁，我们希望你在清楚下面的内容后再开始。"
        />

        <Card>
          <ul className="space-y-4">
            {notices.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                <div>
                  <p className="text-sm font-semibold text-ink-800">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-xl bg-mist p-4">
            <p className="mb-2 text-xs font-semibold text-ink-700">隐私承诺</p>
            <ul className="space-y-1 text-xs leading-relaxed text-muted">
              {PRIVACY_PROMISE.map((line) => (
                <li key={line}>· {line}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 border-t border-brand-100 pt-5">
            <SquareCheckbox
              checked={accepted}
              onChange={(next) => dispatch({ type: next ? 'CONSENT_ACCEPT' : 'CONSENT_REVOKE' })}
              label="我已读懂以上说明，愿意开始探索。"
              description="勾选同意后，你的作答才会开始保存。"
            />
          </div>

          {/* F4：主操作按钮移至右下，桌面与移动端一致 */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => navigate('/')}>
              返回首页
            </Button>
            <Button
              size="lg"
              disabled={!accepted}
              onClick={() => navigate(state.profile ? '/hub' : '/profile')}
            >
              下一步
            </Button>
          </div>

          <p className="mt-4 text-xs text-ink-400">
            {APP.name} · 演示版本。若你对结果有疑问，建议与学校的心理老师或生涯规划老师一起讨论。
          </p>
        </Card>
      </div>
    </PageTransition>
  );
}

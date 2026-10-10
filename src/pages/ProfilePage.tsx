import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_GRADE_BAND, GRADE_BANDS } from '@/config/app.config';
import type { Gender, GradeBand, RegionType } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, SectionTitle } from '@/components/ui/Card';
import { PageTransition } from '@/components/layout/PageTransition';
import { useAssessment } from '@/hooks/useAssessment';
import { cn } from '@/utils/cn';

const GENDERS: { key: Gender; label: string }[] = [
  { key: 'female', label: '女' },
  { key: 'male', label: '男' },
  { key: 'undisclosed', label: '不愿透露' },
];

const REGIONS: { key: RegionType; label: string }[] = [
  { key: 'county', label: '县镇' },
  { key: 'city', label: '城市' },
  { key: 'other', label: '其他' },
  { key: 'undisclosed', label: '不愿透露' },
];

/**
 * 基本信息页。
 * 合规：昵称仅用于本机识别，不会写入报告、导出文件与分享码；不采集学校、姓名。
 */
export default function ProfilePage() {
  const { state, dispatch } = useAssessment();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(state.profile?.nickname ?? '');
  const [gradeBand, setGradeBand] = useState<GradeBand>(state.profile?.gradeBand ?? DEFAULT_GRADE_BAND);
  const [gender, setGender] = useState<Gender>(state.profile?.gender ?? 'undisclosed');
  const [regionType, setRegionType] = useState<RegionType>(state.profile?.regionType ?? 'undisclosed');

  const submit = () => {
    dispatch({
      type: 'SET_PROFILE',
      profile: {
        nickname: nickname.trim(),
        gradeBand,
        gender,
        regionType,
        createdAt: state.profile?.createdAt ?? Date.now(),
      },
    });
    navigate('/hub');
  };

  return (
    <PageTransition>
      <div className="container-page max-w-3xl">
        <SectionTitle
          eyebrow="第一步"
          title="先认识一下你"
          description="这些信息只保存在你的设备上。我们不需要你的学校、姓名或联系方式。"
        />

        <Card className="space-y-7">
          <div>
            <label className="block text-sm font-medium text-ink-800" htmlFor="nickname">
              给自己起个昵称（可以留空）
            </label>
            <p className="mt-1 text-xs text-muted">
              只用于在本机区分不同的记录，不会出现在报告和分享内容里。
            </p>
            <input
              id="nickname"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              maxLength={16}
              placeholder="比如：小罗"
              className="mt-3 h-11 w-full rounded-xl border border-brand-200 bg-paper px-4 text-sm outline-none transition-colors focus:border-brand-400"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-ink-800">你现在大概在哪个阶段</p>
            <p className="mt-1 text-xs text-muted">不同阶段的题目说法和报告重点会略有不同。</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {GRADE_BANDS.map((band) => (
                <button
                  key={band.key}
                  type="button"
                  onClick={() => setGradeBand(band.key)}
                  aria-pressed={gradeBand === band.key}
                  className={cn(
                    'rounded-xl border p-3 text-left transition-colors',
                    gradeBand === band.key
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-brand-200 bg-paper hover:border-brand-300 hover:bg-brand-50/60',
                  )}
                >
                  <span className="block text-sm font-semibold">{band.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted">
                    {band.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <ChoiceRow
            label="性别"
            hint="仅用于参考区间对照，结果与推荐不因性别而变化。"
            options={GENDERS}
            value={gender}
            onChange={setGender}
          />

          <ChoiceRow
            label="学校所在地类型"
            hint="仅用于让职业举例更贴近你的生活环境。"
            options={REGIONS}
            value={regionType}
            onChange={setRegionType}
          />

          {/* F4：主操作按钮移至右下，桌面与移动端一致，保持大触控目标 */}
          <div className="flex items-center justify-end gap-3 border-t border-brand-100 pt-5">
            <Button variant="ghost" onClick={() => navigate('/consent')}>
              上一步
            </Button>
            <Button size="lg" onClick={submit}>
              进入探索
            </Button>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}

function ChoiceRow<T extends string>({
  label,
  hint,
  options,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  options: { key: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-ink-800">{label}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            aria-pressed={value === option.key}
            className={cn(
              'rounded-full border px-4 py-2 text-sm transition-colors',
              value === option.key
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'border-brand-200 bg-paper text-ink-600 hover:border-brand-300 hover:bg-brand-50',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

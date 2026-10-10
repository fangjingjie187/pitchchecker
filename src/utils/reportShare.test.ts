import { describe, expect, it } from 'vitest';
import { createInitialState } from '@/store/persistence';
import { DEMO_PERSONAS } from '@/data/demoPersonas';
import { fillPersonaModule } from '@/domain/personaFiller';
import { buildReport } from '@/domain/buildReport';
import { reportToSharePayload } from './reportShare';
import { decodeShareCode, encodeShareCode } from './shareCode';
import { MODULES } from '@/config/modules';
import type { AppState, ModuleKey } from '@/types';

function fullState(): AppState {
  const persona = DEMO_PERSONAS[0];
  const answers: AppState['answers'] = {};
  for (const meta of MODULES) {
    const filled = fillPersonaModule(persona, meta.key as ModuleKey, 20261009);
    answers[meta.key as ModuleKey] = {
      answers: filled,
      updatedAt: Date.now(),
      currentIndex: 0,
      completed: true,
      durationMs: meta.itemCount * 4000,
    };
  }
  return {
    ...createInitialState(),
    profile: {
      nickname: '小罗',
      gradeBand: '15-16',
      gender: 'undisclosed',
      regionType: 'undisclosed',
      createdAt: Date.now(),
    },
    answers,
  };
}

describe('报告分享码', () => {
  it('报告 → 载荷 → 分享码 → 解码，三字母码与向量可还原', () => {
    const report = buildReport(fullState(), '15-16');
    const payload = reportToSharePayload(report);
    const code = encodeShareCode(payload);
    const decoded = decodeShareCode(code);

    expect(decoded.holland).toBe(payload.holland);
    expect(decoded.interests).toEqual(payload.interests);
    expect(decoded.abilities).toEqual(payload.abilities);
    expect(decoded.values).toEqual(payload.values);
    expect(decoded.warmup).toEqual(payload.warmup);
  });

  it('分享码不包含昵称等身份信息', () => {
    const report = buildReport(fullState(), '15-16');
    const code = encodeShareCode(reportToSharePayload(report));
    expect(code).not.toContain('小罗');
    expect(code).not.toMatch(/school|name|学校/i);
  });
});

import { CONSENT_VERSION } from '@/config/app.config';
import type { AnswerValue, AppState, ModuleKey, Profile, ResultSnapshot, Settings } from '@/types';

export type Action =
  | { type: 'HYDRATE'; state: AppState }
  | { type: 'CONSENT_ACCEPT' }
  | { type: 'CONSENT_REVOKE' }
  | { type: 'SET_PROFILE'; profile: Profile }
  | { type: 'ANSWER'; module: ModuleKey; itemId: string; value: AnswerValue }
  | { type: 'SET_INDEX'; module: ModuleKey; index: number }
  | { type: 'ADD_DURATION'; module: ModuleKey; deltaMs: number }
  | { type: 'COMPLETE_MODULE'; module: ModuleKey }
  | { type: 'RESET_MODULE'; module: ModuleKey }
  | { type: 'ADD_RESULT'; snapshot: ResultSnapshot }
  | { type: 'DELETE_RESULT'; id: string }
  | { type: 'SET_SETTINGS'; patch: Partial<Settings> }
  | { type: 'METRIC_BACK' }
  | { type: 'METRIC_AUTO_ADVANCE' }
  | { type: 'RESET_METRICS' }
  | { type: 'RESET_ALL' };

function ensureModule(state: AppState, key: ModuleKey): AppState['answers'] {
  const existing = state.answers[key];
  return {
    ...state.answers,
    [key]: existing ?? {
      answers: {},
      updatedAt: Date.now(),
      currentIndex: 0,
      completed: false,
      durationMs: 0,
    },
  };
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return action.state;

    case 'CONSENT_ACCEPT':
      return {
        ...state,
        consent: { accepted: true, acceptedAt: Date.now(), version: CONSENT_VERSION },
      };

    case 'CONSENT_REVOKE':
      return {
        ...state,
        consent: { accepted: false, acceptedAt: null, version: CONSENT_VERSION },
      };

    case 'SET_PROFILE':
      return { ...state, profile: action.profile };

    case 'ANSWER': {
      const answers = ensureModule(state, action.module);
      const current = answers[action.module]!;
      return {
        ...state,
        answers: {
          ...answers,
          [action.module]: {
            ...current,
            answers: { ...current.answers, [action.itemId]: action.value },
            updatedAt: Date.now(),
          },
        },
      };
    }

    case 'SET_INDEX': {
      const answers = ensureModule(state, action.module);
      const current = answers[action.module]!;
      return {
        ...state,
        answers: {
          ...answers,
          [action.module]: { ...current, currentIndex: Math.max(0, action.index) },
        },
      };
    }

    case 'ADD_DURATION': {
      const answers = ensureModule(state, action.module);
      const current = answers[action.module]!;
      return {
        ...state,
        answers: {
          ...answers,
          [action.module]: { ...current, durationMs: current.durationMs + action.deltaMs },
        },
      };
    }

    case 'COMPLETE_MODULE': {
      const answers = ensureModule(state, action.module);
      const current = answers[action.module]!;
      return {
        ...state,
        answers: {
          ...answers,
          [action.module]: { ...current, completed: true, updatedAt: Date.now() },
        },
      };
    }

    case 'RESET_MODULE': {
      const next = { ...state.answers };
      delete next[action.module];
      return { ...state, answers: next };
    }

    case 'ADD_RESULT':
      return { ...state, results: [action.snapshot, ...state.results].slice(0, 20) };

    case 'DELETE_RESULT':
      return { ...state, results: state.results.filter((r) => r.id !== action.id) };

    case 'SET_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.patch } };

    case 'METRIC_BACK':
      return { ...state, metrics: { ...state.metrics, backClicks: state.metrics.backClicks + 1 } };

    case 'METRIC_AUTO_ADVANCE':
      return { ...state, metrics: { ...state.metrics, autoAdvances: state.metrics.autoAdvances + 1 } };

    case 'RESET_METRICS':
      return { ...state, metrics: { backClicks: 0, autoAdvances: 0 } };

    case 'RESET_ALL':
      return {
        version: state.version,
        consent: { accepted: false, acceptedAt: null, version: CONSENT_VERSION },
        profile: null,
        answers: {},
        results: [],
        settings: { quickMode: false, demoMode: false, lastPersonaId: null },
        metrics: { backClicks: 0, autoAdvances: 0 },
      };

    default:
      return state;
  }
}

import { NavLink, useLocation } from 'react-router-dom';
import { APP } from '@/config/app.config';
import { cn } from '@/utils/cn';
import { useAssessment } from '@/hooks/useAssessment';
import { selectOverallProgress } from '@/store/selectors';
import { ProgressBar } from '@/components/ui/Progress';

const NAV = [
  { to: '/', label: '首页' },
  { to: '/hub', label: '开始探索' },
  { to: '/careers', label: '职业库' },
  { to: '/history', label: '成长档案' },
  { to: '/about', label: '关于' },
];

export function Header() {
  const { state } = useAssessment();
  const progress = selectOverallProgress(state);
  const location = useLocation();
  const showProgress = progress.total > 0 && location.pathname !== '/';

  return (
    <header className="app-header sticky top-0 z-40 border-b border-brand-100 bg-paper/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-2.5">
          <span aria-hidden className="block h-9 w-9 shadow-card">
            <svg viewBox="0 0 64 64" className="h-9 w-9 rounded-xl">
              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#4EB2E9" />
                  <stop offset="1" stopColor="#1888C6" />
                </linearGradient>
              </defs>
              <rect width="64" height="64" rx="15" fill="url(#logo-gradient)" />
              <circle cx="32" cy="32" r="19.5" fill="#ffffff" />
              <path d="M42.2 21.8 L35.3 35.3 L21.8 42.2 L28.8 28.8 Z" fill="#2191CD" />
              <circle cx="32" cy="32" r="2.6" fill="#ffffff" />
            </svg>
          </span>
          <span>
            <span className="block text-[15px] font-semibold leading-tight">{APP.name}</span>
            <span className="block text-[11px] leading-tight text-muted">生涯探索工具</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-brand-50 hover:text-brand-700',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {showProgress ? (
            <div className="hidden w-32 sm:block">
              <ProgressBar value={progress.ratio * 100} label="作答进度" />
            </div>
          ) : null}
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-brand-100 px-4 py-2 md:hidden">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'shrink-0 rounded-lg px-3 py-1.5 text-sm transition-colors',
                isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-500',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

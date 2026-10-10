import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { DevDataWarning } from './DevDataWarning';
import { ToastProvider } from '@/components/ui/Toast';
import { useAssessment } from '@/hooks/useAssessment';

/**
 * 全局外壳：导航 + 内容 + 页脚。
 * 知情同意门禁：未完成同意且不在同意页 / 首页时，统一跳转到 /consent。
 */
export function AppShell() {
  const { state, hydrated } = useAssessment();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hydrated) return;
    // /share 为访客功能（输入好友分享码临时查看结果），无需知情同意
    const publicPaths = ['/', '/consent', '/about', '/careers', '/share'];
    if (!state.consent.accepted && !publicPaths.includes(location.pathname)) {
      navigate('/consent', { replace: true });
    }
  }, [hydrated, state.consent.accepted, location.pathname, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-mist">
        <DevDataWarning />
        <Header />
        <main className="flex-1 py-8 sm:py-10">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}

import { HashRouter } from 'react-router-dom';
import { AssessmentProvider } from '@/store/AssessmentContext';
import { AppRoutes } from './router';

/**
 * HashRouter：静态托管无需服务端 rewrite 配置，避免深链接 404。
 */
export default function App() {
  return (
    <HashRouter>
      <AssessmentProvider>
        <AppRoutes />
      </AssessmentProvider>
    </HashRouter>
  );
}

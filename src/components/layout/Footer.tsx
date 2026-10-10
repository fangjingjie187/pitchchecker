import { useState } from 'react';
import { Link } from 'react-router-dom';
import { APP, CRISIS_HINT, DISCLAIMER_SHORT, PRIVACY_PROMISE } from '@/config/app.config';
import { formatDateTime } from '@/utils/format';
import { useAssessment } from '@/hooks/useAssessment';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export function Footer() {
  const { dispatch } = useAssessment();
  const { toast } = useToast();
  const [openPrivacy, setOpenPrivacy] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <footer className="app-footer mt-16 border-t border-brand-100 bg-paper">
      <div className="container-page py-8">
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-ink-800">{APP.name}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{APP.tagline}</p>
          </div>
          <div className="text-xs leading-relaxed text-muted">
            <p className="mb-2 font-medium text-ink-700">隐私承诺</p>
            <ul className="space-y-1">
              {PRIVACY_PROMISE.map((line) => (
                <li key={line}>· {line}</li>
              ))}
            </ul>
          </div>
          <div className="text-xs leading-relaxed text-muted">
            <p className="mb-2 font-medium text-ink-700">关于结果</p>
            <p>{DISCLAIMER_SHORT}</p>
            <p className="mt-2">{CRISIS_HINT}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-brand-100 pt-5 text-xs text-muted">
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/about" className="hover:text-brand-700">
              理论与伦理说明
            </Link>
            <button type="button" className="hover:text-brand-700" onClick={() => setOpenPrivacy(true)}>
              数据说明
            </button>
            <button
              type="button"
              className="hover:text-coral-700"
              onClick={() => setConfirmClear(true)}
            >
              清除本机全部数据
            </button>
          </div>
          <span>
            {APP.name} v{APP.version} · {formatDateTime(APP.buildTime)}
          </span>
        </div>
      </div>

      <Modal
        open={openPrivacy}
        onClose={() => setOpenPrivacy(false)}
        title="数据都存在哪里？"
        description="你的作答只保存在当前设备的浏览器里。"
        footer={
          <Button variant="outline" onClick={() => setOpenPrivacy(false)}>
            我知道了
          </Button>
        }
      >
        <ul className="space-y-2 text-sm text-ink-600">
          {PRIVACY_PROMISE.map((line) => (
            <li key={line}>· {line}</li>
          ))}
        </ul>
      </Modal>

      <Modal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="确认清除全部数据？"
        description="这会删除你的作答记录与历史报告，且无法恢复。"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmClear(false)}>
              取消
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                dispatch({ type: 'RESET_ALL' });
                setConfirmClear(false);
                toast('本机数据已清除', 'success');
              }}
            >
              确认清除
            </Button>
          </>
        }
      />
    </footer>
  );
}

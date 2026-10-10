import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { usePrint } from '@/hooks/usePrint';
import { SHARE_CODE_NOTE } from '@/config/app.config';
import { encodeShareCode } from '@/utils/shareCode';
import { copyToClipboard } from '@/utils/exportFile';
import { reportToSharePayload } from '@/utils/reportShare';
import type { Report } from '@/types';

/**
 * 报告工具条：打印 / 存为 PDF、生成分享码、导出。
 *
 * v1.0.2：产品已部署到公网静态托管，分享码恢复启用（F7 反向操作）——
 * 分享码可在任意可访问该站点的设备上还原为简版结果。
 */
export function ReportToolbar({ report }: { report: Report }) {
  const print = usePrint();
  const { toast } = useToast();
  const [shareCode, setShareCode] = useState<string | null>(null);

  const generateShare = () => {
    setShareCode(encodeShareCode(reportToSharePayload(report)));
  };

  return (
    <div className="report-toolbar no-print flex flex-wrap items-center gap-2">
      <Button variant="outline" onClick={() => print('生涯罗盘 · 我的生涯画像')}>
        打印 / 存为 PDF
      </Button>
      <Button variant="outline" onClick={generateShare}>
        生成分享码
      </Button>
      <ShareCodeModal
        open={shareCode !== null}
        onClose={() => setShareCode(null)}
        code={shareCode}
        onCopy={async (code) => {
          const ok = await copyToClipboard(code);
          toast(ok ? '已复制' : '复制失败', ok ? 'success' : 'warn');
        }}
      />
    </div>
  );
}

export function ShareCodeModal({
  open,
  onClose,
  code,
  onCopy,
}: {
  open: boolean;
  onClose: () => void;
  code: string | null;
  onCopy: (code: string) => void | Promise<void>;
}) {
  if (!open || !code) return null;
  return (
    <Modal
      open
      onClose={onClose}
      title="你的结果分享码"
      description={SHARE_CODE_NOTE}
      footer={
        <Button onClick={() => onCopy(code)}>复制分享码</Button>
      }
    >
      <p className="break-all rounded-xl bg-mist p-4 font-mono text-sm text-ink-800">{code}</p>
    </Modal>
  );
}

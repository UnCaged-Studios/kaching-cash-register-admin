import { Icons, Tooltip, Typography } from '@pankod/refine-antd';
import { Transfer } from './SignTransfersForm';

type Props = {
  transfer: Transfer;
  shouldCreateAta: boolean;
};

export function TransferToTableCell({
  shouldCreateAta,
  transfer: { to, toAta },
}: Props) {
  const color = shouldCreateAta ? 'red' : 'green';
  const tooltip = shouldCreateAta
    ? 'This ATA will be created in the transaction'
    : 'This ATA is already created';
  return (
    <div>
      <div>
        <Typography.Text strong>{to?.toBase58()}</Typography.Text>
      </div>
      <Tooltip title={tooltip}>
        <Typography.Text style={{ color }}>
          <span style={{ marginRight: '0.2em' }}>{toAta?.toBase58()}</span>
          {shouldCreateAta && <Icons.ExclamationCircleOutlined />}
        </Typography.Text>
      </Tooltip>
    </div>
  );
}

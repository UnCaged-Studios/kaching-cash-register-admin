import { Tooltip, Typography } from '@mui/material';
import { Transfer } from './SignTransfersForm';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

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
        <Typography variant="body2">{to?.toBase58()}</Typography>
      </div>
      <Tooltip title={tooltip}>
        <Typography variant="body2" gutterBottom color={color}>
          <span style={{ marginRight: '0.2em' }}>{toAta?.toBase58()}</span>
          {shouldCreateAta && <ErrorOutlineIcon />}
        </Typography>
      </Tooltip>
    </div>
  );
}

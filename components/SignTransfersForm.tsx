import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import {
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
} from '@solana/spl-token';
import { useMutation, useQuery } from 'react-query';
import { TransferToTableCell } from './TransferToTableCell';
import { FC, ReactElement, useState } from 'react';
import { getLocalStorage } from '../utils/localStorageHandle';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  WarningAmber,
  CheckCircleOutline,
  BorderOuter,
} from '@mui/icons-material';

export type Transfer = {
  key: number;
  sourceAta: PublicKey;
  to: PublicKey;
  toAta: PublicKey;
  tokenMint: PublicKey;
  amount: bigint;
  decimals: number;
};

type Props = {
  transfers: Transfer[];
  cancel: () => void;
};

const MAX_TRANSACTION_SIZE = 1230;

const TransactionInfo = ({ txSig }: { txSig: string }): ReactElement => (
  <span>
    Transaction:{' '}
    <a
      href={`https://explorer.solana.com/tx/${txSig}`}
      rel="noreferrer"
      target="_blank"
    >
      {txSig}
    </a>
  </span>
);

export const SignTransfersForm: FC<Props> = ({ transfers, cancel }) => {
  const endpoint = getLocalStorage('endpoint');
  const connection = new Connection(JSON.parse(endpoint!));
  const { signTransaction, publicKey } = useWallet();
  const [currentTxSig, setCurrentTxSig] = useState<string | undefined>();

  const atasQuery = useQuery(['solana-transfers-atas'], async () => {
    return await connection.getMultipleAccountsInfo(
      transfers.map(({ toAta }) => toAta)
    );
  });

  const mutation = useMutation<string, Error>({
    mutationFn: async () => {
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      const atas = atasQuery.data;
      if (!transfers) throw new Error('missing transfers');
      if (!publicKey) throw new Error('missing publicKey');
      if (!signTransaction) throw new Error('missing signTransaction');
      if (!atas) throw new Error('missing atas');

      setCurrentTxSig(undefined);
      const tx = new Transaction({
        blockhash: blockhash,
        lastValidBlockHeight,
        feePayer: publicKey,
      });
      const createdAtas: string[] = [];

      transfers.forEach(
        ({ sourceAta, to, toAta, tokenMint, amount, decimals }, idx) => {
          const ata = atas[idx];
          if (!ata && !createdAtas.includes(toAta.toBase58())) {
            createdAtas.push(toAta.toBase58());
            tx.add(
              createAssociatedTokenAccountInstruction(
                publicKey,
                toAta,
                to,
                tokenMint
              )
            );
          }
          const ix = createTransferCheckedInstruction(
            sourceAta,
            tokenMint,
            toAta,
            publicKey,
            // eslint-disable-next-line no-undef
            BigInt(amount),
            decimals
          );
          tx.add(ix);
        }
      );
      const signed = await signTransaction(tx);
      const serialized = signed.serialize();
      if (serialized.length > MAX_TRANSACTION_SIZE)
        throw new Error(
          `Transaction size is ${serialized.length} bytes, maximum is ${MAX_TRANSACTION_SIZE}`
        );

      const signature = await connection.sendRawTransaction(serialized);
      setCurrentTxSig(signature);
      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });
      return signature;
    },
  });

  return (
    <FormControl sx={{ width: '100%' }}>
      <FormGroup>
        {transfers.length === 0 ? (
          atasQuery.isLoading
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell align="center">To/ATA</TableCell>
                  <TableCell align="center">Token</TableCell>
                  <TableCell align="center">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transfers.map((transfer, idx) => (
                  <TableRow
                    key={idx}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {idx + 1}
                    </TableCell>
                    <TableCell align="center">
                      <TransferToTableCell
                        shouldCreateAta={!atasQuery.data?.at(idx)}
                        transfer={transfer}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {transfer.tokenMint.toBase58()}
                    </TableCell>
                    <TableCell align="center">{`${transfer.amount} / 1e${transfer.decimals}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </FormGroup>
      <FormGroup>
        <Box sx={{ m: 1 }}>
          <Button
            sx={{ m: 1, marginTop: 3 }}
            variant="contained"
            onClick={() => {
              mutation.mutate();
            }}
            disabled={mutation.isLoading}
          >
            Sign all transfers
          </Button>

          <Button
            sx={{ m: 1, marginTop: 3 }}
            variant="contained"
            onClick={() => {
              cancel();
            }}
            disabled={mutation.isLoading}
          >
            Cancel
          </Button>

          <Typography style={{ color: mutation.isError ? 'red' : undefined }}>
            <span style={{ marginRight: '0.3em' }}>
              {mutation.isLoading && <CircularProgress />}
              {mutation.isError && <WarningAmber />}
              {mutation.isSuccess && <CheckCircleOutline />}
              {mutation.isIdle && <BorderOuter />}
            </span>

            {mutation.isLoading && currentTxSig && (
              <span>
                <TransactionInfo txSig={currentTxSig} /> (confirming...)
              </span>
            )}
            {mutation.isSuccess && currentTxSig && (
              <span>
                <TransactionInfo txSig={currentTxSig} /> (confirmed)
              </span>
            )}
            {mutation.isError && (
              <span>
                {mutation.error.name || 'Error'}: {mutation.error.message}
              </span>
            )}
          </Typography>
        </Box>
      </FormGroup>
    </FormControl>
  );
};

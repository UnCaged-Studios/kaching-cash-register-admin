import {
  Button,
  Form,
  Icons,
  Space,
  Table,
  Typography,
} from '@pankod/refine-antd';
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
    <Form layout="vertical">
      <Form.Item>
        <Table
          loading={atasQuery.isLoading}
          columns={[
            {
              title: '#',
              render: ({ key }) => key,
            },
            {
              title: 'To/ATA',
              render: (transfer, _r, idx) => (
                <TransferToTableCell
                  shouldCreateAta={!atasQuery.data?.at(idx)}
                  transfer={transfer}
                />
              ),
            },
            {
              title: 'Token',
              render: ({ tokenMint }) => tokenMint?.toBase58(),
            },
            {
              title: 'Amount',
              render: ({ amount, decimals }) => `${amount} / 1e${decimals}`,
            },
          ]}
          dataSource={transfers}
          pagination={false}
        />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button
            type="primary"
            onClick={() => mutation.mutate()}
            disabled={mutation.isLoading}
          >
            Sign all transfers
          </Button>
          <Button
            type="dashed"
            onClick={() => cancel()}
            disabled={mutation.isLoading}
          >
            cancel
          </Button>
          <Typography.Text
            style={{ color: mutation.isError ? 'red' : undefined }}
          >
            <span style={{ marginRight: '0.3em' }}>
              {mutation.isLoading && <Icons.LoadingOutlined />}
              {mutation.isError && <Icons.WarningOutlined />}
              {mutation.isSuccess && <Icons.GoldOutlined />}
              {mutation.isIdle && <Icons.BorderOuterOutlined />}
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
          </Typography.Text>
        </Space>
      </Form.Item>
    </Form>
  );
};

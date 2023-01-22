import { Button, TextField } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { useState } from 'react';
import type { FC } from 'react';
import { getLocalStorage } from '../../../utils/localStorageHandle';
import { createCashRegisterTxBuilder } from '../../../utils/sdk';

export const CreateCashRegister: FC = () => {
  const cashier = useWallet();
  const [cashRegId, setCashRegId] = useState('');

  const createCashRegister = async () => {
    const endpoint = getLocalStorage('endpoint');
    try {
      if (endpoint && cashRegId) {
        const connection = new Connection(JSON.parse(endpoint!));

        const orderSignersWhitelist: Array<PublicKey> = [cashier.publicKey!];

        const consumedOrdersAccount = Keypair.generate();

        const { consumedOrdersTx, cashRegisterTx } =
          createCashRegisterTxBuilder({
            cashier: cashier.publicKey!,
            consumedOrdersAccount: consumedOrdersAccount.publicKey,
            orderSignersWhitelist,
          });

        await cashier.sendTransaction(consumedOrdersTx(), connection, {
          signers: [consumedOrdersAccount],
          skipPreflight: true,
          preflightCommitment: 'processed',
        });

        const cashRegisterTransaction = await cashRegisterTx(cashRegId);

        await cashier.sendTransaction(cashRegisterTransaction, connection, {
          skipPreflight: true,
          preflightCommitment: 'processed',
        });
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  return (
    <div>
      {cashier.connected ? (
        <>
          <TextField
            sx={{ m: 1 }}
            id="outlined-basic"
            label="CashRegister ID"
            variant="outlined"
            value={cashRegId}
            onChange={(v) => setCashRegId(v.target.value)}
            size="small"
            required
            error={cashRegId === ''}
            helperText={
              cashRegId === '' ? 'Must Required CashRegister ID' : ' '
            }
          />
          <Button
            sx={{ m: 1 }}
            variant="contained"
            onClick={() => {
              createCashRegister();
            }}
          >
            Create CashRegister
          </Button>
        </>
      ) : (
        <h1>You are not connected to the wallet</h1>
      )}
    </div>
  );
};

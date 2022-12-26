import { Button, TextField } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { FC, useState } from 'react';
import { getLocalStorage } from '../../../utils/localStorageHandle';
import { createCashBoxTxBuilder } from '../../../utils/sdk';

export const CreateCashBox: FC = () => {
  const cashier = useWallet();
  const [cashRegId, setCashRegId] = useState('');
  const [currency, setCurrency] = useState('');

  const createCashBox = async () => {
    try {
      const endpoint = getLocalStorage('endpoint');
      if (endpoint && cashRegId && currency) {
        const connection = new Connection(JSON.parse(endpoint!));
        const { cashBoxTx } = createCashBoxTxBuilder({
          currency: new PublicKey(currency),
          cashier: cashier.publicKey!,
        });
        const cashBoxTransaction = await cashBoxTx(cashRegId);
        console.log('cashBoxTransaction: ', cashBoxTransaction);
        const createCashBoxSignature = await cashier.sendTransaction(
          cashBoxTransaction,
          connection
        );
        console.log('createCashBoxSignature: ', createCashBoxSignature);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
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
          <TextField
            sx={{ m: 1 }}
            id="outlined-basic"
            label="Currency Token"
            variant="outlined"
            value={currency}
            onChange={(v) => setCurrency(v.target.value)}
            size="small"
            required
            error={currency === ''}
            helperText={currency === '' ? 'Must Required Currency Token' : ' '}
          />
          <Button
            sx={{ m: 1 }}
            variant="contained"
            onClick={() => {
              createCashBox();
            }}
          >
            Create CashBox
          </Button>
        </>
      ) : (
        <h1>You are not connected to the wallet</h1>
      )}
    </>
  );
};

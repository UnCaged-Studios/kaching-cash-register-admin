import { Button, TextField } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Keypair } from '@solana/web3.js';
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
      if (endpoint) {
        const connection = new Connection(JSON.parse(endpoint!));
        let cashRegisterId;
        if (!cashRegId) {
          cashRegisterId = generateRandomCashRegisterId();
        } else {
          cashRegisterId = cashRegId;
        }
        const consumedOrders = Keypair.generate();
        const { consumedOrdersTx, cashRegisterTx } =
          createCashRegisterTxBuilder({
            cashier: cashier.publicKey!,
            targetAccount: consumedOrders.publicKey,
          });
        await cashier.sendTransaction(consumedOrdersTx(), connection, {
          signers: [consumedOrders],
        });
        const cashRegisterTransaction = await cashRegisterTx(cashRegisterId);
        await cashier.sendTransaction(cashRegisterTransaction, connection);
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
            helperText={
              cashRegId === ''
                ? 'If empty then a random ID will be generated'
                : ' '
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

const randomLowerCaseCharCode = () =>
  [1, 2, 3]
    .map(() => String.fromCharCode(97 + Math.floor(Math.random() * 25)))
    .join('');

export const generateRandomCashRegisterId = (
  prefix: string = 'my_cash_register_'
) => `${prefix}${randomLowerCaseCharCode()}`;

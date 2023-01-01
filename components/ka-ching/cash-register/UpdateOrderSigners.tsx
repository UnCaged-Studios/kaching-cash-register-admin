import { Button, MenuItem, TextField } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useState } from 'react';
import type { FC } from 'react';
import { getLocalStorage } from '../../../utils/localStorageHandle';
import { updateOrderSignersWhitelistTxBuilder } from '../../../utils/sdk';

const updateTypeOrderSignerList = [
  {
    value: 'merge',
    label: 'Merge',
  },
  {
    value: 'override',
    label: 'Override',
  },
];

export const UpdateOrderSignersWhitelist: FC = () => {
  const cashier = useWallet();
  const [cashRegId, setCashRegId] = useState('');
  const [orderSigner, setOrderSigner] = useState('');
  const [updateType, setUpdateType] = useState<'merge' | 'override'>();

  const updateOrderSignerslist = async () => {
    const endpoint = getLocalStorage('endpoint');
    try {
      if (cashRegId && orderSigner && updateType && endpoint) {
        const connection = new Connection(JSON.parse(endpoint!));
        const orderSignersWhitelist: Array<PublicKey> = [
          new PublicKey(orderSigner),
        ];

        const { updateOrderSignersWhitelistTx } =
          updateOrderSignersWhitelistTxBuilder({
            cashier: cashier.publicKey!,
          });

        const updateOrderSignerslistTransaction =
          await updateOrderSignersWhitelistTx(
            cashRegId,
            orderSignersWhitelist,
            updateType
          );

        await cashier.sendTransaction(
          updateOrderSignerslistTransaction,
          connection
        );
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
          <TextField
            sx={{ m: 1 }}
            id="outlined-basic"
            label="Order Signer Address"
            variant="outlined"
            value={orderSigner}
            onChange={(v) => setOrderSigner(v.target.value)}
            size="small"
            required
            error={orderSigner === ''}
            helperText={
              orderSigner === '' ? 'Must Required Order Signer Address' : ' '
            }
          />
          <TextField
            sx={{ m: 1 }}
            id="outlined-select-currency"
            label="Update Type"
            select
            value={updateType || ''}
            onChange={(v) =>
              setUpdateType(v.target.value as 'merge' | 'override')
            }
            size="small"
            required
            error={updateType === undefined}
            helperText={
              updateType === undefined ? 'Must Required Update Type' : ' '
            }
          >
            {updateTypeOrderSignerList.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            sx={{ m: 1 }}
            variant="contained"
            onClick={() => {
              updateOrderSignerslist();
            }}
          >
            Update Order Signers List
          </Button>
        </>
      ) : (
        <h1>You are not connected to the wallet</h1>
      )}
    </div>
  );
};

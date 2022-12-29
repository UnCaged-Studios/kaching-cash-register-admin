import { Button, TextField, Typography } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { FC, useState } from 'react';
import { getLocalStorage } from '../../../utils/localStorageHandle';
import { createCashBoxTxBuilder } from '../../../utils/sdk';

export const CreateCashBox: FC = () => {
  const cashier = useWallet();
  const [cashRegId, setCashRegId] = useState('');
  const [currencyAddress, setCurrencyAddress] = useState('');
  const [showAddress, setShowAddress] = useState(false);
  const [cashBoxPubKey, setCashBoxPubKey] = useState<PublicKey>();

  const createCashBox = async () => {
    try {
      const endpoint = getLocalStorage('endpoint');
      if (endpoint && cashRegId && currencyAddress) {
        const connection = new Connection(JSON.parse(endpoint!));
        const { cashBoxTx } = createCashBoxTxBuilder({
          currency: new PublicKey(currencyAddress),
          cashier: cashier.publicKey!,
        });
        const cashBoxTransaction = await cashBoxTx(cashRegId);

        setCashBoxPubKey(cashBoxTransaction.instructions[0].keys[3].pubkey);

        const createCashBoxSignature = await cashier.sendTransaction(
          cashBoxTransaction,
          connection
        );
        setShowAddress(true);
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };
  return (
    <>
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
              label="Currency Token"
              variant="outlined"
              value={currencyAddress}
              onChange={(v) => setCurrencyAddress(v.target.value)}
              size="small"
              required
              error={currencyAddress === ''}
              helperText={
                currencyAddress === '' ? 'Must Required Currency Token' : ' '
              }
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
      </div>
      <div>
        {showAddress ? (
          <>
            <Typography variant="h3" gutterBottom>
              CashBox PublicKey: {JSON.stringify(cashBoxPubKey)}
            </Typography>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

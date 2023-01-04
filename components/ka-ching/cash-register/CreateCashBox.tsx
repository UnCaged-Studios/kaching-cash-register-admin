import { Box, Button, Input, TextField } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useState } from 'react';
import type { FC } from 'react';
import { getLocalStorage } from '../../../utils/localStorageHandle';
import { csvFileToArray } from '../../../utils/csvFileToArray';
import { List } from '../../List';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { SignTransfersForm, Transfer } from '../../SignTransfersForm';
import { cashBoxTxns } from '../../../utils/cashBoxTxns';

export type cashBoxModel = {
  kaChingToken: string;
  mintToken: string;
  amount: string;
  decimal: string;
};

export const CreateCashBox: FC = () => {
  const cashier = useWallet();
  const [file, setFile] = useState();
  const [cashBoxArray, setCashBoxArray] = useState<cashBoxModel[]>([]);
  const [allTransfers, setAllTransfers] = useState<cashBoxModel[]>([]);
  const [transfers, setTransfers] = useState<Transfer[] | undefined>(undefined);
  const [startFrom, setStartFrom] = useState<number | undefined>(undefined);
  const [limit, setLimit] = useState<number | undefined>(undefined);

  const handleOnChange = async (event: any) => {
    try {
      setFile(event.target.files[0]);
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  const handleOnSubmit = async (e: any) => {
    try {
      e.preventDefault();
      const fileReader = new FileReader();
      if (file) {
        fileReader.onload = async (event: any) => {
          const text = event.target.result;
          const array = await csvFileToArray(text);
          if (array!.length > 0) {
            setCashBoxArray(array!);
          }
        };
        fileReader.readAsText(file);
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  const createAndFetchCashBox = async () => {
    try {
      const endpoint = getLocalStorage('endpoint');
      if (endpoint && cashBoxArray.length > 0) {
        const connection = new Connection(JSON.parse(endpoint!));
        const tx = await cashBoxTxns(cashBoxArray, cashier.publicKey!);
        if (tx!.transactionList.instructions.length > 0) {
          await cashier.sendTransaction(tx!.transactionList, connection);
        }
        setAllTransfers(tx!.txArray);
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  const toTransfer = (transfer: cashBoxModel, idx: number): Transfer => {
    if (!cashier.publicKey)
      throw new Error('no publicKey. Is wallet connected?');
    const to = new PublicKey(transfer.kaChingToken);
    const tokenMint = new PublicKey(transfer.mintToken);
    // eslint-disable-next-line no-undef
    const amount = BigInt(
      Number(transfer.amount) * Math.pow(10, Number(transfer.decimal))
    );
    return {
      key: idx + 1,
      sourceAta: getAssociatedTokenAddressSync(tokenMint, cashier.publicKey),
      to,
      toAta: getAssociatedTokenAddressSync(tokenMint, to, true),
      tokenMint,
      amount,
      decimals: parseInt(transfer.decimal),
    };
  };

  const createTransfers = async () => {
    try {
      if (
        startFrom &&
        startFrom > 0 &&
        startFrom <= limit! &&
        limit! <= allTransfers.length &&
        allTransfers
      ) {
        const startFromIdx = Number(startFrom) - 1;
        setTransfers(
          allTransfers
            ?.slice(startFromIdx, startFromIdx + limit!)
            .map(toTransfer)
        );
        if (!transfers) throw new Error('missing transfers');
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  return (
    <div>
      {cashier.connected ? (
        <div style={{ textAlign: 'center' }}>
          <form>
            <Input
              sx={{ m: 1 }}
              type={'file'}
              id={'csvFileInput'}
              onChange={handleOnChange}
              inputProps={{ accept: '.csv' }}
              size="small"
            />
            <Button
              sx={{ m: 1 }}
              variant="contained"
              onClick={(e) => {
                handleOnSubmit(e);
              }}
            >
              IMPORT CSV
            </Button>
          </form>
          <br />
          {cashBoxArray && (
            <span>CSV contains {cashBoxArray.length} transfers</span>
          )}
          <br />
          {cashBoxArray.length > 0 && (
            <Button
              sx={{ m: 1 }}
              variant="contained"
              onClick={() => {
                createAndFetchCashBox();
              }}
            >
              Create & Fetch CashBox
            </Button>
          )}
          {allTransfers.length > 0 && (
            <>
              <List arr={allTransfers} />
              <TextField
                sx={{ m: 1, marginTop: 3 }}
                id="outlined-basic"
                label="Start From"
                variant="outlined"
                value={startFrom}
                onChange={(v) => setStartFrom(Number(v.target.value))}
                size="small"
                required
                error={
                  startFrom === undefined ||
                  startFrom > limit! ||
                  startFrom <= 0
                }
                helperText={
                  startFrom === undefined
                    ? 'Must Required Start From'
                    : startFrom > limit!
                    ? 'The Start is greater than the limit'
                    : startFrom <= 0
                    ? 'The Start cannot be less than or equal to 0'
                    : ' '
                }
                type={'number'}
              />
              <TextField
                sx={{ m: 1, marginTop: 3 }}
                id="outlined-basic"
                label="Limit"
                variant="outlined"
                value={limit}
                onChange={(v) => setLimit(Number(v.target.value))}
                size="small"
                required
                error={
                  limit === undefined ||
                  limit > cashBoxArray.length ||
                  limit < startFrom!
                }
                helperText={
                  limit === undefined
                    ? 'Must Required Limit'
                    : limit! > cashBoxArray.length
                    ? 'The limit is too big'
                    : limit! < startFrom!
                    ? 'The limit is lower than the Start From'
                    : ' '
                }
                type={'number'}
              />
              <Button
                sx={{ m: 1, marginTop: 3 }}
                variant="contained"
                onClick={() => {
                  createTransfers();
                }}
              >
                Transfar to CashBox
              </Button>
            </>
          )}
          {transfers && (
            <Box sx={{ m: 1 }}>
              <SignTransfersForm
                transfers={transfers!}
                cancel={() => setTransfers(undefined)}
              />
            </Box>
          )}
        </div>
      ) : (
        <h1>You are not connected to the wallet</h1>
      )}
    </div>
  );
};

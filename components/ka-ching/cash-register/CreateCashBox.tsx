import { Box, Button, TextField, Typography } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { createContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import { csvFileToArray } from '../../../utils/csvFileToArray';
import { List } from '../../List';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { SignTransfersForm, Transfer } from '../../SignTransfersForm';
import { cashBoxTxns } from '../../../utils/cashBoxTxns';
import { CSVInput } from '../../CSVInput';
import {
  getLocalStorage,
  setLocalStorage,
} from '../../../utils/localStorageHandle';

export type cashBoxModel = {
  kaChingToken: string;
  mintToken: string;
  amount: string;
  decimal: string;
  status: string;
};

export const CashBoxContext = createContext<any>(undefined);

export const CreateCashBox: FC = () => {
  const cashier = useWallet();

  const [file, setFile] = useState<File | undefined>(undefined);
  const [showImportBtn, setShowImportBtn] = useState<boolean>(false);
  const [txStatus, setTxStatus] = useState<string | undefined>(undefined);
  const [allTransfers, setAllTransfers] = useState<cashBoxModel[] | undefined>(
    undefined
  );
  const [transfers, setTransfers] = useState<Transfer[] | undefined>(undefined);
  const [startFrom, setStartFrom] = useState<number>(0);
  const [showSignTxBtn, setShowSignTxBtn] = useState<boolean>(false);

  const resetValues = async () => {
    setFile(undefined);
    setShowImportBtn(false);
    setTxStatus(undefined);
    setAllTransfers(undefined);
    setTransfers(undefined);
    setStartFrom(0);
    setShowSignTxBtn(false);
  };

  const handleOnSubmit = async (e: any) => {
    try {
      const keys = Object.keys(localStorage);
      const found = keys.find((fileName) => fileName === file!.name);
      if (!found) {
        e.preventDefault();
        const fileReader = new FileReader();
        if (file) {
          fileReader.onload = async (event: any) => {
            const csvArr = await csvFileToArray(event.target.result);
            if (csvArr!.length > 0) {
              const txArray = await cashBoxTxns(csvArr!, cashier);
              setAllTransfers(txArray!);
            }
          };
          fileReader.readAsText(file);
        }
      } else {
        const lsTxt: string | null = getLocalStorage(file!.name);
        const txArr: cashBoxModel[] | undefined = await csvFileToArray(lsTxt!);
        setAllTransfers(txArr!);
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
    setShowSignTxBtn(true);
    try {
      if (
        allTransfers &&
        startFrom > 0 &&
        startFrom <= Math.ceil(allTransfers.length / 10)
      ) {
        const startFromIdx = (startFrom - 1) * 10;
        setTransfers(
          allTransfers?.slice(startFromIdx, startFromIdx + 10).map(toTransfer)
        );
        if (!transfers) throw new Error('missing transfers');
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  useEffect(() => {
    const startIdx = (startFrom! - 1) * 10;
    const endIdx = transfers?.length;
    let status;
    if (allTransfers && txStatus) {
      setAllTransfers(
        allTransfers.map((value, idx) => {
          idx >= startIdx && idx < startIdx + endIdx!
            ? (status = txStatus)
            : (status = value.status);
          const newValue: cashBoxModel = {
            kaChingToken: value.kaChingToken,
            mintToken: value.mintToken,
            amount: value.amount,
            decimal: value.decimal,
            status,
          };
          return newValue;
        })
      );
      if (file) {
        const csvStr = [
          ['kaChingToken', 'mintToken', 'amount', 'decimal', 'status'],
          ...allTransfers.map((item) => [
            item.kaChingToken,
            item.mintToken,
            item.amount,
            item.decimal,
            item.status,
          ]),
        ]
          .map((e) => e.join(','))
          .join('\n');
        setLocalStorage(file.name, csvStr);
      }
      setTxStatus(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txStatus]);

  return (
    <div>
      {cashier.connected ? (
        <div style={{ textAlign: 'center' }}>
          <CashBoxContext.Provider
            value={{ setFile, setShowImportBtn, resetValues }}
          >
            <CSVInput />
          </CashBoxContext.Provider>
          {showImportBtn && (
            <Button
              sx={{ m: 1 }}
              variant="contained"
              onClick={(e) => {
                handleOnSubmit(e);
              }}
            >
              Create & Fetch CashBox
            </Button>
          )}
          {allTransfers && allTransfers.length > 0 && (
            <>
              <List arr={allTransfers} />
              <Typography color={'black'}>
                {' '}
                {startFrom > 0 &&
                startFrom <= Math.ceil(allTransfers.length / 10)
                  ? 'Batch No ' +
                    startFrom +
                    ' : from line ' +
                    (startFrom * 10 - 9) +
                    ' to line ' +
                    (startFrom * 10 > allTransfers.length
                      ? allTransfers.length
                      : startFrom * 10)
                  : ''}
              </Typography>
              <br />
              <TextField
                id="outlined-basic"
                label="Choose Batch"
                variant="outlined"
                value={startFrom}
                onChange={(v) => {
                  setShowSignTxBtn(false);
                  setStartFrom(Number(v.target.value));
                }}
                size="small"
                required
                error={
                  startFrom === undefined ||
                  startFrom > Math.ceil(allTransfers.length / 10) ||
                  startFrom <= 0
                }
                helperText={
                  startFrom === undefined || startFrom === 0
                    ? 'Must Choose Batch'
                    : startFrom > Math.ceil(allTransfers.length / 10)
                    ? 'The Batch you selected does not exist'
                    : startFrom < 0
                    ? 'The Batch you selected does not exist'
                    : ' '
                }
                type={'number'}
              />
              <Button
                sx={{ marginLeft: '10px' }}
                variant="contained"
                onClick={() => {
                  createTransfers();
                }}
              >
                Transfar to CashBox
              </Button>
              <br />
            </>
          )}
          {transfers && showSignTxBtn && (
            <Box sx={{ m: 1 }}>
              <CashBoxContext.Provider value={{ setTxStatus }}>
                <SignTransfersForm
                  transfers={transfers!}
                  cancel={() => setTransfers(undefined)}
                />
              </CashBoxContext.Provider>
            </Box>
          )}
        </div>
      ) : (
        <h1>You are not connected to the wallet</h1>
      )}
    </div>
  );
};

import { Box, Button, TextField, Typography } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { createContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import { csvFileToArray } from '../../../utils/csvFileToArray';
import { List } from '../../List';
import { cashBoxTxns } from '../../../utils/cashBoxTxns';
import { CSVInput } from '../../CSVInput';
import {
  getLocalStorage,
  setLocalStorage,
} from '../../../utils/localStorageHandle';
import { CsvDataService } from '../../../utils/csv-data.service';
import { SignTransfersForm, Transfer } from '../../SignTransfersForm';
import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';

export type cashBoxModel = {
  cashBoxAddress: string;
  mintAddress: string;
  amount: string;
  decimal: string;
  status?: string;
};

export type cashRegisterModel = {
  cashRegisterID: string;
  mintAddress: string;
  amount: string;
  decimal: string;
};

export const CashBoxContext = createContext<any>(undefined);

export const CreateCashBox: FC = () => {
  const cashier = useWallet();

  const [showPartOne, setShowPartOne] = useState<boolean>(true);
  const [showPartTwo, setShowPartTwo] = useState<boolean>(false);
  const [showPartThree, setShowPartThree] = useState<boolean>(false);
  const [showPartFour, setShowPartThreeFour] = useState<boolean>(false);

  const [file, setFile] = useState<File | undefined>(undefined);

  const [csvArr, setCsvArr] = useState<cashRegisterModel[] | undefined>(
    undefined
  );
  const [allTransfers, setAllTransfers] = useState<cashBoxModel[] | undefined>(
    undefined
  );

  const [startFrom, setStartFrom] = useState<number>(0);
  const [transfers, setTransfers] = useState<Transfer[] | undefined>(undefined);
  const [txStatus, setTxStatus] = useState<string | undefined>(undefined);

  const resetValues = async () => {
    setShowPartOne(true);
    setShowPartTwo(false);
    setShowPartThree(false);
    setShowPartThreeFour(false);
    setFile(undefined);
    setCsvArr(undefined);
    setAllTransfers(undefined);
    setStartFrom(0);
    setTransfers(undefined);
    setTxStatus(undefined);
  };

  const handleOnSubmit = async () => {
    try {
      const keys = Object.keys(localStorage); // Find all the keys in the local storage
      const found = keys.find((fileName) => fileName === file!.name); // Searching the keys for a file name
      if (!found) {
        // Since the file does not exist, pull the details from the new one
        if (csvArr!.length > 0) {
          const txArray: cashBoxModel[] | undefined = await cashBoxTxns(
            csvArr!,
            cashier
          );
          setAllTransfers(txArray);
          setShowPartTwo(false);
          setShowPartThree(true);
        }
      } else {
        // Since the file exists in the local storage, we'll use the old file
        const lsTxt: string | null = getLocalStorage(file!.name);
        const txArray: cashBoxModel[] | undefined = await csvFileToArray(
          lsTxt!
        );
        setAllTransfers(txArray);
        setShowPartTwo(false);
        setShowPartThree(true);
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  const createTransfers = async () => {
    setShowPartThreeFour(true);
    try {
      if (
        allTransfers &&
        startFrom > 0 &&
        startFrom <= Math.ceil(allTransfers.length / 6)
      ) {
        // Split allTransfers into batch og 6 and transfer them to CashBox
        const startFromIdx = (startFrom - 1) * 6;
        setTransfers(
          allTransfers?.slice(startFromIdx, startFromIdx + 6).map(toTransfer)
        );
        if (!transfers) throw new Error('missing transfers');
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  const toTransfer = (transfer: cashBoxModel, idx: number): Transfer => {
    if (!cashier.publicKey)
      throw new Error('no publicKey. Is wallet connected?');
    const to = new PublicKey(transfer.cashBoxAddress);
    const tokenMint = new PublicKey(transfer.mintAddress);
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

  useEffect(() => {
    const startIdx = (startFrom! - 1) * 6;
    const endIdx = transfers?.length;
    let status;
    if (allTransfers && txStatus) {
      // Update the status for each transaction in the batch
      setAllTransfers(
        allTransfers.map((value, idx) => {
          idx >= startIdx && idx < startIdx + endIdx!
            ? (status = txStatus)
            : (status = value.status);
          const newValue: cashBoxModel = {
            cashBoxAddress: value.cashBoxAddress,
            mintAddress: value.mintAddress,
            amount: value.amount,
            decimal: value.decimal,
            status,
          };
          return newValue;
        })
      );
      if (file) {
        // Upload the file to local storage
        const csvStr = [
          ['cashBoxAddress', 'mintAddress', 'amount', 'decimal', 'status'],
          ...allTransfers.map((item) => [
            item.cashBoxAddress,
            item.mintAddress,
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
          {showPartOne && (
            <>
              {/* Part One - Import CSV + Download CSV Template */}
              <CashBoxContext.Provider
                value={{
                  setFile,
                  setCsvArr,
                  setShowPartOne,
                  setShowPartTwo,
                  resetValues,
                }}
              >
                <CSVInput />
              </CashBoxContext.Provider>
            </>
          )}

          {showPartTwo && csvArr && (
            <>
              {/* Part Two - Show CSV + Create CB btn */}
              <List arr={csvArr} />
              <Button
                sx={{ m: 1 }}
                variant="contained"
                onClick={() => {
                  handleOnSubmit();
                }}
              >
                Create CashBox
              </Button>
            </>
          )}

          {showPartThree && allTransfers && (
            <>
              {/* Part Three - Show CB List + Download CB List btn + Batch selection + CB Transfer btn */}
              <List arr={allTransfers!} />
              <Button
                variant="contained"
                onClick={() => {
                  CsvDataService.exportToCsv('cb_list.csv', allTransfers!);
                }}
              >
                download cashbox csv file
              </Button>
              <Typography sx={{ m: 1 }} color={'black'}>
                {startFrom > 0 &&
                startFrom <= Math.ceil(allTransfers.length / 6)
                  ? 'Batch No ' +
                    startFrom +
                    ' : from line ' +
                    (startFrom * 6 - 5) +
                    ' to line ' +
                    (startFrom * 6 > allTransfers.length
                      ? allTransfers.length
                      : startFrom * 6)
                  : ''}
              </Typography>
              <div style={{ margin: 15 }}>
                <TextField
                  id="outlined-basic"
                  label="Choose Batch"
                  variant="outlined"
                  value={startFrom}
                  onChange={(v) => {
                    setShowPartThreeFour(false);
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
                  Transfer to CashBox
                </Button>
              </div>
            </>
          )}
          {showPartFour && transfers && (
            <>
              {/* Part Four - Show Transfer Loading Status + IF Success -> show TX Signature, ELSE -> show Error Message */}
              <Box sx={{ m: 1 }}>
                <CashBoxContext.Provider value={{ setTxStatus }}>
                  <SignTransfersForm
                    transfers={transfers!}
                    cancel={() => setTransfers(undefined)}
                  />
                </CashBoxContext.Provider>
              </Box>
            </>
          )}
        </div>
      ) : (
        <h1>You are not connected to the wallet</h1>
      )}
    </div>
  );
};

import { useState } from 'react';
import type { FC } from 'react';
import {
  fetchAllKaChingCashRegisters,
  KachingCashRegisterModel,
} from '../../../utils/sdk';
import { Connection } from '@solana/web3.js';
import { getLocalStorage } from '../../../utils/localStorageHandle';
import { Button } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { List } from '../../List';

export const CashRegisterList: FC = () => {
  const [kaChingData, setKaChindData] = useState<KachingCashRegisterModel[]>(
    []
  );
  const cashier = useWallet();

  const getAllKaChingCashRegisters = async (filter: boolean) => {
    try {
      const endpoint = getLocalStorage('endpoint');
      if (endpoint) {
        const connection = new Connection(JSON.parse(endpoint));
        const kaChingCashRegisters = await fetchAllKaChingCashRegisters(
          connection
        );
        if (filter) {
          const filterKaChingCashRegisters: KachingCashRegisterModel[] =
            kaChingCashRegisters.reduce(
              (
                filtered: KachingCashRegisterModel[],
                val: KachingCashRegisterModel
              ) => {
                if (
                  val.cashierPublicKey.toString() ===
                  cashier.publicKey?.toString()
                ) {
                  const newValue: KachingCashRegisterModel = {
                    address: val.address,
                    cashRegisterId: val.cashRegisterId,
                    cashierPublicKey: val.cashierPublicKey,
                    orderSignersWhitelist: val.orderSignersWhitelist,
                  };
                  filtered.push(newValue);
                }
                return filtered;
              },
              []
            );
          setKaChindData(filterKaChingCashRegisters);
        } else {
          setKaChindData(kaChingCashRegisters);
        }
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };
  const [displayForm, setDisplayForm] = useState(false);
  return (
    <div>
      {cashier.connected ? (
        <>
          <Button
            sx={{ m: 1 }}
            variant="contained"
            onClick={() => {
              setDisplayForm(true);
              getAllKaChingCashRegisters(false);
            }}
          >
            Fetch All CashRegisters
          </Button>
          <Button
            sx={{ m: 1 }}
            variant="contained"
            onClick={() => {
              setDisplayForm(true);
              getAllKaChingCashRegisters(true);
            }}
          >
            Fetch All CashRegisters By Cashier
          </Button>
          {displayForm && <List arr={kaChingData} />}
        </>
      ) : (
        <h1>You are not connected to the wallet</h1>
      )}
    </div>
  );
};

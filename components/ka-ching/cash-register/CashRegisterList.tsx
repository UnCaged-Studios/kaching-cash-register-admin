import { useState } from 'react';
import type { FC } from 'react';
import {
  fetchAllKaChingCashRegisters,
  KachingCashRegisterModel,
} from '../../../utils/sdk';
import { Connection } from '@solana/web3.js';
import { getLocalStorage } from '../../../utils/localStorageHandle';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';

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
          {displayForm && (
            <div style={{ margin: '0.5rem' }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      {Object.keys(Object.assign({}, ...kaChingData)).map(
                        (val, id) => (
                          <TableCell
                            key={id}
                            sx={{
                              maxWidth: 30,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {val.toString().charAt(0).toUpperCase() +
                              val.slice(1)}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {kaChingData?.map((item, idx) => (
                      <TableRow
                        key={idx}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        {Object.values(item).map((val: any, id) => (
                          <TableCell
                            key={id}
                            sx={{
                              maxWidth: 30,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {val.toString()}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </>
      ) : (
        <h1>You are not connected to the wallet</h1>
      )}
    </div>
  );
};

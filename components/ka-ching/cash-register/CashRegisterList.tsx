import { FC, useState } from 'react';
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

export const CashRegisterList: FC = () => {
  const [kaChingData, setKaChindData] = useState<KachingCashRegisterModel[]>(
    []
  );

  const getAllKaChingCashRegisters = async () => {
    try {
      const endpoint = getLocalStorage('endpoint');
      if (endpoint) {
        const connection = new Connection(JSON.parse(endpoint));
        const kaChingCashRegisters = await fetchAllKaChingCashRegisters(
          connection
        );
        setKaChindData(kaChingCashRegisters);
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  const [displayForm, setDisplayForm] = useState(false);
  return (
    <>
      <Button
        sx={{ m: 1 }}
        variant="contained"
        onClick={() => {
          setDisplayForm(true);
          getAllKaChingCashRegisters();
        }}
      >
        Create List
      </Button>
      {displayForm && (
        <div style={{ margin: '0.5rem' }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell>CashRegisterId</TableCell>
                  <TableCell>CashierPublicKey</TableCell>
                  <TableCell>OrderSignersWhitelist</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {kaChingData?.map((item, idx) => (
                  <TableRow
                    key={idx}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
  );
};

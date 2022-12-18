import { FC, useState } from 'react';
import {
  fetchAllKaChingCashRegisters,
  KachingCashRegisterModel,
} from '../../../utils/sdk';
import { Connection } from '@solana/web3.js';
import { getLocalStorage } from '../../../utils/Get';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

export const List: FC = () => {
  const [kaChingData, setKaChindData] = useState<KachingCashRegisterModel[]>(
    []
  );

  const getAllKaChingCashRegisters = async () => {
    const endpoint = getLocalStorage('endpoint');
    if (endpoint !== null) {
      const connection = new Connection(JSON.parse(endpoint));
      const kaChingCashRegisters = await fetchAllKaChingCashRegisters(
        connection
      );
      setKaChindData(kaChingCashRegisters);
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
        Show List
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
                {kaChingData &&
                  kaChingData.map((val, idx) => (
                    <TableRow
                      key={idx}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{val.address.toString()}</TableCell>
                      <TableCell>{val.cashRegisterId}</TableCell>
                      <TableCell>{val.cashierPublicKey.toString()}</TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 30,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {val.orderSignersWhitelist.toString()}
                      </TableCell>
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

import { FC, useState } from 'react';
import {
  fetchAllKaChingCashRegisters,
  KachingCashRegisterModel,
} from '../../../utils/sdk';
import { Connection } from '@solana/web3.js';
import { getLocalStorage } from '../../../utils/Get';

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
      <button
        onClick={() => {
          setDisplayForm(true);
          getAllKaChingCashRegisters();
        }}
      >
        Show List
      </button>
      {displayForm && (
        <table>
          <thead>
            <tr>
              <th>Address</th>
              <th>CashRegisterId</th>
              <th>CashierPublicKey</th>
              <th>OrderSignersWhitelist</th>
            </tr>
          </thead>
          <tbody>
            {kaChingData &&
              kaChingData.map((val, idx) => (
                <tr key={idx}>
                  <td>{val.address.toString()}</td>
                  <td>{val.cashRegisterId}</td>
                  <td>{val.cashierPublicKey.toString()}</td>
                  <td>{val.orderSignersWhitelist.toString()}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </>
  );
};

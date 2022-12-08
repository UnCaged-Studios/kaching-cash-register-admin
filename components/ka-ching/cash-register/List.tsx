import { useConnection } from '@solana/wallet-adapter-react';
import { FC, useEffect, useState } from 'react';
import {
  fetchAllKaChingCashRegisters,
  KachingCashRegisterModel,
} from '../../../utils/sdk';

export const List: FC = () => {
  const { connection } = useConnection();
  const [kaChingData, setKaChindData] = useState<KachingCashRegisterModel[]>(
    []
  );

  const getAllKaChingCashRegisters = async () => {
    const kaChingCashRegisters = await fetchAllKaChingCashRegisters(connection);
    console.log(kaChingCashRegisters);
    setKaChindData(kaChingCashRegisters);
  };

  useEffect(() => {
    getAllKaChingCashRegisters();
  }, []);

  return (
    <>
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
    </>
  );
};

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
          <tr>
            {kaChingData &&
              kaChingData.map((val, idx) => (
                <>
                  <td key={idx} className="border border-slate-700">
                    {val.address.toString()}
                  </td>
                  <td key={idx}>{val.cashRegisterId}</td>
                  <td key={idx}>{val.cashierPublicKey.toString()}</td>
                  <td key={idx}>{val.orderSignersWhitelist.toString()}</td>
                </>
              ))}
          </tr>
          <tr>
            <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
            <td>Malcolm Lockyer</td>
            <td>1961</td>
          </tr>
          <tr>
            <td>Witchy Woman</td>
            <td>The Eagles</td>
            <td>1972</td>
          </tr>
          <tr>
            <td>Shining Star</td>
            <td>Earth, Wind, and Fire</td>
            <td>1975</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

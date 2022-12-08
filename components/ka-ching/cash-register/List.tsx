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
      {kaChingData &&
        kaChingData.map((val, idx) => (
          <>
            <br></br>
            <p key={idx}>{val.address.toString()}</p>
            <p key={idx}>{val.cashRegisterId}</p>
            <p key={idx}>{val.cashierPublicKey.toString()}</p>
            <p key={idx}>{val.orderSignersWhitelist.toString()}</p>
          </>
        ))}
    </>
  );
};

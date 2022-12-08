import { Connection, PublicKey } from '@solana/web3.js';
import { KachingCashRegister } from '@uncaged-studios/solana-program-library-sdk';

export type KachingCashRegisterModel = {
  address: PublicKey;
  cashRegisterId: string;
  cashierPublicKey: PublicKey;
  orderSignersWhitelist: PublicKey[];
};

export const PROGRAM_ADDRESS =
  KachingCashRegister.KachingProgramIDL.metadata.address;

export const fetchAllKaChingCashRegisters = async (
  connection: Connection
): Promise<Array<KachingCashRegisterModel>> => {
  const accounts = await connection.getProgramAccounts(
    new PublicKey(PROGRAM_ADDRESS),
    {
      filters: [
        {
          dataSize: 8 + 225, // number of bytes
        },
      ],
    }
  );

  return accounts.map((acc) => {
    const { cashRegisterId, cashierPublicKey, orderSignersWhitelist } =
      KachingCashRegister.utils.deserializeCashRegisterAccountData(
        acc.account.data
      );
    return {
      address: acc.pubkey,
      cashRegisterId,
      cashierPublicKey,
      orderSignersWhitelist,
    };
  });
};

import {
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
} from '@solana/web3.js';
import { KachingCashRegister } from '@uncaged-studios/solana-program-library-sdk';
import * as anchor from '@project-serum/anchor';

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

function createAdminSDK() {
  const { KachingProgramIDL } = KachingCashRegister;
  const programAPI = new anchor.Program(
    KachingProgramIDL as any,
    new PublicKey(KachingProgramIDL.metadata.address),
    {
      publicKey: Keypair.generate().publicKey,
    } as any
  ).methods;
  return KachingCashRegister.createAdminSDKv1(programAPI);
}

const adminSDK = createAdminSDK();

export const createCashRegisterTxBuilder = ({
  cashier,
  targetAccount,
}: {
  cashier: PublicKey;
  targetAccount: PublicKey;
}) => {
  const { createAccountParams, cashRegisterInitParams } =
    adminSDK.CreateConsumedOrdersAccount.createParams();
  return {
    consumedOrdersTx: () => {
      const createConsumedOrdersAccountIx =
        adminSDK.CreateConsumedOrdersAccount.createTx(
          cashier,
          targetAccount,
          LAMPORTS_PER_SOL * 0.63, // 0.62670624 is Rent-exempt minimum for 89916 bytes
          createAccountParams
        );
      return new Transaction().add(createConsumedOrdersAccountIx);
    },
    cashRegisterTx: (cashRegisterId: string) => {
      return adminSDK.CreateCashRegister.createTx({
        cashier,
        cashRegisterId,
        consumedOrders: {
          account: targetAccount,
          ...cashRegisterInitParams,
        },
        orderSignersWhitelist: [],
      });
    },
  };
};

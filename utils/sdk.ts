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

function createOrderSignerSDK() {
  return KachingCashRegister.createOrderSignerSDKv1();
}

function createCustomerSDK() {
  const { KachingProgramIDL } = KachingCashRegister;
  const programAPI = new anchor.Program(
    KachingProgramIDL as any,
    new PublicKey(KachingProgramIDL.metadata.address),
    {
      publicKey: Keypair.generate().publicKey,
    } as any
  ).methods;
  return KachingCashRegister.createCustomerSDKv1(programAPI);
}

const adminSDK = createAdminSDK();

export const orderSignerSDK = createOrderSignerSDK();

export const customerSDK = createCustomerSDK();

export const createCashRegisterTxBuilder = ({
  cashier,
  consumedOrdersAccount,
  orderSignersWhitelist,
}: {
  cashier: PublicKey;
  consumedOrdersAccount: PublicKey;
  orderSignersWhitelist: Array<PublicKey>;
}) => {
  const { createAccountParams, cashRegisterInitParams } =
    adminSDK.CreateConsumedOrdersAccount.createParams();
  return {
    consumedOrdersTx: () => {
      const createConsumedOrdersAccountIx =
        adminSDK.CreateConsumedOrdersAccount.createTx(
          cashier,
          consumedOrdersAccount,
          LAMPORTS_PER_SOL * 0.63, // 0.62670624 is Rent-exempt minimum for 89916 bytes
          createAccountParams
        );
      return new Transaction().add(createConsumedOrdersAccountIx);
    },
    cashRegisterTx: (cashRegisterId: string) => {
      return adminSDK.CreateCashRegister.createTx({
        cashier,
        cashRegisterId,
        orderSignersWhitelist,
        consumedOrders: {
          account: consumedOrdersAccount,
          ...cashRegisterInitParams,
        },
      });
    },
  };
};

export const createCashBoxTxBuilder = ({
  currency,
  cashier,
}: {
  currency: PublicKey;
  cashier: PublicKey;
}) => {
  return {
    cashBoxTx: (cashRegisterId: string) => {
      return adminSDK.CreateTokenCashbox.createTx({
        cashRegisterId,
        currency,
        cashier,
      });
    },
  };
};

export const updateOrderSignersWhitelistTxBuilder = ({
  cashier,
}: {
  cashier: PublicKey;
}) => {
  return {
    updateOrderSignersWhitelistTx: (
      cashRegisterId: string,
      orderSignersWhitelist: Array<PublicKey>,
      updateType: 'merge' | 'override'
    ) => {
      return adminSDK.UpdateOrderSignersWhitelist.createTx({
        cashRegisterId,
        cashier,
        orderSignersWhitelist,
        updateType,
      });
    },
  };
};

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

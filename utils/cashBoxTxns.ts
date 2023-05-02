import { WalletContextState } from '@solana/wallet-adapter-react';
import { PublicKey, Connection, Transaction } from '@solana/web3.js';
import { findTokenCashboxPDA } from '@uncaged-studios/solana-program-library-sdk/dist/sdk/ts/ka-ching/v1/create-token-cashbox';
import {
  cashBoxModel,
  cashRegisterModel,
} from '../components/ka-ching/cash-register/CreateCashBox';
import { getLocalStorage } from './localStorageHandle';
import { createCashBoxTxBuilder } from './sdk';

export const cashBoxTxns = async (
  cashBoxArray: cashRegisterModel[],
  cashier: WalletContextState
) => {
  const endpoint = getLocalStorage('endpoint');
  if (endpoint && cashBoxArray.length > 0) {
    const connection = new Connection(JSON.parse(endpoint!));
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    let transactionList = new Transaction({
      blockhash: blockhash,
      lastValidBlockHeight,
      feePayer: cashier.publicKey,
    });
    const txArray = await Promise.all(
      cashBoxArray.map(
        async ({ cashRegisterID, mintAddress, amount, decimal }, idx) => {
          let cashBoxAddress;
          const [tokenCashboxPDA] = await findTokenCashboxPDA(
            cashRegisterID,
            new PublicKey(mintAddress)
          );
          const tokenCashboxAccount = await connection.getAccountInfo(
            tokenCashboxPDA
          );
          if (tokenCashboxAccount === null) {
            const { cashBoxTx } = createCashBoxTxBuilder({
              currency: new PublicKey(mintAddress),
              cashier: cashier.publicKey!,
            });
            const cashBoxTransaction = await cashBoxTx(cashRegisterID);
            cashBoxAddress =
              cashBoxTransaction.instructions[0].keys[3].pubkey.toString();
            transactionList.add(cashBoxTransaction);
          } else {
            cashBoxAddress = tokenCashboxPDA.toString();
          }
          const newValue: cashBoxModel = {
            cashBoxAddress,
            mintAddress,
            amount,
            decimal,
            status: 'WAITING',
          };
          if (
            transactionList.instructions.length > 0 &&
            (idx + 1 === cashBoxArray.length ||
              transactionList.instructions.length / 6 === 1)
          ) {
            await cashier.sendTransaction(transactionList, connection);
            transactionList = new Transaction({
              blockhash: blockhash,
              lastValidBlockHeight,
              feePayer: cashier.publicKey,
            });
          }
          return newValue;
        }
      )
    );
    return txArray;
  }
};

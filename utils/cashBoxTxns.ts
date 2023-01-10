import { WalletContextState } from '@solana/wallet-adapter-react';
import { PublicKey, Connection, Transaction } from '@solana/web3.js';
import { findTokenCashboxPDA } from '@uncaged-studios/solana-program-library-sdk/dist/sdk/ts/ka-ching/v1/create-token-cashbox';
import { cashBoxModel } from '../components/ka-ching/cash-register/CreateCashBox';
import { getLocalStorage } from './localStorageHandle';
import { createCashBoxTxBuilder } from './sdk';

export const cashBoxTxns = async (
  cashBoxArray: cashBoxModel[],
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
    let count = 0;
    const txArray = await Promise.all(
      cashBoxArray.map(
        async ({ kaChingToken, mintToken, amount, decimal, status }) => {
          let cashRegistrId: string = '';
          const [tokenCashboxPDA] = await findTokenCashboxPDA(
            kaChingToken,
            new PublicKey(mintToken)
          );
          const tokenCashboxAccount = await connection.getAccountInfo(
            tokenCashboxPDA
          );
          if (tokenCashboxAccount === null) {
            const { cashBoxTx } = createCashBoxTxBuilder({
              currency: new PublicKey(mintToken),
              cashier: cashier.publicKey!,
            });
            const cashBoxTransaction = await cashBoxTx(kaChingToken);
            cashRegistrId =
              cashBoxTransaction.instructions[0].keys[3].pubkey.toString();
            transactionList.add(cashBoxTransaction);
          } else {
            cashRegistrId = tokenCashboxPDA.toString();
          }
          const newValue: cashBoxModel = {
            kaChingToken: cashRegistrId,
            mintToken,
            amount,
            decimal,
            status: 'WATING',
          };
          count++;
          if (
            transactionList.instructions.length > 0 &&
            (count === cashBoxArray.length || count / 10 === 1)
          ) {
            await cashier.sendTransaction(transactionList, connection);
            transactionList = new Transaction({
              blockhash: blockhash,
              lastValidBlockHeight,
              feePayer: cashier.publicKey,
            });
            count = 0;
          }
          return newValue;
        }
      )
    );
    return txArray;
  }
};

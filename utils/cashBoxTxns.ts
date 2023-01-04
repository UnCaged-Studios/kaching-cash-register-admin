import { PublicKey, Connection, Transaction } from '@solana/web3.js';
import { findTokenCashboxPDA } from '@uncaged-studios/solana-program-library-sdk/dist/sdk/ts/ka-ching/v1/create-token-cashbox';
import { cashBoxModel } from '../components/ka-ching/cash-register/CreateCashBox';
import { getLocalStorage } from './localStorageHandle';
import { createCashBoxTxBuilder } from './sdk';

export const cashBoxTxns = async (
  cashBoxArray: cashBoxModel[],
  publicKey: PublicKey
) => {
  const endpoint = getLocalStorage('endpoint');
  if (endpoint && cashBoxArray.length > 0) {
    const connection = new Connection(JSON.parse(endpoint!));
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    const transactionList = new Transaction({
      blockhash: blockhash,
      lastValidBlockHeight,
      feePayer: publicKey,
    });
    const txArray = await Promise.all(
      cashBoxArray.map(async ({ kaChingToken, mintToken, amount, decimal }) => {
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
            cashier: publicKey,
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
        };
        return newValue;
      })
    );
    return { txArray, transactionList };
  }
};

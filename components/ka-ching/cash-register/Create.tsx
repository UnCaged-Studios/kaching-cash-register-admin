import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Connection, Keypair } from '@solana/web3.js';
import { FC, useState } from 'react';
import { createCashRegisterTxBuilder } from '../../../utils/sdk';
import { useForm } from 'react-hook-form';
import { getLocalStorage } from '../../../utils/localStorageHandle';

export const Create: FC = () => {
  const { publicKey: cashier, sendTransaction } = useWallet();
  const endpoint = getLocalStorage('endpoint');

  const [displayForm, setDisplayForm] = useState(false);
  console.log('endpoint: ', endpoint);

  const { register, handleSubmit } = useForm();
  const [cashRegisterId, setCashRegisterId] = useState('');

  const createCashReg = async (cashRegisterId: string) => {
    const connection = new Connection(JSON.parse(endpoint));
    try {
      if (cashier && connection) {
        console.log('cashier: ', cashier);
        console.log('cashRegisterId: ', cashRegisterId);

        const consumedOrders = await Keypair.generate();
        console.log('consumedOrders: ', consumedOrders);
        const { consumedOrdersTx, cashRegisterTx } =
          createCashRegisterTxBuilder({
            cashier: cashier!,
            targetAccount: consumedOrders.publicKey,
          });
        console.log('consumedOrdersTx:', consumedOrdersTx);
        console.log('cashRegisterTx: ', cashRegisterTx);
        const tx = await cashRegisterTx(cashRegisterId);
        const createCashRegisterSignature = await sendTransaction(
          tx,
          connection
        );
        console.log(
          'createCashRegisterSignature: ',
          createCashRegisterSignature
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {cashier && (
        <>
          {!displayForm && (
            <button onClick={() => setDisplayForm(true)}>Create</button>
          )}
          {displayForm && (
            <form
              onSubmit={handleSubmit((cashRegisterId: any) => {
                setCashRegisterId(cashRegisterId);
                createCashReg(cashRegisterId.name);
              })}
            >
              <input
                {...register('name', { required: true })}
                placeholder="NFT Name"
              />
              <input type="submit" />
            </form>
          )}
        </>
      )}
    </>
  );
};

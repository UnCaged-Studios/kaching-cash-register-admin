import { WalletProviderProps } from '@solana/wallet-adapter-react';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useMemo, useState } from 'react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { useForm } from 'react-hook-form';
import('@solana/wallet-adapter-react-ui/styles.css' as any);
import styles from '../../styles/Home.module.css';

export function ClientWalletProvider(
  props: Omit<WalletProviderProps, 'wallets'>
): JSX.Element {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <>
      <WalletProvider wallets={wallets} {...props} autoConnect>
        <WalletModalProvider {...props} />
      </WalletProvider>
    </>
  );
}

export default ClientWalletProvider;

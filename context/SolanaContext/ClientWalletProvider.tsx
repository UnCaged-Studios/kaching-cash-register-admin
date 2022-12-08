import { WalletProviderProps } from '@solana/wallet-adapter-react';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useMemo } from 'react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import('@solana/wallet-adapter-react-ui/styles.css' as any);

export function ClientWalletProvider(
  props: Omit<WalletProviderProps, 'wallets'>
): JSX.Element {
  const endpoint =
    'https://crimson-restless-brook.solana-mainnet.quiknode.pro/5ea32f4b6d9893dfef137d7b0b4951dcd21abfdb/';
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} {...props}>
        <WalletModalProvider {...props} />
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default ClientWalletProvider;

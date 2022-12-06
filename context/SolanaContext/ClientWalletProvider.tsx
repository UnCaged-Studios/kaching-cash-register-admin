import { WalletProviderProps } from '@solana/wallet-adapter-react';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useMemo, useState } from 'react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

import('@solana/wallet-adapter-react-ui/styles.css' as any);

import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider } from '@solana/wallet-adapter-react';

export function ClientWalletProvider(
  props: Omit<WalletProviderProps, 'wallets'>
): JSX.Element {
  const [network] = useState(WalletAdapterNetwork.Devnet);
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
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

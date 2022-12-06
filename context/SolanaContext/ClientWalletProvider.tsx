import {
  useConnection,
  WalletProviderProps,
} from '@solana/wallet-adapter-react';
import { WalletProvider } from '@solana/wallet-adapter-react';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { useMemo } from 'react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

import('@solana/wallet-adapter-react-ui/styles.css' as any);

export function ClientWalletProvider(
  props: Omit<WalletProviderProps, 'wallets'>
): JSX.Element {
  const network = useConnection();

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      // new SolflareWalletAdapter({ network }),
    ],
    []
  );

  return (
    <WalletProvider wallets={wallets} {...props}>
      <WalletModalProvider {...props} />
    </WalletProvider>
  );
}

export default ClientWalletProvider;

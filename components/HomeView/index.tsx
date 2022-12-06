import { FC } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import styles from '../../styles/Home.module.css';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo, useState } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

const WalletProvider = dynamic(
  () => import('../../context/SolanaContext/ClientWalletProvider'),
  {
    ssr: false,
  }
);

export const HomeView: FC = () => {
  const [network] = useState(WalletAdapterNetwork.Devnet);
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider>
          <h1>KaChing Cash Register Admin Panel</h1>
          <section id="dashboard">
            <header>
              {'header'}
              <div className={styles.alignRight}>
                <WalletMultiButton />
              </div>
            </header>
            <nav>{'sidebar navigation'}</nav>
            <main>
              {'main content'}
              <p></p>
            </main>
          </section>
          <footer className={styles.footer}>Powered by UnCaged Studios</footer>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
};

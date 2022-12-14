import { FC } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import styles from '../../styles/Home.module.css';
import dynamic from 'next/dynamic';
import { List } from '../ka-ching/cash-register/List';
import { ConnectionEndpoint } from '../../context/ConnectionEndpoint';

const WalletProvider = dynamic(
  () => import('../../context/SolanaContext/ClientWalletProvider'),
  {
    ssr: false,
  }
);

export const HomeView: FC = () => {
  return (
    <>
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
            <div>
              <ConnectionEndpoint />
            </div>
            <List />
          </main>
        </section>
        <footer className={styles.footer}>Powered by UnCaged Studios</footer>
      </WalletProvider>
    </>
  );
};

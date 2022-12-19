import { FC } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import styles from '../../styles/Home.module.css';
import dynamic from 'next/dynamic';
import { List } from '../ka-ching/cash-register/List';
import { EndpointSettings } from '../EndpointSettings';
import { Create } from '../ka-ching/cash-register/Create';

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
              <EndpointSettings />
            </div>
            <List />
            {/* <Create /> */}
          </main>
        </section>
        <footer className={styles.footer}>Powered by UnCaged Studios</footer>
      </WalletProvider>
    </>
  );
};

import { FC } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
//import styles from './index.module.css';
import styles from '../../styles/Home.module.css';

export const HomeView: FC = ({}) => {
  const { publicKey } = useWallet();
  const endpoint = useConnection();

  return (
    <>
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
          <p>{publicKey ? <>Your address: {publicKey.toBase58()}</> : null}</p>
        </main>
      </section>
      <footer className={styles.footer}>Powered by UnCaged Studios</footer>
    </>
  );
};

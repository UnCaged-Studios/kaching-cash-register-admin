import Head from 'next/head';
import { HomeView } from '../routing/index';
import dynamic from 'next/dynamic';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo, useState } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

const WalletProvider = dynamic(
  () => import('../context/SolanaContext/ClientWalletProvider'),
  {
    ssr: false,
  }
);

export default function Home() {
  const [network, setNetwork] = useState(WalletAdapterNetwork.Devnet);
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <div>
      <Head>
        <title>KaChing Cash Register Admin Panel</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider>
          <HomeView />
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}

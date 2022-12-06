import Head from 'next/head';
import { HomeView } from '../routing/index';

export default function Home() {
  return (
    <div>
      <Head>
        <title>KaChing Cash Register Admin Panel</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomeView />
    </div>
  );
}

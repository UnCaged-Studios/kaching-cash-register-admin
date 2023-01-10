import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Layout } from '../components/main_components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

import dynamic from 'next/dynamic';
import { TopHead } from './TopHead';
import { Logo } from './Logo';
import { Header } from './Header';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();


const WalletProvider = dynamic(
  () => import('../context/SolanaContext/ClientWalletProvider'),
  {
    ssr: false,
  }
);

export const Layout = ({ children }: any) => {
  return (
    <div className="content">
      <TopHead />
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <Logo />
          <section id="dashboard">
            <Header />
            <Navbar />
            <main> {children}</main>
          </section>
          <Footer />
        </WalletProvider>
      </QueryClientProvider>
    </div>
  );
};

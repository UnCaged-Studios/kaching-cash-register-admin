import dynamic from 'next/dynamic';
import { TopHead } from './TopHead';
import { Logo } from './Logo';
import { Header } from './Header';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

const WalletProvider = dynamic(
  () => import('../context/SolanaContext/ClientWalletProvider'),
  {
    ssr: false,
  }
);

export const Layout = ({ children }: any) => {
  return (
    <>
      <div className="content">
        <TopHead />
        <WalletProvider>
          <Logo />
          <section id="dashboard">
            <Header />
            <Navbar />
            <main> {children}</main>
          </section>
          <Footer />
        </WalletProvider>
      </div>
    </>
  );
};

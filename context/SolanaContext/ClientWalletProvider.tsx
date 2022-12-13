import { WalletProviderProps } from '@solana/wallet-adapter-react';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useMemo, useState } from 'react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { useForm } from 'react-hook-form';
import('@solana/wallet-adapter-react-ui/styles.css' as any);
import styles from '../../styles/Home.module.css';

export function ClientWalletProvider(
  props: Omit<WalletProviderProps, 'wallets'>
): JSX.Element {
  const [endpoint, setEndpoint] = useState('https://api.devnet.solana.com');
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  const [displayInput, setDisplayInput] = useState(false);
  const { register, handleSubmit } = useForm();
  const handleChange = (event: { target: { value: any } }) => {
    switch (event.target.value) {
      case 'devnet':
        setEndpoint('https://api.devnet.solana.com');
        break;
      case 'mainnet':
        setEndpoint('https://api.mainnet-beta.solana.com');
        break;
      case 'testnet':
        setEndpoint('https://api.testnet.solana.com');
        break;
      case 'custom':
        setDisplayInput(true);
        break;
      default:
        setEndpoint('https://api.devnet.solana.com');
        break;
    }
  };

  return (
    <>
      <select onChange={handleChange} className={styles.dropdown}>
        <option value="devnet">Devnet</option>
        <option value="mainnet">Mainnet</option>
        <option value="testnet">Testnet</option>
        <option value="custom">Custom</option>
      </select>

      {displayInput && (
        <form
          onSubmit={handleSubmit((inputEndpoint: any) => {
            setEndpoint(inputEndpoint.input);
            setDisplayInput(false);
          })}
        >
          <input
            {...register('input', { required: true })}
            placeholder="Endpoint"
          />
          <input type="submit" />
        </form>
      )}
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} {...props} autoConnect>
          <WalletModalProvider {...props} />
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

export default ClientWalletProvider;

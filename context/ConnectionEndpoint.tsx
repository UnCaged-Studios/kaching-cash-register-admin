import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../styles/Home.module.css';

export const ConnectionEndpoint: FC = () => {
  const [endpoint, setEndpoint] = useState('https://api.devnet.solana.com');
  window.localStorage.setItem('endpoint', JSON.stringify(endpoint));
  const [displayInput, setDisplayInput] = useState(false);
  const { register, handleSubmit } = useForm();
  const handleChange = (event: { target: { value: any } }) => {
    switch (event.target.value) {
      case 'devnet':
        setEndpoint('https://api.devnet.solana.com');
        window.localStorage.setItem('endpoint', JSON.stringify(endpoint));
        break;
      case 'mainnet':
        setEndpoint('https://api.mainnet-beta.solana.com');
        window.localStorage.setItem('endpoint', JSON.stringify(endpoint));
        break;
      case 'testnet':
        setEndpoint('https://api.testnet.solana.com');
        window.localStorage.setItem('endpoint', JSON.stringify(endpoint));
        break;
      case 'custom':
        setDisplayInput(true);
        break;
      default:
        setEndpoint('https://api.devnet.solana.com');
        window.localStorage.setItem('endpoint', JSON.stringify(endpoint));
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
            window.localStorage.setItem('endpoint', JSON.stringify(endpoint));
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
    </>
  );
};

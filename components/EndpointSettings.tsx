import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../styles/Home.module.css';
import { Endpoint } from '../utils/Enum';
import { setLocalStorage } from '../utils/Set';

export const EndpointSettings: FC = () => {
  const [endpoint, setEndpoint] = useState(Endpoint.DEVNET);
  const [displayInput, setDisplayInput] = useState(false);
  const { register, handleSubmit } = useForm();
  const handleChange = (event: { target: { value: any } }) => {
    switch (event.target.value) {
      case 'devnet':
        setEndpoint(Endpoint.DEVNET);
        break;
      case 'mainnet':
        setEndpoint(Endpoint.MAINNET);
        break;
      case 'testnet':
        setEndpoint(Endpoint.TESTNET);
        break;
      case 'custom':
        setDisplayInput(true);
        break;
      default:
        setEndpoint(Endpoint.DEVNET);
        break;
    }
  };
  useEffect(() => {
    setLocalStorage('endpoint', JSON.stringify(endpoint));
  }, [endpoint]);
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
    </>
  );
};

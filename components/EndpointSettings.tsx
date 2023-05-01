import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { setLocalStorage } from '../utils/localStorageHandle';
import { Box, MenuItem, TextField, Button } from '@mui/material';

const updateEndpoint = [
  {
    value: 'https://api.devnet.solana.com',
    label: 'Devnet',
  },
  {
    value: 'https://api.mainnet-beta.solana.com',
    label: 'Mainet',
  },
  {
    value: 'https://api.testnet.solana.com',
    label: 'Testnet',
  },
  {
    value: 'custom',
    label: 'Custom',
  },
];

export const EndpointSettings: FC = () => {
  const [endpoint, setEndpoint] = useState('https://api.devnet.solana.com');
  const { register, handleSubmit } = useForm();
  const handleChange = async (event: any) => {
    setEndpoint(event);
  };
  useEffect(() => {
    if (endpoint) {
      setLocalStorage('endpoint', JSON.stringify(endpoint));
    }
  }, [endpoint]);
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit((inputEndpoint: any) => {
        console.log('Endpoint provided: ', inputEndpoint.input);
        setLocalStorage('endpoint', JSON.stringify(inputEndpoint.input));
        setEndpoint('custom');
      })}
    >
      <TextField
        sx={{ m: 1 }}
        id="outlined-select-currency"
        label="Endpoint"
        select
        value={endpoint}
        onChange={(v) => handleChange(v.target.value)}
        size="small"
        required
        color="secondary"
      >
        {updateEndpoint.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      {endpoint === 'custom' ? (
        <>
          <TextField
            sx={{ m: 1 }}
            id="outlined-basic"
            label="Custom Endpoint"
            variant="outlined"
            {...register('input', { required: true })}
            size="small"
            required
            color="secondary"
          />
          <Button
            sx={{ m: 1 }}
            type="submit"
            variant="contained"
            size="medium"
            color="secondary"
          >
            Submit
          </Button>
        </>
      ) : null}
    </Box>
  );
};

import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { setLocalStorage } from '../../utils/localStorageHandle';
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
  const [endpoint, setEndpoint] = useState('');
  const [displayInput, setDisplayInput] = useState(false);
  const { register, handleSubmit } = useForm();
  const handleChange = async (event: any) => {
    if (event === 'custom') {
      setDisplayInput(true);
    } else {
      setDisplayInput(false);
      setEndpoint(event);
    }
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
        setEndpoint(inputEndpoint.input);
        setDisplayInput(false);
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

      {displayInput && (
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
      )}
    </Box>
  );
};

import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Endpoint } from '../utils/Enum';
import { setLocalStorage } from '../utils/Set';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export const EndpointSettings: FC = () => {
  const [endpoint, setEndpoint] = useState(Endpoint.DEVNET);
  const [label, setLabel] = useState('');
  const [displayInput, setDisplayInput] = useState(false);
  const { register, handleSubmit } = useForm();
  const handleChange = (event: SelectChangeEvent) => {
    setLabel(event.target.value);
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
    setDisplayInput(false);
    setLocalStorage('endpoint', JSON.stringify(endpoint));
  }, [endpoint]);
  return (
    <>
      <Box sx={{ m: 1 }}>
        <FormControl size="small">
          <InputLabel>Endpoint</InputLabel>
          <Select value={label} label="Endpoint" onChange={handleChange}>
            <MenuItem value={'devnet'}>Devnet</MenuItem>
            <MenuItem value={'mainnet'}>Mainnet</MenuItem>
            <MenuItem value={'testnet'}>Testnet</MenuItem>
            <MenuItem value={'custom'}>Custom</MenuItem>
          </Select>
          <FormHelperText>Choose endpoint</FormHelperText>
        </FormControl>
      </Box>

      {displayInput && (
        <Box
          component="form"
          sx={{ '& button': { m: 1 } }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit((inputEndpoint: any) => {
            setEndpoint(inputEndpoint.input);
            setDisplayInput(false);
          })}
        >
          <TextField
            {...register('input', { required: true })}
            label="Custom Endpoint"
            variant="filled"
            sx={{ m: 1 }}
          />
          <Button type="submit" variant="contained" size="small">
            Submit
          </Button>
        </Box>
      )}
    </>
  );
};

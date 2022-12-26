import { AppBar, Box, Toolbar } from '@mui/material';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC } from 'react';
import { EndpointSettings } from './ka-ching/EndpointSettings';

export const Header: FC = () => {
  return (
    <header>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar style={{ height: '5rem' }} position="relative">
          <Toolbar sx={{ m: 1 }}>
            <Box color="inherit" sx={{ flexGrow: 1 }}>
              <EndpointSettings />
            </Box>
            <WalletMultiButton />
          </Toolbar>
        </AppBar>
      </Box>
    </header>
  );
};

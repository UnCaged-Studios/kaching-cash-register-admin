import { Box } from '@mui/material';
import Link from 'next/link';
import type { FC } from 'react';
import { navLinks } from '../routing/data';

export const Navbar: FC = () => {
  return (
    <nav>
      <Box sx={{ m: 1 }}>
        {navLinks.map((link, idx) => {
          return (
            <Link href={link.path} key={idx}>
              <h3>{link.name}</h3>
            </Link>
          );
        })}
      </Box>
    </nav>
  );
};

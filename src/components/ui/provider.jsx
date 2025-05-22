'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
import { ColorModeProvider } from './color-mode.jsx';

export function Provider(props) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system'>
      <ChakraProvider>
        <ColorModeProvider {...props} />
      </ChakraProvider>
    </ThemeProvider>
  );
}

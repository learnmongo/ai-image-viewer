import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          500: { value: '#3182ce' }, // add a custom brand color (blue)
        },
      },
      fonts: {
        heading: { value: "'Rubik', sans-serif" },
        body: { value: "'Rubik', sans-serif" },
      },
    },
  },
});

export const customSystem = createSystem(defaultConfig, customConfig);

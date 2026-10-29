/*
  Name: [Pranav Bellie]
  Date: 10.29.2026
  CSC 372-01

  This is the Vite configuration for the TVmaze React gallery. It only
  turns on the React plugin so Vite can compile JSX.
*/

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()]
});
